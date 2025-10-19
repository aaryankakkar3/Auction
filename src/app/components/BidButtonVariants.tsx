import React from "react";
import Button from "./ui/Button";
import AdminMainButton from "./AdminMainButton";
import CaptainMainButton from "./CaptainMainButton";

function BidButtonVariants({
  clearance,
  auctionSession,
}: {
  clearance: string;
  auctionSession: any;
}) {
  return (
    <>
      {clearance == "admin" && (
        <AdminMainButton auctionSession={auctionSession} />
      )}
      {clearance == "captain" && <CaptainMainButton />}
    </>
  );
}

export default BidButtonVariants;
