import FormPage from "@/components/Onboarding/Form/FormPage";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

interface PageProps {
  params: {
    passed: string;
  };
}

const Page = async({ params }: PageProps) => {
  const passed = decodeURIComponent(params.passed).split("&");
  const address = decodeURIComponent(passed[0]);
  const monthlyBill = decodeURIComponent(passed[1]);

  const user = getKindeServerSession();
  const isLoggedIn = await user.isAuthenticated();
  return (
    <div>
      <FormPage monthlyBill={Number(monthlyBill)} isLoggedIn={isLoggedIn} address={address} />
    </div>
  );
};

export default Page;
