"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/api";
import { APP_NAME } from "@/config/brand";

export default function SignUp() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authService.signup(form);
      localStorage.setItem("token", res.data.token);
      router.push("/profile/setup");
    } catch (err) {
      alert("Error signing up");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] px-4">
      <div className="w-full max-w-md p-8 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">{APP_NAME}</h1>
          <h2 className="text-xl font-semibold">Create your account</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium">First name</label>
              <input required type="text" className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-transparent focus:outline-none focus:border-primary" onChange={e => setForm({...form, firstName: e.target.value})} />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium">Last name</label>
              <input required type="text" className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-transparent focus:outline-none focus:border-primary" onChange={e => setForm({...form, lastName: e.target.value})} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input required type="email" className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-transparent focus:outline-none focus:border-primary" onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <input required type="password" className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-transparent focus:outline-none focus:border-primary" onChange={e => setForm({...form, password: e.target.value})} />
          </div>
          <button type="submit" className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-indigo-700 transition mt-4">
            Create Account
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          Already have an account? <Link href="/signin" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
