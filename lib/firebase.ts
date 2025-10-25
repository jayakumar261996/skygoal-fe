// Client-only dynamic Firebase initializer.
// Importing firebase packages on the server can pull in `undici` and cause
// build-time webpack parsing errors. This function ensures firebase modules
// are only loaded at runtime on the client.

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''
}

let _auth: any = null

export async function getAuthClient() {
  if (typeof window === 'undefined') {
    // don't try to initialize on server
    return null
  }
  if (_auth) return _auth
  try {
    // Use eval to perform a runtime-only dynamic import so bundlers
    // don't try to resolve the 'firebase/*' modules at build time when
    // the package may be absent (we support a mock fallback).
    // eslint-disable-next-line no-eval
    const firebaseApp = await eval("import('firebase/app')")
    // eslint-disable-next-line no-eval
    const firebaseAuth = await eval("import('firebase/auth')")
    const { initializeApp } = firebaseApp
    const { getAuth } = firebaseAuth
    const app = initializeApp(firebaseConfig)
    _auth = getAuth(app)
  } catch (err) {
    // package not installed or import failed; remain null and let caller fallback to mock
    return null
  }
  return _auth
}

export default getAuthClient
