"use client";

import React, { useEffect, useState } from "react";
import BidButtonVariants from "./BidButtonVariants";
import { useSocket } from "@/hooks/useSocket";
import toast from "react-hot-toast";

function CenterBar({
  clearance,
}: {
  clearance: "admin" | "captain" | "spectator";
}) {
  const [auctionSession, setAuctionSession] = useState<any>(null);
  const [currentPlayer, setCurrentPlayer] = useState<any>(null);
  const { socket, isConnected } = useSocket();

  console.log("🔍 CenterBar - clearance:", clearance, "socket:", !!socket);

  // Initial data fetch - only run once on mount
  useEffect(() => {
    const checkAuctionSession = async () => {
      try {
        const response = await fetch("/api/getAuctionSession");
        const result = await response.json();

        if (result.success && result.data) {
          setAuctionSession(result.data);
          setCurrentPlayer(result.data.currentPlayer);
          console.log("Initial auction session:", result.data);
          console.log("Initial current player:", result.data.currentPlayer);
        } else {
          setAuctionSession(null);
          setCurrentPlayer(null);
          console.log("No active auction session");
        }
      } catch (error) {
        console.error("Error checking auction session:", error);
        setAuctionSession(null);
        setCurrentPlayer(null);
      }
    };

    checkAuctionSession();
  }, []); // Only run once on mount

  // Socket.IO listeners - run when socket becomes available
  useEffect(() => {
    console.log(
      "🔧 Socket useEffect - socket:",
      !!socket,
      "isConnected:",
      isConnected,
      "clearance:",
      clearance
    );
    if (socket && isConnected) {
      console.log("🎧 CenterBar setting up Socket.IO listeners");

      // Single listener for all auction session updates
      socket.on("auctionSessionUpdate", (fullAuctionSession: any) => {
        console.log("📢 Received auction session update:", fullAuctionSession);
        console.log("📢 Current clearance:", clearance);
        console.log("📢 Setting auction session:", fullAuctionSession);

        // Update the complete auction session
        setAuctionSession(fullAuctionSession);

        // Update current player if it exists
        if (fullAuctionSession.currentPlayer) {
          setCurrentPlayer(fullAuctionSession.currentPlayer);
          console.log(
            "📢 Updated current player:",
            fullAuctionSession.currentPlayer.name
          );
        }

        // Show toast notifications for auction session updates
        if (fullAuctionSession.changeType) {
          switch (fullAuctionSession.changeType) {
            case "PLAYER_SOLD":
              toast.success(
                `${fullAuctionSession.currentPlayer?.name} sold to ${fullAuctionSession.biddingCaptain?.name} for $${fullAuctionSession.bidPrice}`
              );
              break;
            case "PLAYER_UNSOLD":
              toast(`${fullAuctionSession.currentPlayer?.name} went unsold`);
              break;
            case "NEW_BID":
              toast(
                `New bid: $${fullAuctionSession.bidPrice} by ${fullAuctionSession.biddingCaptain?.name}`
              );
              break;
            case "BIDDING_STOPPED":
              toast(
                `Bidding stopped for ${fullAuctionSession.currentPlayer?.name}`
              );
              break;
            case "BIDDING_RESTARTED":
              toast.success(
                `Bidding restarted for ${fullAuctionSession.currentPlayer?.name}`
              );
              break;
            case "PLAYER_APPROVED":
              toast.success(
                `Auction started for ${fullAuctionSession.currentPlayer?.name}`
              );
              break;
            case "NEW_PLAYER_SELECTED":
              toast.success(
                `Next player: ${fullAuctionSession.currentPlayer?.name}`
              );
              break;
            case "AUCTION_STARTED":
              toast.success(
                `Auction started for ${fullAuctionSession.currentPlayer?.name}`
              );
              break;
            case "AUCTION_PAUSED":
              toast(`Auction paused`);
              break;
            case "AUCTION_RESUMED":
              toast(`Auction resumed`);
              break;
            case "TIMER_EXPIRED":
              toast(`Time's up! Auction completed`);
              break;
            case "BIDDING_DISCARDED":
              toast(
                `Bidding discarded for ${fullAuctionSession.currentPlayer?.name}`
              );
              break;
            default:
              if (fullAuctionSession.message) {
                toast(fullAuctionSession.message);
              }
          }
        }
      });

      // Listen for player updates (for future use if needed)
      socket.on("playerUpdate", (data: any) => {
        console.log("📢 Received player update:", data);
        // Note: Most player notifications now handled via auctionSessionUpdate
        // This listener is kept for potential future player-specific updates
      });

      // Cleanup listeners
      return () => {
        socket.off("auctionSessionUpdate");
        socket.off("playerUpdate");
      };
    } else {
      console.warn("⚠️ No socket available for CenterBar listener");
    }
  }, [socket, isConnected]);

  function BidStatusComponent() {
    return (
      <>
        {auctionSession.status == "ACTIVE" && (
          <div className="flex flex-col gap-1 text-[32px] text-center">
            <p className="">Current bid: ${auctionSession?.bidPrice}</p>
            <p className="">Bid by: {auctionSession?.biddingCaptain?.name}</p>
          </div>
        )}
        {auctionSession.status == "WAITING" && (
          <p className="text-center text-[32px] text-accent1">
            Waiting for admin to start the bidding for this player
          </p>
        )}
        {auctionSession.status == "COMPLETED_APPROVAL_PENDING" && (
          <div className="flex flex-col gap-1 text-[32px] text-center">
            <p className="">Highest bid: ${auctionSession?.bidPrice}</p>
            <p className="">Bid by: {auctionSession?.biddingCaptain?.name}</p>
          </div>
        )}
        {auctionSession.status == "COMPLETED" &&
          currentPlayer.currentState == "SOLD" && (
            <div className="flex flex-col gap-1 text-[32px] text-center">
              <p className="">
                Sold to: {auctionSession?.biddingCaptain?.name}
              </p>
              <p className="">Selling price: ${auctionSession?.bidPrice}</p>
            </div>
          )}
        {auctionSession.status == "COMPLETED" &&
          currentPlayer.currentState == "UNSOLD" && (
            <p className="text-center text-[32px] text-accent1">
              Player left unsold. They will be transferred to the unsold pool.
            </p>
          )}
        {auctionSession.status == "COMPLETED" &&
          currentPlayer.currentState == "UNAUCTIONED" && (
            <p className="text-center text-[32px] text-accent1">
              Admin has discarded this auction session. Player remains
              unauctioned.
            </p>
          )}
      </>
    );
  }

  function ExtraDetailsComponent() {
    return (
      <div className=" flex flex-row gap-0 p-5 text-[32px] justify-center">
        <div className="flex flex-col gap-1 w-full">
          <p className="text-text2 text-center">Gender</p>
          <p className="text-center">
            {currentPlayer?.gender?.charAt(0).toUpperCase() +
              currentPlayer?.gender?.slice(1).toLowerCase()}
          </p>
        </div>
        <div className="w-1 h-full bg-text2" />
        <div className="flex flex-col gap-1 w-full">
          <p className="text-text2 text-center">Age</p>
          <p className="text-center">{currentPlayer?.age}</p>
        </div>
        <div className="w-1 h-full bg-text2" />
        <div className="flex flex-col gap-1 w-full">
          <p className="text-text2 text-center">Pref. hand</p>
          <p className="text-center">
            {currentPlayer?.preferredHand?.charAt(0).toUpperCase() +
              currentPlayer?.preferredHand?.slice(1).toLowerCase()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between w-135 h-full">
      {auctionSession && (
        <>
          <img
            src="https://cdn-cms.orchidsinternationalschool.com/media/Indonesia-BWF-World-Tour-Finals-Badminton-18_1639332169895_1639332186231_optimized_100.webp"
            alt=""
            className="w-135 h-76 rounded-2xl"
          />
          <p className="text-center text-[40px]">{currentPlayer?.name}</p>
          <div className="flex flex-col gap-1">
            <ExtraDetailsComponent />
            <p className="text-center text-[32px]">
              {(() => {
                if (!currentPlayer?.gender || !currentPlayer?.age) return "";

                const gender =
                  currentPlayer.gender === "MALE" ? "Men's" : "Women's";
                const age = currentPlayer.age;

                if (age <= 16) {
                  return `${gender} U-17`;
                } else if (age >= 17 && age <= 39) {
                  return `${gender} Open`;
                } else if (age >= 40 && age <= 59) {
                  return `${gender} 40+`;
                } else if (age >= 60) {
                  return `${gender} 60+`;
                }

                return `${gender} Open`; // Default fallback
              })()}
            </p>
            <p className="text-center text-[28px]">
              {currentPlayer.bestAchievement}
            </p>
          </div>
          <BidStatusComponent />
          <BidButtonVariants
            clearance={clearance}
            auctionSession={auctionSession}
          />
        </>
      )}
      {!auctionSession && (
        <>
          <div className="text-[40px] w-full h-full flex justify-center items-center text-center leading-tight">
            {clearance == "admin"
              ? "Please start the auction by selecting categories for the pool and pressing Start"
              : "Waiting for admin to start the auction"}
          </div>
        </>
      )}
    </div>
  );
}

export default CenterBar;
