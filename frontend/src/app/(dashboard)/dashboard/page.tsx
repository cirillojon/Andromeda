import DashboardNavBar from "@/components/Dashboard/DashboardNavBar";
import HomeDashboard from "@/components/Dashboard/HomeDashboard";
import CustomerSupportChat from "@/components/Dashboard/CustomerSupportChat";
const page = async () => {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNavBar />
      <HomeDashboard />
      <CustomerSupportChat />
    </div>
  );
};
export default page;
