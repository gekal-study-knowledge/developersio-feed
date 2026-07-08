'use client';

import * as React from 'react';
import { collection, doc, onSnapshot, writeBatch, type DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/lib/firebase/AuthProvider';
import {
  getVisitedPosts,
  saveVisitedPostsLocal,
  setCloudSync,
  type VisitedPostData,
} from '@/lib/store/useVisitedPost';

// Firestore のドキュメントID には "/" を含められないためエンコードする。
// postId 例: "2026/03/20/2026-03-20-xxxxxxx"
const encodePostId = (postId: string): string => encodeURIComponent(postId);
const decodePostId = (docId: string): string => decodeURIComponent(docId);

const readsCollectionPath = (uid: string) => `users/${uid}/reads`;

// 2つの既読レコードのうち「より新しい」方を返す。
// counter が大きい方を優先し、同じなら timestamp が新しい方を採用する。
const pickNewer = (
  a: VisitedPostData | undefined,
  b: VisitedPostData | undefined,
): VisitedPostData => {
  if (!a) return b as VisitedPostData;
  if (!b) return a;
  if (a.counter !== b.counter) return a.counter > b.counter ? a : b;
  return a.timestamp >= b.timestamp ? a : b;
};

const recordsEqual = (a: VisitedPostData | undefined, b: VisitedPostData | undefined): boolean =>
  a?.counter === b?.counter && (a?.timestamp ?? 0) === (b?.timestamp ?? 0);

/**
 * ログイン中のユーザーの既読状態を Firestore と同期する。
 * - 未ログイン時: 何もしない（既存の localStorage 動作のまま）。
 * - ログイン時: Firestore を購読し、localStorage とマージして双方向同期する。
 */
export function ReadStatusProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  React.useEffect(() => {
    if (!user) {
      // 未ログイン: クラウド同期を無効化（localStorage のみで動作）
      setCloudSync(null);
      return;
    }

    const uid = user.uid;
    const colRef = collection(db, readsCollectionPath(uid));

    // Firestore 側の最新スナップショット（差分計算の基準）
    let cloudRecords: Record<string, VisitedPostData> = {};
    let hydrated = false;

    // localStorage の変更を Firestore へ反映する（差分のみ書き込み）
    const pushToCloud = (localRecords: Record<string, VisitedPostData>) => {
      const batch = writeBatch(db);
      let changed = 0;
      Object.entries(localRecords).forEach(([postId, record]) => {
        if (!recordsEqual(record, cloudRecords[postId])) {
          batch.set(doc(colRef, encodePostId(postId)), {
            postId,
            counter: record.counter,
            timestamp: record.timestamp,
          });
          cloudRecords[postId] = record;
          changed += 1;
        }
      });
      if (changed > 0) {
        batch.commit().catch((e) => console.error('既読のクラウド同期に失敗しました:', e));
      }
    };

    // コンポーネントからの localStorage 書き込みをクラウドへ転送
    setCloudSync((records) => pushToCloud(records));

    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const next: Record<string, VisitedPostData> = {};
        snapshot.forEach((d) => {
          const data = d.data() as DocumentData;
          const postId = typeof data.postId === 'string' ? data.postId : decodePostId(d.id);
          next[postId] = {
            counter: typeof data.counter === 'number' ? data.counter : -1,
            timestamp: typeof data.timestamp === 'number' ? data.timestamp : 0,
          };
        });
        cloudRecords = next;

        // クラウドとローカルをマージし、両者へ反映する
        const local = getVisitedPosts();
        const merged: Record<string, VisitedPostData> = { ...next };
        Object.entries(local).forEach(([postId, record]) => {
          merged[postId] = pickNewer(record, next[postId]);
        });

        // localStorage を更新（クラウドへは書き戻さずループを防ぐ）
        saveVisitedPostsLocal(merged);

        // 初回同期時のみ、ローカルにしか無い/より新しいレコードをクラウドへアップロード
        if (!hydrated) {
          hydrated = true;
          pushToCloud(merged);
        }
      },
      (error) => console.error('既読の購読に失敗しました:', error),
    );

    return () => {
      unsubscribe();
      setCloudSync(null);
    };
  }, [user]);

  return <>{children}</>;
}
