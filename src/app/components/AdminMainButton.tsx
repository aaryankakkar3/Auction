import React, { useEffect, useState } from "react";
import {
  handleApprovePlayer,
  handlePauseBidding,
  handleResumeBidding,
  handleStopBidding,
  handleRestartBidding,
  handleDiscardBidding,
  handleFinishBidding,
} from "../utils/auctionActions";
import { useSocket } from "@/hooks/useSocket";

function AdminMainButton({ auctionSession }: { auctionSession: any }) {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const { socket } = useSocket();
  const [timeLeft, setTimeLeft] = useState<number>(30);

  // Listen for timer updates
  useEffect(() => {
    if (socket) {
      socket.on("timer_update", (timerData: { timeLeft: number }) => {
        setTimeLeft(timerData.timeLeft);
      });

      // Cleanup listener
      return () => {
        socket.off("timer_update");
      };
    }
  }, [socket]);
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
      {auctionSession.status == "ACTIVE" && !auctionSession.pausedAt && (
        <div className="flex flex-row gap-5 w-full text-[32px] items-center">
          <button
            onClick={handlePauseBidding}
            className="w-full p-5 cursor-pointer rounded-2xl hover:opacity-80 bg-accent1 "
          >
            Pause
          </button>
          <div
            className={`text-center w-full text-[40px] cursor-pointer rounded-2xl font-semibold `}
          >
            {timeLeft}s
          </div>
          <button
            onClick={handleStopBidding}
            className="w-full p-5 cursor-pointer rounded-2xl hover:opacity-80 bg-accent1 "
          >
            Stop
          </button>
        </div>
      )}
      {auctionSession.status == "ACTIVE" && auctionSession.pausedAt && (
        <div className="flex flex-row gap-5 w-full text-[32px] items-center">
          <button
            onClick={handleResumeBidding}
            className="w-full p-5 cursor-pointer rounded-2xl hover:opacity-80 bg-accent1 "
          >
            Resume
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
