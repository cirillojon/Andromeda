"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import postSolarData from "@/utils/actions/postSolarData";
import { Input } from "@/components/ui/input";
import { ButtonGooey } from "@/components/ui/button-gooey";
import secureLocalStorage from "react-secure-storage";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

interface AddressPageProps {
  isLoggedIn: boolean;
}

const AddressPage: React.FC<AddressPageProps> = ({ isLoggedIn }) => {
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(27.9517);
  const [longitude, setLongitude] = useState(-82.4588);
  const [zoom, setZoom] = useState(13);
  const [markerVisible, setMarkerVisible] = useState(false);
  const [monthlyBill, setMonthlyBill] = useState("");
  const [billError, setBillError] = useState("");
  const [emptyAddress, setEmptyAddress] = useState("");
  const [emptyBill, setEmptyBill] = useState("");
  const router = useRouter();

  const libraries = useMemo(() => ["places"], []);
  const mapCenter = useMemo(
    () => ({ lat: latitude, lng: longitude }),
    [latitude, longitude]
  );

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return (
      <div
        className="gap-[16px] flex justify-between p-[16px] mt-16"
        style={{ height: "calc(100vh - 64px)" }}
      >
        <div className="flex flex-1 rounded-lg overflow-hidden border-r-10 drop-shadow-lg bg-slate-100"></div>
        <div className="flex-initial w-1/3 justify-between p-[16px] bg-white rounded-xl">
          <div className="text-4xl text-slate-700 font-bold mb-10">
            Start Your Journey
          </div>
          <div className="w-full">
            <h1 className="text-slate-700">Home Address:</h1>
            <Input placeholder="Search for an address" />
          </div>
          <h1 className="text-slate-700 mt-6">Average Electricity Bill:</h1>
          <div className="flex">
            <Input
              value={monthlyBill}
              onChange={(e) => setMonthlyBill(e.target.value)}
              className="w-full"
              placeholder="450"
            />
            <div className="absolute right-12 mt-2 items-center text-slate-700">
              /mo
            </div>
          </div>
          {billError && <div className="text-red-500 mt-2">{billError}</div>}
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!address) {
      setEmptyAddress("Please enter an address");
      return;
    }
    setEmptyAddress("");
    if (!monthlyBill) {
      setEmptyBill("Please enter a monthly bill");
      return;
    }
    setEmptyBill("");
    if (isNaN(Number(monthlyBill))) {
      setBillError("Please enter a valid number for the monthly bill");
      return;
    }
    setBillError("");
    const response = await postSolarData(address, longitude, latitude);
    if (response.data) {
      debugger;
      secureLocalStorage.setItem("solarData", JSON.stringify(response.data));
    }

    // Clear the reload flag
    sessionStorage.removeItem("reloaded");

    router.push(
      `/form/${encodeURIComponent(address)}&${encodeURIComponent(monthlyBill)}`
    );
  };

  return (
    <div className="w-full flex flex-col">
      <nav className="flex bg-gray-900 p-4 shadow-md">
        <div className="flex items-center space-x-4">
          <Image src="/assets/Logo.png" alt="logo" width={40} height={40} />
          <Link href="/" className="font-semibold text-3xl text-white">
            <span>andromeda</span>
          </Link>
        </div>
        <div className="flex ml-auto items-center mr-8">
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button className="text-gray-900 bg-gray-100 hover:bg-gray-500">
                My Dashboard
              </Button>
            </Link>
          ) : (
            <LoginLink>
              <Button className="text-gray-900 bg-gray-100 hover:bg-gray-500">
                Login
              </Button>
            </LoginLink>
          )}
        </div>
      </nav>
      <div
        className="gap-[16px] flex flex-col md:flex-row justify-between p-[16px]"
        style={{ height: "calc(100vh - 64px)" }}
      >
        <div className="flex flex-1 rounded-lg overflow-hidden border-r-10 drop-shadow-lg mb-4 md:mb-0">
          <GoogleMap
            options={mapOptions}
            zoom={zoom}
            center={mapCenter}
            mapTypeId={google.maps.MapTypeId.ROADMAP}
            mapContainerStyle={{
              height: "100%",
              width: "100%",
              borderRadius: "10px",
            }}
            onLoad={() => console.log("Map Loaded")}
          >
            <MarkerF
              position={mapCenter}
              onLoad={() => console.log("Marker Loaded")}
              visible={markerVisible}
            />
          </GoogleMap>
        </div>
        <div className="flex-initial w-full md:w-1/3 justify-between p-[16px] bg-white rounded-xl">
          <div className="text-4xl text-slate-700 font-bold mb-10">
            Start Your Journey
          </div>
          <PlacesAutocomplete
            onAddressSelect={(address) => {
              getGeocode({ address }).then((results) => {
                const { lat, lng } = getLatLng(results[0]);
                setLatitude(lat);
                setLongitude(lng);
              });
              setAddress(address);
              setTimeout(() => setZoom(16), 500);
              setTimeout(() => setMarkerVisible(true), 1600);
            }}
          />
          {emptyAddress && (
            <div className="text-red-500 mt-2 ml-2">{emptyAddress}</div>
          )}
          <h1 className="text-slate-700 mt-6">Average Electricity Bill:</h1>
          <div className="flex">
            <Input
              value={monthlyBill}
              onChange={(e) =>
                setMonthlyBill(e.target.value.replaceAll(",", ""))
              }
              className="w-full"
              placeholder="450"
            />
            <div className="absolute right-12 mt-2 items-center text-slate-700">
              /mo
            </div>
          </div>
          {billError && (
            <div className="text-red-500 mt-2 ml-2">{billError}</div>
          )}
          {emptyBill && (
            <div className="text-red-500 mt-2 ml-2">{emptyBill}</div>
          )}
          <button onClick={handleSubmit} className="mt-6 justify-start w-40">
            <ButtonGooey input="Get Started" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressPage;

const PlacesAutocomplete = ({
  onAddressSelect,
}: {
  onAddressSelect?: (address: string) => void;
}) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { componentRestrictions: { country: "us" } },
    debounce: 300,
    cache: 86400,
  });

  const renderSuggestions = () => {
    return data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
        description,
      } = suggestion;

      return (
        <li
          key={place_id}
          onClick={() => {
            setValue(description, false);
            clearSuggestions();
            onAddressSelect && onAddressSelect(description);
          }}
          className="hover:bg-slate-200 p-2 cursor-pointer rounded-md"
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });
  };

  return (
    <div className="w-full">
      <h1 className="text-slate-700">Home Address:</h1>
      <Input
        value={value}
        disabled={!ready}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for an address"
      />
      {status === "OK" && (
        <ul className="mt-2 border-2 border-slate-200 list-none p-2 rounded-lg bg-white max-h-96 border-spacing-2 overflow-y-auto">
          {renderSuggestions()}
        </ul>
      )}
    </div>
  );
};
