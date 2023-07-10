"use client";

import FlashcardForm from "@/components/FlashcardForm";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/Button";

function AddFlashcard() {
  return (
    <Modal>
      <Modal.Trigger>
        <div className="mt-4">
          <Button>Add Flashcard</Button>
        </div>
      </Modal.Trigger>
      <Modal.Content triggerText="Add Flashcard">
        <FlashcardForm />
      </Modal.Content>
    </Modal>
  );
}

export default AddFlashcard;
