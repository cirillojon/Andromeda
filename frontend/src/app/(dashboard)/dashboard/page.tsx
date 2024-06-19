import HomeDashboard from "@/components/Dashboard/Home/HomeDashboard";
const page = async () => {
  return (
    <div className="flex flex-col h-screen overflow-y-auto">
      <HomeDashboard />
    </div>
  );
};
export default page;
