import Image from "next/image";
import { Button } from "@/components/ui/button";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

export default function Home() {
  return (
    <div>
      <div className="grid grid-cols-1 grid-rows-1 items-center justify-center max-w-fit h-full md:grid-cols-2 drop-shadow-2xl">
        <div className="flex flex-col w-full mt-24 md:mt-0 mb-14 md:mb-0">
          <div className="flex flex-col text-center items-center">
            <h1 className="text-3xl lg:text-6xl md:text-5xl sm:text-3xl w-2/3 font-serif">
              Empowering{" "}
              <span className="text-gradient text-green-600">You</span>
            </h1>
            <h1 className="text-3xl lg:text-6xl md:text-5xl sm:text-3xl w-2/3 font-serif">
              To Take{" "}
              <span className="text-gradient text-blue-400">Control</span>
            </h1>
            <h1 className="text-3xl lg:text-6xl md:text-5xl sm:text-3xl w-2/3 font-serif">
              Of <span className="text-gradient text-yellow-500">Your</span>{" "}
              <span className="text-gradient text-purple-600">Home</span>
            </h1>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="w-2/3 mt-8">
              Tech-driven approach that focuses on delivering a seamless,
              cost-effective, and sustainable home improvement experience for
              every homeowner
            </span>
          </div>
          <div className="flex flex-col items-center mb-6 md:mb-0">
            <Button className="mt-6 hover:bg-opacity-50 drop-shadow-2xl">
              Get Started
            </Button>
          </div>
        </div>
        <div className="flex flex-col h-full md:h-screen items-center justify-center bg-gradient-to-t from-transparent to-indigo-200 mb-20 md:mb-0">
          <div className="flex flex-col text-center items-center justify-center mt-6 md:mt-0 mb-6">
            <h1 className="text-3xl text-center items-center md:text-left lg:text-6xl md:text-5xl sm:text-3xl font-serif">
              One Stop Solution
            </h1>
          </div>
          <div className="flex flex-col text-center items-center">
            <span className="mt-2">
              Design, customize, and order your own <br />
              solar system, roof, and HVAC.
            </span>
          </div>
          <div className="flex flex-col items-center -mt-32 -mb-36">
            <div className="flex items-center">
              <Image
                src="/Hero-House.png"
                alt="House"
                width={500}
                height={20}
              />
            </div>
          </div>
        </div>
      </div>
      <StickyScroll />
    </div>
  );  
}
