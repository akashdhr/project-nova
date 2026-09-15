"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { APP_NAME } from "@/config/brand";
import { createClient } from "@/lib/supabase/browser";

export default function SignUp() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim()
          }
        }
      });
      if (error) throw error;
      
      if (data.session) {
        localStorage.setItem("token", data.session.access_token);
        router.push("/profile/setup");
      } else {
        setMessage("Account created. Check your email to verify your account, then log in.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] px-4">
      <div className="w-full max-w-md p-8 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">{APP_NAME}</h1>
          <h2 className="text-xl font-semibold">Create an account</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {message && <p className="text-green-500 text-sm text-center">{message}</p>}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">First Name</label>
              <input required type="text" className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-transparent focus:outline-none focus:border-primary" onChange={e => setForm({...form, firstName: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Last Name</label>
              <input required type="text" className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-transparent focus:outline-none focus:border-primary" onChange={e => setForm({...form, lastName: e.target.value})} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input required type="email" className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-transparent focus:outline-none focus:border-primary" onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <input required type="password" minLength={8} className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-transparent focus:outline-none focus:border-primary" onChange={e => setForm({...form, password: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Confirm Password</label>
            <input required type="password" minLength={8} className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-transparent focus:outline-none focus:border-primary" onChange={e => setForm({...form, confirm: e.target.value})} />
          </div>
          <button type="submit" className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-indigo-700 transition mt-4">
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          Already have an account? <Link href="/signin" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
