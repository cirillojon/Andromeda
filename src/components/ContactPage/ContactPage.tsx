"use client";
import React, { useRef, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Asterisk } from "lucide-react";
import { toast } from "sonner";

const ContactPage = () => {
  const router = useRouter();
  const [isFormValid, setIsFormValid] = useState(false);
  const [firstNameAestrisk, setFirstNameAestrisk] = useState(true);
  const [lastNameAestrisk, setLastNameAestrisk] = useState(true);
  const [emailAestrisk, setEmailAestrisk] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    target.style.height = "10px";
    target.style.height = `${Math.min(target.scrollHeight, 96)}px`;
  };

  const checkFormValidity = () => {
    const firstName = document.getElementById("firstname") as HTMLInputElement;
    const lastName = document.getElementById("lastname") as HTMLInputElement;
    const email = document.getElementById("email") as HTMLInputElement;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setFirstNameAestrisk(!firstName.value);
    setLastNameAestrisk(!lastName.value);
    setEmailAestrisk(!emailRegex.test(email.value));

    setIsFormValid(
      firstName.value.length > 0 &&
        lastName.value.length > 0 &&
        emailRegex.test(email.value)
    );
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isFormValid) {
      const formData = new FormData(event.target as HTMLFormElement);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Thank you for your message!");
        router.push("/");
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
      <div className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 shadow-input bg-gray-50 dark:bg-black border-2 drop-shadow-lg">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Contact Us
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Send us a message!
        </p>
        <form onSubmit={handleSubmit} className="my-8">
          <input
            type="hidden"
            name="access_key"
            value="cf9ccc3d-7946-43c5-90cc-ec9f30fca388"
          />
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <div className="flex items-center">
                <Label htmlFor="firstname">First name</Label>
                <div hidden={!firstNameAestrisk}>
                  <Asterisk className="text-red-500 h-4 w-4" />
                </div>
              </div>
              <Input
                id="firstname"
                placeholder="John"
                type="text"
                name="firstname"
                onInput={checkFormValidity}
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <div className="flex items-center">
                <Label htmlFor="lastname">Last name</Label>
                <div hidden={!lastNameAestrisk}>
                  <Asterisk className="text-red-500 h-4 w-4 " />
                </div>
              </div>
              <Input
                id="lastname"
                placeholder="Doe"
                type="text"
                name="lastname"
                onInput={checkFormValidity}
              />
            </LabelInputContainer>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                placeholder="N/A"
                name="message"
                className="overflow-auto resize-none h-10 min-h-10 max-h-24 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                onInput={handleInput}
                ref={textareaRef}
                style={{ overflowY: "hidden" }}
              />
            </LabelInputContainer>
          </div>
          <LabelInputContainer className="mb-4">
            <div className="flex items-center">
              <Label htmlFor="email">Email Address</Label>
              <div hidden={!emailAestrisk}>
                <Asterisk className="text-red-500 h-4 w-4 " />
              </div>
            </div>
            <Input
              id="email"
              placeholder="homeimprovement@test.com"
              type="email"
              name="email"
              onInput={checkFormValidity}
              onEmptied={() => setEmailAestrisk(true)}
            />
          </LabelInputContainer>
          <button
            className=" disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
            disabled={!isFormValid}
          >
            Submit &rarr;
            <BottomGradient />
          </button>
          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        </form>
      </div>
    </div>
  );
};

export default ContactPage;

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
