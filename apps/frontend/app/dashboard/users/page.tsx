import { UserList } from "@/components/dashboard/user-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        <Link href="/dashboard/users/register">
          <Button 
            variant="default"
            size="default"
            className="min-w-[120px]"
          >
            Register New User
          </Button>
        </Link>
      </div>
      <UserList roleFilter="user" />
    </div>
  );
}
