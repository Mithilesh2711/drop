import UserRegistrationForm from "@/components/auth/user-registration-form";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function RegisterPage() {
  return (
    <div className="container mx-auto py-8">
      <ErrorBoundary>
        <UserRegistrationForm />
      </ErrorBoundary>
    </div>
  );
}
