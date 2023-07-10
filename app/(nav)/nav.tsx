import { Button } from "@/components/ui/Button";
import { CourseList } from "./course-list";
import { UserButton } from "./UserButton";
import Modal from "@/components/Modal";
import FlashcardForm from "@/components/FlashcardForm";
import AddFlashcard from "../../components/AddFlashcard";

function Navbar() {
  return (
    <div className="w-56 h-screen bg-gray-50 flex flex-col px-2">
      <ul>
        <li className="border-b-2">
          <UserButton />
        </li>

        <CourseList />
      </ul>
    </div>
  );
}

export default Navbar;
