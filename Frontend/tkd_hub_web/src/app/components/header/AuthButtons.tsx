"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

const AuthButtons: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <>
      {isLoggedIn ? (
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="ml-4 px-4 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center transition duration-300 ease-in-out"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={() => router.push("/login")}
          className="px-4 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center transition duration-300 ease-in-out"
        >
          Login
        </button>
      )}
    </>
  );
};

export default AuthButtons;
