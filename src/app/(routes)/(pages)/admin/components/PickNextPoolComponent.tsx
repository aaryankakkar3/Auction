import Section from "@/app/components/ui/Section";
import React from "react";
import PoolOption from "./PoolOption";
import Button from "@/app/components/ui/Button";

function PickNextPoolComponent() {
  const [mensPoolOptions, setMensPoolOptions] = React.useState({
    "Men's Under 17": false,
    "Men's Open": false,
    "Men's 40+": false,
    "Men's 60+": false,
    Unsold: false,
  });
  const [womensPoolOptions, setWomensPoolOptions] = React.useState({
    "Women's Under 17": false,
    "Women's Open": false,
    "Women's 40+": false,
    "Women's 60+": false,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const handleMensToggle = (option: string) => {
    setMensPoolOptions({
      ...mensPoolOptions,
      [option]: !mensPoolOptions[option as keyof typeof mensPoolOptions],
    });
  };

  const handleWomensToggle = (option: string) => {
    setWomensPoolOptions({
      ...womensPoolOptions,
      [option]: !womensPoolOptions[option as keyof typeof womensPoolOptions],
    });
  };

  const handleStart = async () => {
    setIsLoading(true);

    try {
      // Combine all selected pools
      const allSelectedPools = {
        ...mensPoolOptions,
        ...womensPoolOptions,
      };

      // Check if Unsold is selected (from men's pool options)
      const includeUnsold = mensPoolOptions.Unsold;

      // Remove Unsold from the pools object since it's not a pool criteria
      const { Unsold, ...selectedPools } = allSelectedPools;

      console.log("Selected pools:", selectedPools);
      console.log("Include unsold:", includeUnsold);

      const response = await fetch("/api/bidding_controls/pickNextPlayer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedPools,
          includeUnsold,
        }),
      });

      // Always parse the JSON response, even for error status codes
      const data = await response.json();

      console.log("API response:", data);

      // Check for success in the data, not the HTTP status
      if (response.ok && data.success) {
        console.log(
          "Auction started for:",
          data.auctionSession.currentPlayer?.name
        );
        console.log("Eligible players:", data.eligiblePlayersCount);
        // TODO: Show success toast/notification here
      } else {
        console.log("Auction start failed:", data.error);
        if (data.error === "ACTIVE_SESSION_EXISTS") {
          // TODO: Show toast about active session
          alert(
            "Another auction session is already active. Please complete it first."
          );
        } else if (data.error === "NO_POOLS_SELECTED") {
          alert("Please select at least one pool to start the auction.");
        } else if (data.error === "NO_ELIGIBLE_PLAYERS") {
          alert("No eligible players found matching the selected criteria.");
        } else {
          alert("Failed to start auction: " + data.message);
        }
      }
    } catch (error) {
      console.error("Error starting auction:", error);
      alert("An error occurred while starting the auction.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Section className="w-full">
      <p className="text-center font-semibold">Pick next pool</p>
      <div className="flex flex-row gap-5">
        <div className="flex flex-col gap-2.5 w-full">
          {Object.entries(mensPoolOptions).map(([option, isSelected]) => (
            <PoolOption
              key={option}
              option={option}
              isSelected={isSelected}
              onToggle={handleMensToggle}
            />
          ))}
        </div>
        <div className="h-full w-[1px] bg-text2"></div>
        <div className="flex flex-col gap-2.5 w-full">
          {Object.entries(womensPoolOptions).map(([option, isSelected]) => (
            <PoolOption
              key={option}
              option={option}
              isSelected={isSelected}
              onToggle={handleWomensToggle}
            />
          ))}
        </div>
      </div>
      <Button
        className="bg-accent1 px-5 py-2.5 m-auto"
        onClick={handleStart}
        disabled={isLoading}
      >
        {isLoading ? "Starting..." : "Start"}
      </Button>
    </Section>
  );
}

export default PickNextPoolComponent;
