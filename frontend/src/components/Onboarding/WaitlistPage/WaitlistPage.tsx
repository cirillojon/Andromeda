"use client";
import React, { useState, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { cn } from "@/lib/utils";
import { Asterisk } from "lucide-react";
import { toast } from "sonner";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const WaitlistPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    contactPhone: "",
    location: "",
    serviceInterest: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [emailAsterisk, setEmailAsterisk] = useState(true);
  const [nameAsterisk, setNameAsterisk] = useState(true);
  const [contactPhoneAsterisk, setContactPhoneAsterisk] = useState(true);
  const [locationAsterisk, setLocationAsterisk] = useState(true);
  const [serviceInterestAsterisk, setServiceInterestAsterisk] = useState(true);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // Validate the inputs
    if (name === "email") setEmailAsterisk(!emailRegex.test(value));
    if (name === "name") setNameAsterisk(!value);
    if (name === "contactPhone") setContactPhoneAsterisk(!value);
    if (name === "location") setLocationAsterisk(!value);
    if (name === "serviceInterest") setServiceInterestAsterisk(!value);

    // Check overall form validity
    setIsFormValid(
      emailRegex.test(name === "email" ? value : formData.email) &&
        (name === "name" ? value.length > 0 : formData.name.length > 0) &&
        (name === "contactPhone"
          ? value.length > 0
          : formData.contactPhone.length > 0) &&
        (name === "location"
          ? value.length > 0
          : formData.location.length > 0) &&
        (name === "serviceInterest"
          ? value.length > 0
          : formData.serviceInterest.length > 0)
    );
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isFormValid) {
      const formData = new FormData(event.target as HTMLFormElement);
      const json = Object.fromEntries(formData.entries());

      try {
        const response = await fetch("/api/waitlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(json),
        });

        if (response.ok) {
          toast.success("Waitlist entry created successfully");
        } else {
          toast.error("Failed to create waitlist entry");
        }
      } catch (error) {
        console.error(
          "An error occurred while creating the waitlist entry:",
          error
        );
        toast.error("An error occurred while creating the waitlist entry");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
      <div className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 shadow-input bg-gray-50 dark:bg-black border-2 drop-shadow-lg">
        <h1 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Join Our Waitlist
        </h1>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Enter your details below to join our waitlist!
        </p>
        <form onSubmit={handleSubmit} className="my-8">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <div className="flex items-center">
                <Label htmlFor="name">Name</Label>
                <div hidden={!nameAsterisk}>
                  <Asterisk className="text-red-500 h-4 w-4" />
                </div>
              </div>
              <Input
                id="name"
                placeholder="John Doe"
                type="text"
                name="name"
                onInput={handleInputChange}
              />
            </LabelInputContainer>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <div className="flex items-center">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <div hidden={!contactPhoneAsterisk}>
                  <Asterisk className="text-red-500 h-4 w-4" />
                </div>
              </div>
              <Input
                id="contactPhone"
                placeholder="(123) 456-7890"
                type="text"
                name="contactPhone"
                onInput={handleInputChange}
              />
            </LabelInputContainer>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <div className="flex items-center">
                <Label htmlFor="location">Location</Label>
                <div hidden={!locationAsterisk}>
                  <Asterisk className="text-red-500 h-4 w-4" />
                </div>
              </div>
              <Input
                id="location"
                placeholder="City, State"
                type="text"
                name="location"
                onInput={handleInputChange}
              />
            </LabelInputContainer>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <div className="flex items-center">
                <Label htmlFor="serviceInterest">Service Interest</Label>
                <div hidden={!serviceInterestAsterisk}>
                  <Asterisk className="text-red-500 h-4 w-4" />
                </div>
              </div>
              <Input
                id="serviceInterest"
                placeholder="Solar Panels, Roofing, etc."
                type="text"
                name="serviceInterest"
                onInput={handleInputChange}
              />
            </LabelInputContainer>
          </div>
          <LabelInputContainer className="mb-4">
            <div className="flex items-center">
              <Label htmlFor="email">Email Address</Label>
              <div hidden={!emailAsterisk}>
                <Asterisk className="text-red-500 h-4 w-4 " />
              </div>
            </div>
            <Input
              id="email"
              placeholder="homeimprovement@test.com"
              type="email"
              name="email"
              onInput={handleInputChange}
              onEmptied={() => setEmailAsterisk(true)}
            />
          </LabelInputContainer>
          <button
            className=" disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
            disabled={!isFormValid}
          >
            Subscribe &rarr;
            <BottomGradient />
          </button>
        </form>
        <div className="flex flex-col items-center text-center">
          <span className="text-neutral-600 text-sm dark:text-neutral-300 mt-8">
            Romeo is initially launching in the Tampa and Orlando areas. Enter
            your email above to be alerted when we go live!
          </span>
          <span className="text-neutral-600 text-sm dark:text-neutral-300 mt-4">
            The first 100 homeowners to sign-up will receive a promotional offer
            upon launch.
          </span>
        </div>
      </div>
      <div className="hidden md:block md:w-1/2">
        <Image
          src="/assets/hero/florida_better.jpg"
          alt="Florida Map"
          width={500}
          height={200}
        />
      </div>
    </div>
  );
};

export default WaitlistPage;

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
