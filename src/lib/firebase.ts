import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, memoryLocalCache, doc, getDocFromServer } from "firebase/firestore";
import firebaseConfigJson from "../../firebase-applet-config.json";

let firebaseConfig: any = firebaseConfigJson || {};

try {
  if (!firebaseConfig.projectId) {
    const envConfig = typeof process !== 'undefined' && process.env.FIREBASE_APP_CONFIG 
      ? process.env.FIREBASE_APP_CONFIG 
      : ((import.meta as any).env && (import.meta as any).env.VITE_FIREBASE_APP_CONFIG);
    if (envConfig) {
      firebaseConfig = JSON.parse(envConfig);
    }
  }
} catch (e) {
  console.error("Failed to parse Firebase config", e);
}

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  localCache: memoryLocalCache(),
});

const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('Could not reach Cloud Firestore backend'))) {
      console.warn("Firestore running in offline mode or establishing connection.");
    } else {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export { app, db, auth };


