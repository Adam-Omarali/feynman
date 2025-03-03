import StarterKit from "@tiptap/starter-kit";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import TiptapLink, { Link } from "@tiptap/extension-link";
import TiptapImage, { Image } from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapUnderline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { Markdown } from "tiptap-markdown";
import Highlight from "@tiptap/extension-highlight";

import SlashCommand from "./slash-command";
import { InputRule } from "@tiptap/core";
import UploadImagesPlugin from "../plugins/imageUpload";
import Youtube from "@tiptap/extension-youtube";
import { Mathematics } from '@tiptap-pro/extension-mathematics'
import Typography from "@tiptap/extension-typography";

const CustomImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [UploadImagesPlugin()];
  },
});

export const TiptapExtensions = [
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: "list-disc list-outside leading-3 -mt-1",
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal list-outside leading-3 -mt-1",
      },
    },
    listItem: {
      HTMLAttributes: {
        class: "",
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: "border-l-4 border-stone-700",
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class:
          "rounded-sm bg-stone-100 p-5 font-mono font-medium text-stone-800",
      },
    },
    code: {
      HTMLAttributes: {
        class:
          "rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-stone-900",
        spellcheck: "false",
      },
    },
    horizontalRule: false,
    dropcursor: {
      color: "#DBEAFE",
      width: 4,
    },
    gapcursor: false,
  }),
  // patch to fix horizontal rule bug: https://github.com/ueberdosis/tiptap/pull/3859#issuecomment-1536799740
  HorizontalRule.extend({
    addInputRules() {
      return [
        new InputRule({
          find: /^(?:---|—-|___\s|\*\*\*\s)$/,
          handler: ({ state, range }) => {
            const attributes = {};

            const { tr } = state;
            const start = range.from;
            let end = range.to;

            tr.insert(start - 1, this.type.create(attributes)).delete(
              tr.mapping.map(start),
              tr.mapping.map(end),
            );
          },
        }),
      ];
    },
  }).configure({
    HTMLAttributes: {
      class: "mt-4 mb-6 border-t border-stone-300",
    },
  }),
  TiptapLink.configure({
    HTMLAttributes: {
      class:
        "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
    },
  }),
  // Image,
  CustomImage.configure({
    allowBase64: true,
    HTMLAttributes: {
      class: "rounded-lg border border-stone-200 max-h-[300px]",
    },
  }),
  SlashCommand,
  TiptapUnderline,
  TextStyle,
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  TaskList.configure({
    HTMLAttributes: {
      class: "not-prose",
    },
  }),
  TaskItem.configure({
    HTMLAttributes: {
      class: "flex items-start gap-2",
    },
    nested: true,
  }),
  Markdown.configure({
    html: false,
    transformCopiedText: true,
  }),
  Youtube.configure({
    controls: true,
    width: typeof window !== 'undefined' ? window.innerWidth * 0.7 : 800,
  }),
  Mathematics,
  Typography
];