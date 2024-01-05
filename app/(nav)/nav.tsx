import { Button } from "@/components/ui/Button";
import { CourseList } from "./course-list";
import { UserButton } from "./UserButton";
import Modal from "@/components/Modal";
import FlashcardForm from "@/components/FlashcardForm";
import AddFlashcard from "../../components/AddFlashcard";
import Link from "next/link";
import SignOut from "@/components/SignOut";

function Navbar() {
  return (
    <div className="w-56 h-screen bg-gray-50 flex flex-col px-2 pb-4 justify-between">
      <div className="flex flex-col max-h-[90%]">
        <div className="border-b-2">
          <UserButton />
        </div>
        <CourseList />
      </div>
      <div className="flex flex-col w-full gap-2">
        <Button variant="hover">
          <Link href={"/questions/add"}>New Flashcard</Link>
        </Button>
        <SignOut />
      </div>
    </div>
  );
}

export default Navbar;
