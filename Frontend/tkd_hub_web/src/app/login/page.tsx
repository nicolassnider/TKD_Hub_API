"use client";

import LoginForm from "../components/login/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-neutral-800">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8 flex flex-col gap-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900 dark:text-white tracking-tight">
          TKD_Hub Login
        </h2>
        <LoginForm />
      </div>
    </div>
  );
}
