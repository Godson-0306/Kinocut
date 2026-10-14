import type { Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Client login for the Kinocut edit bay. The door is not connected yet.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginForm />;
}
