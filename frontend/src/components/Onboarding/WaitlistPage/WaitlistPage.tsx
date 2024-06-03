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

		setIsFormValid(
			emailRegex.test(email.value)
		);
	};
		
	return (
		<div className="grid grid-cols-1 grid-rows-1 items-center justify-center max-w-fit h-full md:grid-cols-2 drop-shadow-2xl mt-16">
			<div className="flex flex-col h-full md:h-screen items-center justify-center">
			<div className="flex w-full h-full flex-col items-center">
				<div className="flex w-full h-full">
				<Image
					src="/assets/hero/florida_better.jpg"
					alt="House"
					width={500}
					height={20}
				/>
				</div>
			</div>
			</div>
			<div className="flex flex-col w-full mt-0 mb-14 md:mb-0">
				<h1 className="scaling-header-text">
					Join Our Waitlist
				</h1>
				<div className="flex items-center">
					<Label htmlFor="email">Email Address</Label>
				</div>
				<Input
				id="email"
				placeholder="homeimprovement@test.com"
				type="email"
				name="email"
				onInput={checkFormValidity}
				onEmptied={() => setIsFormValid(false)}
				/>
			<div className="flex flex-col items-center text-center">
				<span className="scaling-text w-2/3 mt-8">
					Romeo is initially launching in the Tampa and Orlando areas. Enter your email above to be alerted when we go live!
				</span>
				<span className="scaling-text w-2/3 mt-8">
					The first 100 homeowners to sign-up will receive a promotional offer upon launch.
				</span>
			</div>
			</div>
			
		</div>
		
	);
};

export default WaitlistPage;