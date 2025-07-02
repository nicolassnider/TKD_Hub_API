"use client";

import LoginForm from "../components/login/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900">
      <div className="w-full max-w-md bg-neutral-900 rounded-xl shadow-lg p-8 flex flex-col gap-6 border border-neutral-700">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-neutral-100 tracking-tight">
          TKD_Hub Login
        </h2>
        <LoginForm />
      </div>
    </div>
  );
}
