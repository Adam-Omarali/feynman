"use client";

import { createContext, useState } from "react";
import CloseModal from "./CloseModal";
import { Button } from "./ui/Button";
import { MaterialCard } from "./MaterialCard";

export let modalContext = createContext(() => {});

function Modal({
  triggerText,
  children,
}: {
  triggerText: string;
  children: React.ReactNode;
}) {
  const [openModal, setOpenModal] = useState(false);

  function closeModal() {
    setOpenModal(false);
  }

  return (
    <div>
      <button onClick={() => setOpenModal(true)}>
        <MaterialCard add={triggerText} />
      </button>
      {openModal ? (
        <div className="fixed inset-0 bg-zinc-900/20 z-10">
          <div className="container flex items-center h-full max-w-lg mx-auto">
            <div
              className="relative bg-white w-full h-fit pt-4 px-2 rounded-lg"
              style={{ minHeight: "8rem" }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-600">{triggerText}</p>
                </div>
                <div>
                  <CloseModal
                    closeModal={() => {
                      setOpenModal(false);
                    }}
                  />
                </div>
              </div>
              <modalContext.Provider value={closeModal}>
                {children}
              </modalContext.Provider>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Modal;
