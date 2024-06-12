"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";

const SubmitForm = () => {
  const router = useRouter();

  useEffect(() => {
    const submitFormData = async () => {
      const formData = secureLocalStorage.getItem("formData");

      if (typeof formData === "string") {
        const parsedFormData = JSON.parse(formData);

        try {
          const response = await fetch("/api/form-submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": "user-id-from-session-or-cookie",
            },
            body: JSON.stringify(parsedFormData),
          });

          if (!response.ok) {
            throw new Error("Failed to submit form data");
          }

          secureLocalStorage.removeItem("formData");
          console.log("Form data submitted and removed from local storage");

          // Redirect to dashboard after submission
          router.push("/dashboard");
        } catch (error) {
          console.error("Error posting form data:", error);
        }
      } else {
        // If no form data, redirect directly to dashboard
        router.push("/dashboard");
      }
    };

    submitFormData();
  }, [router]);

  return <div>Submitting form data, please wait...</div>;
};

export default SubmitForm;
