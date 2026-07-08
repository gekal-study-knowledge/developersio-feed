import { useState, useEffect, useCallback } from 'react';

export const VISITED_KEY = 'visited_posts';
export const VISITED_TIMESTAMPS_KEY = 'visited_posts_timestamps';

/** localStorage 更新をアプリ全体へ通知するイベント名 */
export const VISITED_UPDATED_EVENT = 'visited-posts-updated';

export interface VisitedPostData {
  counter: number;
  timestamp: number; // 訪問時刻 (epoch ms)
}

const cleanupOldVisitedPosts = () => {
  if (typeof window === 'undefined') return;

  try {
    const now = new Date();
    const firstOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const timestampsData = localStorage.getItem(VISITED_TIMESTAMPS_KEY);
    if (!timestampsData) return;

    const timestamps: Record<string, number> = JSON.parse(timestampsData);
    const filteredTimestamps: Record<string, number> = {};

    let hasChanges = false;
    for (const [key, timestamp] of Object.entries(timestamps)) {
      if (timestamp >= firstOfPreviousMonth.getTime()) {
        filteredTimestamps[key] = timestamp;
      } else {
        hasChanges = true;
      }
    }

    if (hasChanges) {
      localStorage.setItem(VISITED_TIMESTAMPS_KEY, JSON.stringify(filteredTimestamps));
    }
  } catch (error) {
    console.error('Failed to cleanup old visited posts:', error);
  }
};

export const getVisitedPosts = (): Record<string, VisitedPostData> => {
  if (typeof window === 'undefined') return {};

  const visitedPosts: Record<string, VisitedPostData> = {};
  try {
    const parsedData = JSON.parse(localStorage.getItem(VISITED_KEY) || '{}');
    const timestampsData = JSON.parse(localStorage.getItem(VISITED_TIMESTAMPS_KEY) || '{}');

    if (Array.isArray(parsedData)) {
      parsedData.forEach((postId) => {
        if (typeof postId === 'string') {
          visitedPosts[postId] = { counter: -1, timestamp: 0 };
        }
      });
    } else if (parsedData !== null && typeof parsedData === 'object') {
      for (const [key, counter] of Object.entries(parsedData)) {
        visitedPosts[key] = {
          counter: counter as number,
          timestamp: timestampsData[key] || 0,
        };
      }
    }
  } catch (error) {
    console.error('Failed to parse visited_posts:', error);
  }

  cleanupOldVisitedPosts();
  return visitedPosts;
};

// ---------------------------------------------------------------------------
// クラウド同期フック
// ログイン中はここに ReadStatusProvider が同期関数を登録し、localStorage への
// 書き込みを Firestore へ反映する。未登録（未ログイン）時は何もしない。
// ---------------------------------------------------------------------------
type CloudSyncFn = (records: Record<string, VisitedPostData>) => void;
let cloudSync: CloudSyncFn | null = null;

export const setCloudSync = (fn: CloudSyncFn | null): void => {
  cloudSync = fn;
};

/** レコード全体を localStorage の2キーへ書き込み、変更イベントを発火する。
 *  （クラウドへは反映しない。Firestore からのハイドレーション時に使用し同期ループを避ける） */
export const saveVisitedPostsLocal = (records: Record<string, VisitedPostData>): void => {
  if (typeof window === 'undefined') return;
  const counters: Record<string, number> = {};
  const timestamps: Record<string, number> = {};
  for (const [key, data] of Object.entries(records)) {
    counters[key] = data.counter;
    timestamps[key] = data.timestamp;
  }
  localStorage.setItem(VISITED_KEY, JSON.stringify(counters));
  localStorage.setItem(VISITED_TIMESTAMPS_KEY, JSON.stringify(timestamps));
  window.dispatchEvent(new CustomEvent(VISITED_UPDATED_EVENT));
};

/** localStorage を更新し、変更イベント発火＋（ログイン中なら）クラウドへ反映する。
 *  コンポーネントからのユーザー操作による書き込みはこちらを使う。 */
export const saveVisitedPosts = (records: Record<string, VisitedPostData>): void => {
  saveVisitedPostsLocal(records);
  cloudSync?.(records);
};

interface UseVisitedPostProps {
  year: string;
  month: string;
  day: string;
  slug: string;
  newsCounter: number;
}

export const useVisitedPost = ({ year, month, day, slug, newsCounter }: UseVisitedPostProps) => {
  const [isVisited, setIsVisited] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<string>('');
  const [savedCounter, setSavedCounter] = useState<number | null>(null);

  const currentPostId = `${year}/${month}/${day}/${slug}`;

  useEffect(() => {
    const sync = () => {
      const visitedPosts = getVisitedPosts();
      const postData = visitedPosts[currentPostId];

      if (postData !== undefined) {
        setIsVisited(true);
        const isPostUpdated = postData.counter !== newsCounter;
        setIsUpdated(isPostUpdated);

        if (isPostUpdated) {
          setSavedCounter(postData.counter);
          if (postData.timestamp > 0) {
            const now = Date.now();
            const diffMs = now - postData.timestamp;
            setElapsedTime(formatElapsedTime(diffMs));
          }
        } else {
          setSavedCounter(null);
          setElapsedTime('');
        }
      } else {
        setIsVisited(false);
        setIsUpdated(false);
        setElapsedTime('');
        setSavedCounter(null);
      }
    };

    sync();
    // localStorage が更新（クラウド同期含む）されたら再評価する
    window.addEventListener(VISITED_UPDATED_EVENT, sync);
    return () => window.removeEventListener(VISITED_UPDATED_EVENT, sync);
  }, [currentPostId, newsCounter]);

  const markAsVisited = useCallback(() => {
    const visitedPosts = getVisitedPosts();
    const postData = visitedPosts[currentPostId];

    if (postData === undefined || postData.counter !== newsCounter) {
      visitedPosts[currentPostId] = { counter: newsCounter, timestamp: Date.now() };
      saveVisitedPosts(visitedPosts);

      setIsVisited(true);
      setIsUpdated(false);
      setElapsedTime('');
      setSavedCounter(null);
    }
  }, [currentPostId, newsCounter]);

  return { isVisited, isUpdated, elapsedTime, markAsVisited, savedCounter };
};

const formatElapsedTime = (diffMs: number): string => {
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}日前`;
  } else if (hours > 0) {
    return `${hours}時間前`;
  } else if (minutes > 0) {
    return `${minutes}分前`;
  } else {
    return `${seconds}秒前`;
  }
};
