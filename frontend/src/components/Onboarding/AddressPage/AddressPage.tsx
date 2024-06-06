"use client";

import React, {useEffect} from 'react';
import Image from "next/image";
import "./AddressPage.css"

function initAutocomplete() {
	const map = new google.maps.Map(
	  document.getElementById("map") as HTMLElement,
	  {
		center: { lat: -33.8688, lng: 151.2195 },
		zoom: 13,
		mapTypeId: "roadmap",
	  }
	);
  
	// Create the search box and link it to the UI element.
	const input = document.getElementById("pac-input") as HTMLInputElement;
	const searchBox = new google.maps.places.SearchBox(input);
  
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  
	// Bias the SearchBox results towards current map's viewport.
	map.addListener("bounds_changed", () => {
	  searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
	});
  
	let markers: google.maps.Marker[] = [];
  
	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	searchBox.addListener("places_changed", () => {
	  const places = searchBox.getPlaces();
  
	  if (places) {
		if (places.length == 0) {
			return;
		}
		// Clear out the old markers.
		markers.forEach((marker) => {
			marker.setMap(null);
		  });
		  markers = [];
	  
		  // For each place, get the icon, name and location.
		  const bounds = new google.maps.LatLngBounds();
	  
		  places.forEach((place) => {
			if (!place.geometry || !place.geometry.location) {
			  console.log("Returned place contains no geometry");
			  return;
			}
	  
			const icon = {
			  url: place.icon as string,
			  size: new google.maps.Size(71, 71),
			  origin: new google.maps.Point(0, 0),
			  anchor: new google.maps.Point(17, 34),
			  scaledSize: new google.maps.Size(25, 25),
			};
	  
			// Create a marker for each place.
			markers.push(
			  new google.maps.Marker({
				map,
				icon,
				title: place.name,
				position: place.geometry.location,
			  })
			);
	  
			if (place.geometry.viewport) {
			  // Only geocodes have viewport.
			  bounds.union(place.geometry.viewport);
			} else {
			  bounds.extend(place.geometry.location);
			}
		  });
		  map.fitBounds(bounds);
	  }
	  return;
	  
	});
  }
  
  declare global {
	interface Window {
	  initAutocomplete: () => void;
	}
  }

const AddressPage: React.FC = () => {

	useEffect(() => {
		initAutocomplete();
	})

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
					<h1 className="">Enter Address</h1>
					<input
						id="pac-input"
						className="controls"
						type="text"
						placeholder="Search Box"
					/>
					<div id="map" className="map"></div>
					<script
						src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBvCvPz-PFCnAiedyHYzmlvb6LnKM4CnLw&callback=initAutocomplete&libraries=places&v=weekly"
						defer
					></script>
					<button className="bg-black text-white py-2 px-4 rounded hover:bg-gray-600 mt-4">
						Get Started
					</button>
				</div>
			</div>
		</div>
	);
  };
  
  export default AddressPage;