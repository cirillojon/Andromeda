import AddressPage from "@/components/Onboarding/Form/AddressPage";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const page = async() => {
  const user = getKindeServerSession();
  const isLoggedIn = await user.isAuthenticated();
  return (
    <div>
      <AddressPage isLoggedIn={isLoggedIn}/>
    </div>
  );
}

export default page;
