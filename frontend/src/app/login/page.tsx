import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="container mx-auto py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
      <LoginForm />
    </div>
  );
}

export const revalidate = 0;