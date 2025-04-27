import UserRegistrationForm from "../../../components/auth/user-registration-form";

export default function UserRegistration() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">User Registration</h1>
      <UserRegistrationForm />
    </div>
  );
}
