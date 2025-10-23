// Auction action handlers for admin functionality
import toast from "react-hot-toast";

export const handleApprovePlayer = async () => {
  try {
    console.log("Approving player...");

    const response = await fetch("/api/bidding_controls/approvePlayer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.success) {
      console.log("Player approved successfully:", result.message);
      console.log("Updated session:", result.data);
    } else {
      console.error("Failed to approve player:", result.message);
      toast.error(result.message);
    }
  } catch (error) {
    console.error("Error approving player:", error);
    toast.error("Failed to approve player. Please try again.");
  }
};

export const handlePauseBidding = async () => {
  try {
    console.log("Pausing bidding...");

    const response = await fetch("/api/bidding_controls/pauseBidding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.success) {
      console.log("Bidding paused successfully:", result.message);
      console.log("Time remaining:", result.data.timeRemaining);
    } else {
      console.error("Failed to pause bidding:", result.message);
      toast.error(result.message);
    }
  } catch (error) {
    console.error("Error pausing bidding:", error);
    toast.error("Failed to pause bidding. Please try again.");
  }
};

export const handleResumeBidding = async () => {
  try {
    console.log("Resuming bidding...");

    const response = await fetch("/api/bidding_controls/resumeBidding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.success) {
      console.log("Bidding resumed successfully:", result.message);
      console.log("Remaining time:", result.data.remainingTime);
    } else {
      console.error("Failed to resume bidding:", result.message);
      toast.error(result.message);
    }
  } catch (error) {
    console.error("Error resuming bidding:", error);
    toast.error("Failed to resume bidding. Please try again.");
  }
};

export const handleStopBidding = async () => {
  try {
    console.log("Stopping bidding...");

    const response = await fetch("/api/bidding_controls/stopBidding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.success) {
      console.log("Bidding stopped successfully:", result.message);
      console.log("Updated session:", result.data);
    } else {
      console.error("Failed to stop bidding:", result.message);
      toast.error(result.message);
    }
  } catch (error) {
    console.error("Error stopping bidding:", error);
    toast.error("Failed to stop bidding. Please try again.");
  }
};

export const handleRestartBidding = async () => {
  try {
    console.log("Restarting bidding...");

    const response = await fetch("/api/bidding_controls/restartBidding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.success) {
      console.log("Bidding restarted successfully:", result.message);
      console.log("Updated session:", result.data);
    } else {
      console.error("Failed to restart bidding:", result.message);
      toast.error(result.message);
    }
  } catch (error) {
    console.error("Error restarting bidding:", error);
    toast.error("Failed to restart bidding. Please try again.");
  }
};

export const handleDiscardBidding = async () => {
  try {
    console.log("Discarding bidding...");

    const response = await fetch("/api/bidding_controls/discardBidding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.success) {
      console.log("Bidding discarded successfully:", result.message);
      console.log("Updated session:", result.data);

      // Show confirmation to user
      toast.success(result.message);
    } else {
      console.error("Failed to discard bidding:", result.message);
      toast.error(result.message);
    }
  } catch (error) {
    console.error("Error discarding bidding:", error);
    toast.error("Failed to discard bidding. Please try again.");
  }
};

export const handleFinishBidding = async () => {
  try {
    console.log("Finishing bidding...");

    const response = await fetch("/api/bidding_controls/finishBidding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.success) {
      console.log("Bidding finished successfully:", result.message);
      console.log("Sale details:", result.saleDetails);
      console.log("Updated session:", result.data);

      // Show success message to user
      toast.success(result.message);
    } else {
      console.error("Failed to finish bidding:", result.message);
      toast.error(result.message);
    }
  } catch (error) {
    console.error("Error finishing bidding:", error);
    toast.error("Failed to finish bidding. Please try again.");
  }
};
