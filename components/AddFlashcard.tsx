import FlashcardForm from "@/components/FlashcardForm";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/Button";

function AddFlashcard({
  onSubmit,
}: Readonly<{ onSubmit: (flashcard: any) => void }>) {
  return (
    <Modal>
      <Modal.Trigger>
        <div className="mt-4">
          <Button>Add Flashcard</Button>
        </div>
      </Modal.Trigger>
      <Modal.Content triggerText="Add Flashcard">
        <div className="mb-4 -mt-8">
          <FlashcardForm onSubmit={onSubmit} />
        </div>
      </Modal.Content>
    </Modal>
  );
}

export default AddFlashcard;
