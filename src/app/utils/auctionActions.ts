// Auction action handlers for admin functionality

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
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error("Error approving player:", error);
    alert("Failed to approve player. Please try again.");
  }
};

export const handlePauseBidding = () => {
  // TODO: Implement pause bidding logic
  console.log("Pause bidding clicked");
};

export const handleResumeBidding = () => {
  // TODO: Implement resume bidding logic
  console.log("Resume bidding clicked");
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
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error("Error stopping bidding:", error);
    alert("Failed to stop bidding. Please try again.");
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
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error("Error restarting bidding:", error);
    alert("Failed to restart bidding. Please try again.");
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
      alert(result.message);
    } else {
      console.error("Failed to discard bidding:", result.message);
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error("Error discarding bidding:", error);
    alert("Failed to discard bidding. Please try again.");
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
      alert(result.message);
    } else {
      console.error("Failed to finish bidding:", result.message);
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error("Error finishing bidding:", error);
    alert("Failed to finish bidding. Please try again.");
  }
};
