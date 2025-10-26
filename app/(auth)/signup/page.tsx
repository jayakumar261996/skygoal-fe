"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import AuthForm from "@/components/auth/AuthForm";
import toast from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const { signUp, user, loading } = useAuth();

  // if already signed in, don't show signup page — navigate away
  useEffect(() => {
    if (!loading && user) {
      router.replace("/products");
    }
  }, [loading, user, router]);

  // avoid flashing the signup form while auth is initializing or when user is present
  if (loading) {
    return <div className="p-6">Loading...</div>;
  }
  if (user) {
    return null;
  }

  const handleSubmit = async (email: string, password: string) => {
    try {
      await signUp(email, password);
      toast.success('Account created successfully!');
      router.push("/products");
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error; // re-throw to let AuthForm handle it
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-4xl w-full mx-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:flex flex-col items-start p-8 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-lg">
          <h1 className="text-4xl font-extrabold mb-4">Create account</h1>
          <p className="opacity-90 mb-6">Join Skygoal and manage your products with ease.</p>
          <div className="w-full mt-auto">
            <img src="/auth-illustration.svg" alt="Skygoal illustration" className="w-full h-auto max-h-56 object-contain" />
          </div>
        </div>

        <AuthForm
          title="Sign Up"
          submitLabel="Create account"
          onSubmit={handleSubmit}
          altAction={{ label: "Already have an account?", href: "/login", linkText: "Login" }}
        />
      </div>
    </div>
  );
}
