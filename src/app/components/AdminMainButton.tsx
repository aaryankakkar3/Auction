import React from "react";

function AdminMainButton({ auctionSession }: { auctionSession: any }) {
  const handleApprovePlayer = () => {};
  const handlePauseBidding = () => {};
  const handleResumeBidding = () => {};
  const handleStopBidding = () => {};
  const handleRestartBidding = () => {};
  const handleDiscardBidding = () => {};
  const handleFinishBidding = () => {};
  return (
    <>
      {auctionSession.status == "COMPLETED" && (
        <div className="w-full opacity-80 p-5 bg-accent1 rounded-2xl text-[40px] text-center cursor-pointer">
          <p className="w-full">Pick next pool</p>
        </div>
      )}
      {auctionSession.status == "WAITING" && (
        <button
          className="w-full p-5 bg-accent1 rounded-2xl text-[40px] text-center cursor-pointer hover:opacity-80"
          onClick={handleApprovePlayer}
        >
          Approve player
        </button>
      )}
      {auctionSession.status == "ACTIVE" && (
        <div className="flex flex-row gap-5 w-full text-[32px]">
          <button
            onClick={handlePauseBidding}
            className="w-full p-5 cursor-pointer rounded-2xl hover:opacity-80 bg-accent1 "
          >
            Pause
          </button>
          <button
            onClick={handleStopBidding}
            className="w-full p-5 cursor-pointer rounded-2xl hover:opacity-80 bg-accent1 "
          >
            Stop
          </button>
        </div>
      )}
      {auctionSession.status == "COMPLETED_APPROVAL_PENDING" && (
        <div className="flex flex-row gap-5 w-full text-[32px]">
          <button
            onClick={handleRestartBidding}
            className="w-full p-5 cursor-pointer rounded-2xl hover:opacity-80 bg-accent1 "
          >
            Restart
          </button>
          <button
            onClick={handleFinishBidding}
            className="w-full p-5 cursor-pointer rounded-2xl hover:opacity-80 bg-accent1 "
          >
            Finish
          </button>
          <button
            onClick={handleDiscardBidding}
            className="w-full p-5 cursor-pointer rounded-2xl hover:opacity-80 bg-accent1 "
          >
            Discard
          </button>
        </div>
      )}
    </>
  );
}

export default AdminMainButton;
