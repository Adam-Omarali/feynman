import React from "react";
import { Skeleton } from "./ui/Skeleton";

function MaterialSkeleton({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-4 mt-2">
      <Skeleton className="h-fit w-fit mx-4 pt-2">
        <p className="text-lg m-4">Loading {text}</p>
      </Skeleton>
      <Skeleton className="h-50% w-[50%]"></Skeleton>
    </div>
  );
}

export default MaterialSkeleton;
