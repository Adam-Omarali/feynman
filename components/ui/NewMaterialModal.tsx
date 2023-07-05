import { Modal } from "@mantine/core";
import React from "react";

export default function MaterialModal({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) {
  return (
    <Modal opened={opened} onClose={close}>
      Hi!
    </Modal>
  );
}
