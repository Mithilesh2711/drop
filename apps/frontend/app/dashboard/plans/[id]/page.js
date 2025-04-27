import { PlanForm } from "../../../../components/dashboard/plan-form";

export default function PlanPage({ params }) {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Plan Details</h1>
      <PlanForm planId={params.id} />
    </div>
  );
}
