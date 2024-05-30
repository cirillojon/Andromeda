import CustomerSupportChat from "@/components/Dashboard/CustomerSupportChat";
import DashboardNavBar from "@/components/Dashboard/DashboardNavBar";

const page = () => {
  return (
    <div>
      <DashboardNavBar />
      <h1>Projects</h1>
      <CustomerSupportChat />
    </div>
  );
};
export default page;
