import Section from "@/app/components/ui/Section";
import React from "react";
import PoolOption from "./PoolOption";
import Button from "@/app/components/ui/Button";
import { useSocket } from "@/hooks/useSocket";
import toast from "react-hot-toast";

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
  const [auctionSession, setAuctionSession] = React.useState<any>(null);
  const { socket } = useSocket();

  // Check if component should be enabled
  const isEnabled =
    !auctionSession ||
    auctionSession.status === "WAITING" ||
    auctionSession.status === "COMPLETED";

  // Load auction session on component mount and listen for updates
  React.useEffect(() => {
    const checkAuctionSession = async () => {
      try {
        const response = await fetch("/api/getAuctionSession");
        const result = await response.json();

        if (result.success && result.data) {
          setAuctionSession(result.data);
        } else {
          setAuctionSession(null);
        }
      } catch (error) {
        console.error("Error checking auction session:", error);
        setAuctionSession(null);
      }
    };

    // Initial load
    checkAuctionSession();

    // Listen for real-time auction session updates
    if (socket) {
      socket.on("auctionSessionUpdate", (updatedAuctionSession: any) => {
        setAuctionSession(updatedAuctionSession);
      });

      return () => {
        socket.off("auctionSessionUpdate");
      };
    }
  }, [socket]);

  const handleMensToggle = (option: string) => {
    if (!isEnabled) return;
    setMensPoolOptions({
      ...mensPoolOptions,
      [option]: !mensPoolOptions[option as keyof typeof mensPoolOptions],
    });
  };

  const handleWomensToggle = (option: string) => {
    if (!isEnabled) return;
    setWomensPoolOptions({
      ...womensPoolOptions,
      [option]: !womensPoolOptions[option as keyof typeof womensPoolOptions],
    });
  };

  const handleStart = async () => {
    if (!isEnabled) return;
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
          toast.error(
            "Another auction session is already active. Please complete it first."
          );
        } else if (data.error === "NO_POOLS_SELECTED") {
          toast.error("Please select at least one pool to start the auction.");
        } else if (data.error === "NO_ELIGIBLE_PLAYERS") {
          toast.error(
            "No eligible players found matching the selected criteria."
          );
        } else {
          toast.error("Failed to start auction: " + data.message);
        }
      }
    } catch (error) {
      console.error("Error starting auction:", error);
      toast.error("An error occurred while starting the auction.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Section
      className={`w-full ${!isEnabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <p className="text-center font-semibold">Pick next pool</p>
      <div className="flex flex-row gap-5">
        <div className="flex flex-col gap-2.5 w-full">
          {Object.entries(mensPoolOptions).map(([option, isSelected]) => (
            <div
              key={option}
              className={!isEnabled ? "cursor-not-allowed" : ""}
            >
              <PoolOption
                key={option}
                option={option}
                isSelected={isSelected}
                onToggle={handleMensToggle}
              />
            </div>
          ))}
        </div>
        <div className="h-full w-[1px] bg-text2"></div>
        <div className="flex flex-col gap-2.5 w-full">
          {Object.entries(womensPoolOptions).map(([option, isSelected]) => (
            <div
              key={option}
              className={!isEnabled ? "cursor-not-allowed" : ""}
            >
              <PoolOption
                key={option}
                option={option}
                isSelected={isSelected}
                onToggle={handleWomensToggle}
              />
            </div>
          ))}
        </div>
      </div>
      <Button
        className={`bg-accent1 px-5 py-2.5 m-auto ${
          !isEnabled ? "cursor-not-allowed" : ""
        }`}
        onClick={handleStart}
        disabled={isLoading || !isEnabled}
      >
        {isLoading ? "Starting..." : "Start"}
      </Button>
    </Section>
  );
}

export default PickNextPoolComponent;
