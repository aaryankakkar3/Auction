"use client";

import React, { useEffect, useState } from "react";
import BidButtonVariants from "./BidButtonVariants";

function CenterBar({
  clearance,
}: {
  clearance: "admin" | "captain" | "spectator";
}) {
  const [auctionSession, setAuctionSession] = useState<any>(null);
  const [currentPlayer, setCurrentPlayer] = useState<any>(null);

  useEffect(() => {
    const checkAuctionSession = async () => {
      try {
        const response = await fetch("/api/getAuctionSession");
        const result = await response.json();

        if (result.success && result.data) {
          setAuctionSession(result.data);
          setCurrentPlayer(result.data.currentPlayer);
          console.log("Auction session:", result.data);
          console.log("Current player:", result.data.currentPlayer);
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
  }, []);

  function BidStatusComponent() {
    return (
      <>
        {auctionSession.status == "ACTIVE" && (
          <div className="flex flex-col gap-1 text-[32px] text-center">
            <p className="">Current bid: ${auctionSession?.bidPrice}</p>
            <p className="">Bid by: {auctionSession?.biddingCaptain}</p>
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
            <p className="">Bid by: {auctionSession?.biddingCaptain}</p>
          </div>
        )}
        {auctionSession.status == "COMPLETED" && (
          <div className="flex flex-col gap-1 text-[32px] text-center">
            <p className="">Sold to: {auctionSession?.biddingCaptain}</p>
            <p className="">Selling price: ${auctionSession?.bidPrice}</p>
          </div>
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
