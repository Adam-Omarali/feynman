"use client";

import { FormEvent, useContext, useState } from "react";
import SelectEmoji from "./SelectEmoji";
import { Button } from "./ui/Button";
import { modalContext } from "./Modal";
import Spinner from "./Spinner";

function NewMaterialForm({
  add,
  lesson,
}: Readonly<{
  add: (name: string, emoji: string, description: string) => {};
  lesson: boolean;
}>) {
  const [selectEmoji, setSelectEmoji] = useState(false);
  const [emoji, setEmoji] = useState("🚀");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const modal = useContext(modalContext);

  function close() {
    setSelectEmoji(false);
  }

  function handleFormSubmit(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    setLoading(true);
    add(name, emoji, description);
    modal.close();
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col gap-4 my-4">
      <div className="flex items-center gap-4">
        <div className="px-4">
          <SelectEmoji
            emoji={emoji}
            setEmoji={setEmoji}
            selectEmoji={selectEmoji}
            setSelectEmoji={setSelectEmoji}
            close={close}
          />
        </div>
        <div className="form-control w-full">
          <input
            type="text"
            placeholder="Untitled"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
      {!lesson && (
        <div>
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
      )}
      <div className="flex justify-end">
        <Button type="submit" onClick={async (e) => await handleFormSubmit(e)}>
          Sumbit
        </Button>
      </div>
    </div>
  );
}

export default NewMaterialForm;
