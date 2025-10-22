import React, { useEffect, useState } from "react";
import Section from "./ui/Section";
import { ChevronDown } from "lucide-react";

function ChooseProfile({
  captainView,
  setCaptainView,
  pageOwnerCaptain,
}: {
  captainView: string;
  setCaptainView: React.Dispatch<React.SetStateAction<string>>;
  pageOwnerCaptain: string;
}) {
  const [captains, setCaptains] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all captains on component mount
  useEffect(() => {
    const fetchCaptains = async () => {
      try {
        const response = await fetch("/api/getAllCaptains");
        const result = await response.json();

        if (result.success) {
          setCaptains(result.data);
          console.log("Captains loaded:", result.data);
        } else {
          console.error("Failed to fetch captains:", result.message);
        }
      } catch (error) {
        console.error("Error fetching captains:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaptains();
  }, []);

  // Get display name for current captain view
  const getCurrentDisplayName = () => {
    if (captainView === pageOwnerCaptain) {
      return "Me";
    }
    const captain = captains.find((c) => c.username === captainView);
    return captain ? captain.name : captainView;
  };

  // Handle captain selection
  const handleCaptainSelect = (username: string) => {
    setCaptainView(username);
    setIsDropdownOpen(false);
  };

  if (loading) {
    return (
      <Section className="gap-2.5">
        <p className="text-[40px]">Loading...</p>
        <div className="w-full p-2.5 bg-accent1 flex flex-row justify-between rounded-[8px] items-center opacity-50">
          <p className="">Choose profile</p>
          <ChevronDown className="w-4 h-4 text-text1" />
        </div>
      </Section>
    );
  }

  return (
    <Section className="gap-2.5 relative">
      <p className="text-[40px] truncate">{getCurrentDisplayName()}</p>
      <div className="relative">
        <div
          className="w-full p-2.5 bg-accent1 flex flex-row justify-between rounded-[8px] hover:cursor-pointer hover:opacity-80 items-center"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <p className="">Choose profile</p>
          <ChevronDown
            className={`w-4 h-4 text-text1 transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 w-full mt-1 bg-bg3 border border-bg3 rounded-[8px] shadow-lg z-10 max-h-60 overflow-y-auto">
            {captains.map((captain) => (
              <div
                key={captain.username}
                className="p-2.5 hover:opacity-80 cursor-pointer"
                onClick={() => handleCaptainSelect(captain.username)}
              >
                <p className="text-text1">
                  {captain.username === pageOwnerCaptain ? "Me" : captain.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}

export default ChooseProfile;
