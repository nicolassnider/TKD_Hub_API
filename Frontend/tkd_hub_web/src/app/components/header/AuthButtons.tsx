"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import GenericButton from "../common/actionButtons/GenericButton";

const AuthButtons: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <>
      {isLoggedIn ? (
        <GenericButton
          type="button"
          variant="error"
          className="ml-4"
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          Logout
        </GenericButton>
      ) : (
        <GenericButton
          type="button"
          variant="primary"
          onClick={() => router.push("/login")}
        >
          Login
        </GenericButton>
      )}
    </>
  );
};

export default AuthButtons;
