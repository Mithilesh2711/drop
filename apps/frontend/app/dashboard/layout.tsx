import { NavHeader } from "@/components/dashboard/nav-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavHeader />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
