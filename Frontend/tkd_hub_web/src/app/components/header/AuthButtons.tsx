"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import GenericButton from "../common/actionButtons/GenericButton";

interface AuthButtonsProps {
  isLoggedIn: boolean;
  className?: string;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({
  isLoggedIn,
  className = "",
}) => {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <>
      {isLoggedIn ? (
        <GenericButton
          type="button"
          variant="error"
          className={className}
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          <i
            className="bi bi-box-arrow-right mr-3 text-lg"
            aria-hidden="true"
          ></i>
          Logout
        </GenericButton>
      ) : (
        <GenericButton
          type="button"
          variant="primary"
          className={className}
          onClick={() => router.push("/login")}
        >
          <i
            className="bi bi-box-arrow-in-right mr-3 text-lg"
            aria-hidden="true"
          ></i>
          Login
        </GenericButton>
      )}
    </>
  );
};

export default AuthButtons;
