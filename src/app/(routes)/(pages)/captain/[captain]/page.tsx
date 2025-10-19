import React from "react";

interface PageProps {
  params: {
    captain: string;
  };
}

function page({ params }: PageProps) {
  return <div>Captain page for: {params.captain}</div>;
}

export default page;
