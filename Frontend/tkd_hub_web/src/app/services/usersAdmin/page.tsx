'use client';
import { useRole } from "../../context/RoleContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const allowedRoles = ["Admin"]; // Set roles for this page

export default function UsersPage() {
  const { role } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!allowedRoles.includes(role)) {
      router.replace("/forbidden");
    }
  }, [role, router]);

  // ...rest of your page
}
