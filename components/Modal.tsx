"use client";

import { createContext, useContext, useState, useMemo } from "react";
import CloseModal from "./CloseModal";

export const modalContext = createContext({
  close: () => {},
  open: () => {},
  value: false,
});

function Modal({
  children,
  open,
}: Readonly<{
  children: React.ReactNode;
  open?: boolean;
}>) {
  const [modal, setModal] = useState(open ?? false);

  function closeModal() {
    setModal(false);
  }

  function openModal() {
    setModal(true);
  }

  const contextValue = useMemo(
    () => ({ close: closeModal, open: openModal, value: modal }),
    [modal]
  );

  return (
    <div>
      <modalContext.Provider value={contextValue}>
        {children}
      </modalContext.Provider>
    </div>
  );
}

const ModalTrigger = ({ children }: { children: React.ReactNode }) => {
  const modal = useContext(modalContext);
  return <button onClick={modal.open}>{children}</button>;
};
Modal.Trigger = ModalTrigger;

const ModalContent = ({
  children,
  triggerText,
}: {
  children: React.ReactNode;
  triggerText: string;
}) => {
  const modal = useContext(modalContext);
  return (
    <div>
      {modal.value ? (
        <div className="fixed inset-0 bg-zinc-900/20 z-20">
          <div className="container flex items-center h-full mx-auto max-h-[90%] mt-8">
            <div
              className="relative bg-white w-full h-fit pt-4 px-2 rounded-lg"
              style={{ minHeight: "8rem" }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-600">{triggerText}</p>
                </div>
                <div>
                  <CloseModal closeModal={modal.close} />
                </div>
              </div>
              {children}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

Modal.Content = ModalContent;

export default Modal;
