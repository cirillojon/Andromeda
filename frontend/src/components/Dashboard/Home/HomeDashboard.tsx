import HomeProjectsCard from "../Projects/HomeProjectsCard";

const HomeDashboard = () => {
  return (
    <div className="flex-1 bg-gray-100 dark:bg-gray-800 py-4">
      <div className="mr-2 ml-2 md:mr-12 md:ml-12">
        <div className="w-full mx-auto flex mb-6 h-full">
          <HomeProjectsCard />
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
