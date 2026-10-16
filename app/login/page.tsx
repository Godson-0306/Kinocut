import type { Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to the Kinocut edit bay.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginForm />;
}
