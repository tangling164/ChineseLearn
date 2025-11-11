"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export function FeedbackButton() {
  const handleClick = () => {
    window.open(
      "https://forms.gle/Wgy8tb2N72JZN9nz8?usp=sf_link",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <Button
      variant="outline"
      size="default"
      onClick={handleClick}
      className="px-8 py-3 text-lg border-2 hover:border-orange-500 hover:text-orange-600 transition-colors"
    >
      <MessageSquare className="w-5 h-5 mr-2" />
      Give FeedBack
    </Button>
  );
}
