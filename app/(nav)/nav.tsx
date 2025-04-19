"use client";

import { Button } from "@/components/ui/Button";
import { CourseList } from "./course-list";
import { UserButton } from "./UserButton";
import Modal from "@/components/Modal";
import FlashcardForm from "@/components/FlashcardForm";
import AddFlashcard from "../../components/AddFlashcard";
import Link from "next/link";
import SignOut from "@/components/SignOut";
import { useState, useRef, useEffect } from "react";

function Navbar({
  initialWidth,
  onWidthChange,
}: {
  initialWidth?: number;
  onWidthChange?: (width: number) => void;
}) {
  const [width, setWidth] = useState(initialWidth || 224); // 14rem in pixels
  const [isResizing, setIsResizing] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    startX.current = e.clientX;
    startWidth.current = width;
    document.body.style.cursor = "ew-resize";
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    const delta = e.clientX - startX.current;
    const newWidth = Math.max(200, Math.min(400, startWidth.current + delta)); // Min 200px, max 400px
    setWidth(newWidth);
    onWidthChange?.(newWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.body.style.cursor = "";
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div
      className="h-full bg-gray-50 flex flex-col px-2 pb-4 justify-between relative"
      style={{ width: `${width}px` }}
    >
      <div className="flex flex-col max-h-[90%]">
        <div className="border-b-2">
          <UserButton />
        </div>
        <CourseList />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Link href={"/app/questions/add"}>
          <Button variant="hover" className="w-full">
            New Flashcard
          </Button>
        </Link>
        <Link href={"/app/files"}>
          <Button variant="hover" className="w-full">
            Files
          </Button>
        </Link>
        <SignOut />
      </div>
      <div
        className="absolute right-0 top-0 h-full w-1 cursor-ew-resize hover:bg-gray-300 active:bg-gray-400"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}

export default Navbar;
