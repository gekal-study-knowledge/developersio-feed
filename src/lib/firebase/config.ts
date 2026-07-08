import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Firebase Web SDK 設定。
// これらの値はクライアントバンドルに埋め込まれる公開情報であり、秘匿する必要はない。
// セキュリティは Firestore ルールと Firebase Auth の認可ドメインで担保される。
// 環境変数 (.env.local) があればそちらを優先し、無ければ公開値にフォールバックする
// （GitHub Actions では .env* を配置しないためフォールバックが使われる）。
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyCYHcAobwbZBh15Tcw6qVE4Gd7X2170IQE',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'developersio-feed.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'developersio-feed',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'developersio-feed.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '640147988287',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '1:640147988287:web:ad982965adcf8b6d95bd8a',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? 'G-XP90L4ZF6X',
};

// Next.js の Fast Refresh / SSR で多重初期化されないようにする
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
