"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import getAuthClient from "./firebase";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";

type AuthContextValue = {
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const isFirebaseConfigured = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // read current mock user (session) if present and finish
      const current = localStorage.getItem("mock_current_user");
      if (current) setUser(JSON.parse(current));
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        const auth = await getAuthClient();
        const unsubscribe = onAuthStateChanged(auth, (u) => {
          setUser(u);
          setLoading(false);
        });
        return () => unsubscribe();
      } catch (err) {
        console.error("Error initializing auth:", err);
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isFirebaseConfigured) {
      // lookup in mock users list
      const raw = localStorage.getItem("mock_users");
      const users = raw ? JSON.parse(raw) as Array<any> : [];
      const found = users.find(u => u.email === email && u.password === password);
      if (!found) throw new Error("Invalid email or password");
      // set current session in both localStorage (for client) and cookie (for middleware)
      const userData = { uid: found.uid, email: found.email };
      localStorage.setItem("mock_current_user", JSON.stringify(userData));
      document.cookie = `mock_current_user=${JSON.stringify(userData)}; path=/`;
      setUser(userData);
      return;
    }
    const auth = await getAuthClient();
    if (!auth) throw new Error("Firebase auth initialization failed");
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    if (!isFirebaseConfigured) {
      // maintain a list of mock users in localStorage so we can check for duplicates
      const raw = localStorage.getItem("mock_users");
      const users = raw ? JSON.parse(raw) as Array<any> : [];
      if (users.find(u => u.email === email)) {
        throw new Error("This email is already registered. Please log in.");
      }
      const mock = { uid: "mock-" + Date.now().toString(), email, password };
      users.push(mock);
      localStorage.setItem("mock_users", JSON.stringify(users));
      // set current session in both localStorage (for client) and cookie (for middleware)
      localStorage.setItem("mock_current_user", JSON.stringify({ uid: mock.uid, email: mock.email }));
      document.cookie = `mock_current_user=${JSON.stringify({ uid: mock.uid, email: mock.email })}; path=/`;
      setUser({ uid: mock.uid, email: mock.email });
      return;
    }

    const auth = await getAuthClient();
    try {
      if (!auth) throw new Error("Firebase auth initialization failed");
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        throw new Error("This email is already registered. Please log in instead.");
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Invalid email address.");
      } else if (error.code === "auth/weak-password") {
        throw new Error("Password must be at least 6 characters.");
      } else {
        throw new Error("Failed to create account. Please try again.");
      }
    }
  };

  const signOut = async () => {
     if (!isFirebaseConfigured) {
      localStorage.removeItem("mock_current_user");
      document.cookie = "mock_current_user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      setUser(null);
      return;
    }
    const auth = await getAuthClient();
    if (!auth) throw new Error("Firebase auth initialization failed");
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export default useAuth;
