import {
    REGEX_INLINE_MATH_DOLLARS
  } from "@benrbray/prosemirror-math";
  import { callOrReturn, InputRule, mergeAttributes, Node } from "@tiptap/core";
  import { mathPlugin, mathBackspaceCmd, insertMathCmd, mathSerializer } from "@benrbray/prosemirror-math";

// prosemirror imports
//import { EditorView } from "prosemirror-view";
import { EditorState, Plugin } from "prosemirror-state";
import { chainCommands, deleteSelection, selectNodeBackward, joinBackward, selectTextblockStart, selectTextblockEnd} from "prosemirror-commands";
import { keymap } from "prosemirror-keymap";
//import { Command } from 'prosemirror-state';
//import { inputRules } from "prosemirror-inputrules";

  let plugins:Plugin[] = [
    mathPlugin,
    keymap({
        "Backspace": chainCommands(deleteSelection, mathBackspaceCmd, joinBackward, selectNodeBackward),

    }),
];

/* Ignore this, it's just a thing I put in to try and fix an issue. Didn't work, wasn't complete
function dollarFix(): Command {
    //if previous character is a dollar sign, delete it and type a new one. 
    if() {
      return chainCommands(); //delete dollar sign 
    }
  return null;
}
*/

  export const MathInline = Node.create({
    name: "math_inline",
    group: "inline math",
    content: "text*", // important!
    inline: true, // important!
    atom: true, // important!
  
    parseHTML() {
      return [
        {
          tag: "math-inline" // important!
        }
      ];
    },
  
    renderHTML({ HTMLAttributes }) {
      return [
        "math-inline",
        mergeAttributes({ class: "math-node" }, HTMLAttributes),
        0
      ];
    },
  
    addProseMirrorPlugins() {
      return plugins;
    },
  
    addInputRules() {
      return [
        new InputRule({
          find: REGEX_INLINE_MATH_DOLLARS,
          handler: ({ state, range, match }) => {
            const getAttributes = undefined;
            const nodeType = this.type;
            const start = range.from;
            const end = range.to;
            const $start = state.doc.resolve(start);
            const index = $start.index();
            const $end = state.doc.resolve(end);
            // get attrs
            const attributes =
              callOrReturn(getAttributes, undefined, match) || {};
            // check if replacement valid
            if (!$start.parent.canReplaceWith(index, $end.index(), nodeType)) {
              return null;
            }
            // perform replacement
            return state.tr.replaceRangeWith(
              start,
              end,
              nodeType.create(attributes, nodeType.schema.text(match[1]))
            );
          }
        })
      ];
    }
  });
  