"use client";

import React from "react";
import { useParams } from "next/navigation";

function CaptainMainButton({ auctionSession }: { auctionSession: any }) {
  const params = useParams();
  const username = params.captain as string;
  const handleBid = async () => {
    try {
      // Calculate the bid amount
      const bidAmount =
        auctionSession?.bidPrice == null
          ? parseInt(process.env.NEXT_PUBLIC_BASE_PRICE || "1000")
          : parseInt(auctionSession?.bidPrice) +
            parseInt(process.env.NEXT_PUBLIC_BID_INCREMENT || "100");

      console.log(`Placing bid: ${username} - $${bidAmount}`);
      console.log("Username:", username);
      console.log("Bid Amount:", bidAmount);
      console.log("Username type:", typeof username);
      console.log("Bid Amount type:", typeof bidAmount);

      // Validate values before sending
      if (!username) {
        alert("Username is missing!");
        return;
      }
      if (!bidAmount || isNaN(bidAmount)) {
        alert("Invalid bid amount!");
        return;
      }

      const response = await fetch("/api/bidding_controls/placeBid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          bidAmount: bidAmount,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("Bid placed successfully:", result.message);
        console.log("Updated auction:", result.data);

        // Show success message
        alert(result.message);
      } else {
        console.error("Failed to place bid:", result.message);
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      alert("Failed to place bid. Please try again.");
    }
  };
  return (
    <>
      {auctionSession.status != "ACTIVE" && (
        <div className="w-full p-5 bg-accent1 opacity-80 rounded-2xl text-[40px] text-center cursor-pointer">
          <p className="w-full">WAITING FOR ADMIN</p>
        </div>
      )}
      {auctionSession.status == "ACTIVE" && (
        <button
          onClick={handleBid}
          className="w-full p-5 hover:opacity-80 bg-accent1 rounded-2xl text-[40px] text-center cursor-pointer flex flex-row justify-between"
        >
          <p>
            $
            {auctionSession?.bidPrice == null
              ? process.env.NEXT_PUBLIC_BASE_PRICE
              : parseInt(auctionSession?.bidPrice) +
                parseInt(process.env.NEXT_PUBLIC_BID_INCREMENT || "100")}
          </p>
          <p>Bid</p>
          <p>5 secs</p>
        </button>
      )}
    </>
  );
}

export default CaptainMainButton;
