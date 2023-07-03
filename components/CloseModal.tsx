"use client";

import { X } from "lucide-react";
import { FC } from "react";
import { Button } from "./ui/Button";

interface CloseModalProps {
  closeModal: Function;
}

const CloseModal: FC<CloseModalProps> = ({ closeModal }) => {
  return (
    <Button className="h-6 w-6 p-0 rounded-md" onClick={() => closeModal()}>
      <X aria-label="close modal" className="h-4 w-4" />
    </Button>
  );
};

export default CloseModal;
