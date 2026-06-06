import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { getDashboardData } from "@/lib/data";

export default function Home() {
  const data = getDashboardData();
  return <DashboardPage data={data} />;
}
