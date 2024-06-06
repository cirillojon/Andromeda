import React from 'react';
import Image from "next/image";
import "./AddressPage.css"

const AddressPage: React.FC = () => {
  
	return (
		<div className="imageContainer md:mt-16 mt-0">
			<div className="background">
				<Image
				src="/assets/services/Solar-showcase.jpeg"
				alt="House background"
				layout="fill"
				className="backgroundImage"
				/>
			</div>
			<div className="inputContainer">
				<div className="inputBox">
				<h1>Enter Address</h1>
				<input type="text" placeholder="Address" className="input" />
				</div>
			</div>
		</div>
	);
  };
  
  export default AddressPage;