"use client";

import { createContext, useContext, useState } from "react";
import CloseModal from "./CloseModal";

export let modalContext = createContext({
  close: () => {},
  open: () => {},
  value: false,
});

function Modal({ children }: { children: React.ReactNode }) {
  const [modal, setOpenModal] = useState(false);

  function closeModal() {
    setOpenModal(false);
  }

  function openModal() {
    setOpenModal(true);
  }

  return (
    <div>
      <modalContext.Provider
        value={{ close: closeModal, open: openModal, value: modal }}
      >
        {children}
      </modalContext.Provider>
    </div>
  );
}

Modal.Trigger = ({ children }: { children: React.ReactNode }) => {
  const modal = useContext(modalContext);
  return <div onClick={modal.open}>{children}</div>;
};

Modal.Content = ({
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
          <div className="container flex items-center h-full mx-auto max-h-[90%]">
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

export default Modal;
