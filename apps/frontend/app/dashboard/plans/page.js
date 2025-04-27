import { PlanList } from "../../../components/dashboard/plan-list";

export default function Plans() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Plans</h1>
      <PlanList />
    </div>
  );
}
