"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { APP_NAME } from "@/config/brand";
import { createClient } from "@/lib/supabase/browser";
import api from "@/services/api"; // Added API to fetch profile

export default function SignIn() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) throw error;
      
      const token = data.session?.access_token || "";
      localStorage.setItem("token", token);

      // Check if profile is complete
      try {
        const res = await api.get('/profile');
        const profile = res.data;
        if (!profile.resumeUrl || !profile.targetRoles || profile.targetRoles.length === 0) {
          router.push("/profile/setup");
          return;
        }
      } catch (err) {
        console.error("Error fetching profile to check completeness", err);
      }

      router.push("/matches");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] px-4">
      <div className="w-full max-w-md p-8 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">{APP_NAME}</h1>
          <h2 className="text-xl font-semibold">Sign in to your account</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input required type="email" className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-transparent focus:outline-none focus:border-primary" onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <input required type="password" className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-transparent focus:outline-none focus:border-primary" onChange={e => setForm({...form, password: e.target.value})} />
          </div>
          <button type="submit" className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-indigo-700 transition mt-4">
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
