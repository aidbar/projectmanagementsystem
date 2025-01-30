import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";

export function LoggedOut() {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl" role="alert">You have successfully logged out.</h1>
        <Button 
          onClick={handleBackToHome} 
          className="mt-4 px-4 py-2 rounded"
          aria-label="Back to homepage"
        >
          Back to homepage
        </Button>
      </div>
    </div>
  );
}
