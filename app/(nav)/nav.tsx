import { CourseList } from "./header";
import { UserButton } from "./UserButton";

function Navbar() {
  return (
    <ul className="w-56 h-screen bg-gray-50 px-2">
      <li className="border-b-2">
        <UserButton />
      </li>

      <CourseList />
    </ul>
  );
}

export default Navbar;
