import FormPage from "@/components/Onboarding/Form/FormPage";

interface PageProps {
  params: {
    passed: string;
  };
}

const Page = ({ params }: PageProps) => {
  const passed = decodeURIComponent(params.passed).split("&");
  const address = decodeURIComponent(passed[0]);
  const monthlyBill = decodeURIComponent(passed[1]);
  return (
    <div>
      <FormPage monthlyBill={Number(monthlyBill)} />
    </div>
  );
};

export default Page;
