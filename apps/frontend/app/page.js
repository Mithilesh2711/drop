import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { LoginForm } from "../components/auth/login-form";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Welcome to Drop</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
