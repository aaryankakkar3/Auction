import React from "react";

function CaptainMainButton({ auctionSession }: { auctionSession: any }) {
  const handleBid = () => {};
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
          <p>${auctionSession?.bidPrice}</p>
          <p>Bid</p>
          <p>secs</p>
        </button>
      )}
    </>
  );
}

export default CaptainMainButton;
