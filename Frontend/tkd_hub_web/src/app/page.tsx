"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import LoginPage from "./login/page";
import DojaangAdmin from "./dojaangAdmin/page";
import Header from "./components/Header";


export default function TKD_Hub() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      setIsLoggedIn(true);
    }
  }, []);


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="TKD_Hub logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-3xl font-bold mt-4 mb-2">Welcome to TKD_Hub</h1>
        {!isLoggedIn ? (
          <>
            <p className="mb-6 text-center max-w-md">
              Please log in to access your TKD_Hub dashboard. Enter your email and password below.
            </p>
            <LoginPage onLogin={() => setIsLoggedIn(true)} />
          </>
        ) : (
          <>
            <Header />
            <DojaangAdmin />
          </>


        )}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
