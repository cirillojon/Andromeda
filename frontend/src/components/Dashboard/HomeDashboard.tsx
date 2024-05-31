import HomeProjectsCard from "./Projects/HomeProjectsCard";
import HomeFinancesCard from "./Finances/HomeFinancesCard";
import HomeInstallersCard from "./Installers/HomeInstallersCard";

const HomeDashboard = () => {
  return (
    <div className="flex-1 bg-gray-100 dark:bg-gray-800 py-8">
      <div className="mr-12 ml-12">
        <div className="w-full mx-auto flex mb-6 justify-center">
          <HomeProjectsCard />
        </div>
        <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <HomeFinancesCard />
          <HomeInstallersCard />
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
