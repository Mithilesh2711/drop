import { UserList } from "@/components/dashboard/user-list";

export default function EmployeesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Employees</h1>
      <UserList roleFilter="admin" />
    </div>
  );
}
