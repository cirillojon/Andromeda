import FormPage from '@/components/Onboarding/Form/FormPage';

interface PageProps {
  params: {
    passed: string
  }
}

const Page = ({params}: PageProps) => {
  const passed = decodeURIComponent(params.passed).split('&');
  const address = decodeURIComponent(passed[0]);
  const monthlyBill = decodeURIComponent(passed[1]);

  console.log("address: " + address);
  console.log("monthly bill: " + monthlyBill);

  //pass the address to the form page if needed
  return (
    <div>
      <FormPage />
    </div>
  );
};

export default Page;