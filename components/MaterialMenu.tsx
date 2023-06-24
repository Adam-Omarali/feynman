"use client";

import { IconTrash, IconDots } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { deleteMaterial } from "../services/deleteMaterial";

/**
 *
 * @param id - id of the item in question
 * @param context - global context object
 * @param type - either lesson, unit or course
 * @returns ui for an editing menu
 */

export function UserMenu({ id, type }: { id: string; type: string }) {
  const router = useRouter();
  return (
    <details className="dropdown dropdown-left">
      <summary className="m-1 btn btn-ghost btn-sm">
        <IconDots size="1.3rem" stroke={1.5} />
      </summary>
      <ul className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
        <li>
          <div
            className="text-red-500 hover:text-red-500 hover:bg-red-100"
            onClick={async () => {
              await deleteMaterial(id, type);
              router.push("/");
            }}
          >
            <IconTrash size="0.9rem" stroke={1.5} />
            <p>Delete {type.charAt(0).toUpperCase() + type.slice(1)}</p>
          </div>
        </li>
      </ul>
    </details>
  );
}
