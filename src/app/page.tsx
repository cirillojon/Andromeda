import Image from 'next/image'
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="grid grid-cols-2 grid-rows-1 items-center justify-center w-full h-full">
      <div className="col-auto w-full lg:mt-26 lg:ml-36 md:mt-20 md:ml-20 sm:mt-14 sm:ml-14">
        <Image src="/Title.png" alt="slogan" width={589} height={325}/>
        <Button>
            Get Started
          </Button>
      </div>
      <div className="col-auto bg-gradient-to-t from-blue-400 to-indigo-200 h-screen w-full drop-shadow drop-shadown-lg">
        <div className='absolute top-72 right-48'>
          <Image src="/Solution.png" alt="Solution" width={387} height={87}/>
          
        </div>
        <div className='absolute top-48'>
          <Image src="/Hero-House.png" alt="House" width={736} height={710}/>
        </div>
      </div>
    </div>
  );
}
