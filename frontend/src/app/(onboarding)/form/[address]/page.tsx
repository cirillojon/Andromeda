"use client";
import { useParams } from 'next/navigation';
import FormPage from '@/components/Onboarding/Form/FormPage';

const Page: React.FC = () => {
  const searchParams = useParams();
  const paramAddress = searchParams.address.toString();
  const address = decodeURIComponent(paramAddress);

  //pass the address to the form page if needed
  return (
    <div>
      <FormPage />
    </div>
  );
};

export default Page;