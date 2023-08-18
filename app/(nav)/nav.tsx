import { Button } from "@/components/ui/Button";
import { CourseList } from "./course-list";
import { UserButton } from "./UserButton";
import Modal from "@/components/Modal";
import FlashcardForm from "@/components/FlashcardForm";
import AddFlashcard from "../../components/AddFlashcard";
import Link from "next/link";

function Navbar() {
  return (
    <div className="w-56 h-screen bg-gray-50 flex flex-col px-2 pb-4 justify-between">
      <ul>
        <li className="border-b-2">
          <UserButton />
        </li>

        <CourseList />
      </ul>
      <Button variant="hover">
        <Link href={"/questions/add"}>New Flashcard</Link>
      </Button>
    </div>
  );
}

export default Navbar;
