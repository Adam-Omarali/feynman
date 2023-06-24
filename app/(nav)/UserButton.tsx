"use client";
import { Skeleton } from "@/components/ui/Skeleton";
import { RootState, store } from "@/redux/store";
import { useSelector } from "react-redux";

export function UserButton() {
  const user = useSelector((state: RootState) => state.user);
  if (user.id === "") {
    return (
      <div className="flex items-center space-x-4 p-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
    );
  }
  return (
    <div className="w-full flex p-3 gap-4 items-center">
      <div className="avatar">
        <div className="w-10 rounded-full">
          <img src={user.photo} />
        </div>
      </div>
      <div className="text-sm">
        <p>{user.name}</p>
      </div>
    </div>
  );
}
