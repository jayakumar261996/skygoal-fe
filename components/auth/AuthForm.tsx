"use client";
import React, { useState } from "react";
import Link from "next/link";

type AltAction = { label: string; href: string; linkText?: string };

type Props = {
  title: string;
  submitLabel: string;
  onSubmit: (email: string, password: string) => Promise<void>;
  altAction?: AltAction;
};

export default function AuthForm({ title, submitLabel, onSubmit, altAction }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email) return "Please enter your email";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email";
    if (!password || password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) return setError(v);
    try {
      setLoading(true);
      await onSubmit(email, password);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-xl transform transition-all duration-500 hover:scale-[1.01]">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">{title}</h2>
          <p className="mt-2 text-center text-sm text-gray-500">Welcome — please {title.toLowerCase()} to continue.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                className="appearance-none rounded relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="appearance-none rounded relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200"
              />
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transform active:scale-95 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Please wait..." : submitLabel}
            </button>
          </div>
        </form>

        {altAction && (
          <p className="mt-2 text-center text-sm text-gray-600">
            {altAction.label}{" "}
            <Link href={altAction.href} className="font-medium text-indigo-600 hover:text-indigo-500">
              {altAction.linkText ?? altAction.href}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
