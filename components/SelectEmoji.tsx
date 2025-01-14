"use client";

import EmojiPicker from "emoji-picker-react";
import { useDetectClickOutside } from "react-detect-click-outside";

function SelectEmoji({
  emoji,
  selectEmoji,
  setEmoji,
  setSelectEmoji,
  close,
}: Readonly<{
  emoji: string;
  selectEmoji: boolean;
  setEmoji: Function;
  setSelectEmoji: Function;
  close: () => void;
}>) {
  const ref = useDetectClickOutside({ onTriggered: close });

  return (
    <div ref={ref} className="z-10">
      <button onClick={() => setSelectEmoji(!selectEmoji)}>{emoji}</button>
      {selectEmoji ? (
        <div className="absolute">
          <EmojiPicker
            onEmojiClick={(emoji) => {
              setEmoji(emoji.emoji);
            }}
            width={280}
            height={350}
          />
        </div>
      ) : null}
    </div>
  );
}

export default SelectEmoji;
