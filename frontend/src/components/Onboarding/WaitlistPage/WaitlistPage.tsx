"use client";
import Image from "next/image";
import React, { useRef, useState, FormEvent } from 'react';
import { cn } from "@/lib/utils";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import "./WaitlistPage.css";

const WaitlistPage = () => {
	const [isFormValid, setIsFormValid] = useState(false);

	const checkFormValidity = () => {
		const email = document.getElementById("email") as HTMLInputElement;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		console.log(isFormValid);

		setIsFormValid(
			emailRegex.test(email.value)
		);
	};
		
	return (
		<div className="grid grid-cols-1 grid-rows-1 items-center justify-center max-w-fit h-full md:grid-cols-2 drop-shadow-2xl mt-16">
			<div className="flex flex-col mt-0 mb-14 md:mb-0">
				<h1 className="scaling-header-text md:mb-10">
					Join Our Waitlist
				</h1>
				<span className="scaling-text flex m-auto mb-2 mt-8">Email</span>
				<div className="flex m-auto md:mb-10">
					<Input
						id="email"
						placeholder="Email Address"
						type="email"
						name="email"
						onInput={checkFormValidity}
						onEmptied={() => setIsFormValid(false)}
					/>
					<button disabled={!isFormValid} className="ml-2 py-2 px-4 rounded text-white bg-indigo-400 hover:bg-indigo-600">
						Subscribe
					</button>
				</div>
				<div className="flex flex-col items-center text-center">
					<span className="scaling-text w-2/3 mt-8">
						Romeo is initially launching in the Tampa and Orlando areas. Enter your email above to be alerted when we go live!
					</span>
					<span className="scaling-text w-2/3 mt-4">
						The first 100 homeowners to sign-up will receive a promotional offer upon launch.
					</span>
				</div>
			</div>
			<div className="flex md:w-full md:h-full flex-col items-end w-0 h-0">
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