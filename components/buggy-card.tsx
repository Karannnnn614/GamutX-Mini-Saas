// TODO: This file intentionally contains bugs for debugging demonstration.
// BUGS:
// 1. Missing import for Button component
// 2. Incorrect prop types
// 3. Missing key prop in list rendering
// 4. useState without proper initialization
// 5. Typo in function name

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BuggyCardProps {
  title: string;
  items: string[];
  onItemClick: (index: number) => void;
}

export function BuggyCard({ title, items, onItemClick }: BuggyCardProps) {
  // BUG: useState without proper type and initialization
  const [selectedIndex, setSelectedIndex] = useState();
  const [isLoadin, setIsLoading] = useState(false); // BUG: Typo in variable name

  // BUG: Function uses wrong variable name
  const handleItemClicks = (index: number) => {
    setSelectedIndex(index);
    setIsLoading(true);

    // BUG: Calling onItemClick but using wrong parameter
    onItemClick(selectedIndex as number);

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* BUG: Missing key prop */}
          {items.map((item, index) => (
            <div
              className="cursor-pointer rounded border p-2 hover:bg-muted"
              onClick={() => handleItemClicks(index)}
            >
              {item}
            </div>
          ))}
        </div>

        {/* BUG: Button component not imported */}
        <Button
          onClick={() => console.log("Clicked")}
          disabled={isLoadin}
          className="mt-4"
        >
          {isLoadin ? "Loading..." : "Submit"}
        </Button>

        {/* BUG: Accessing undefined property */}
        {selectedIndex !== undefined && (
          <p className="mt-2 text-sm">
            Selected: {items[selectedIndex + 1]} {/* BUG: Off-by-one error */}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
