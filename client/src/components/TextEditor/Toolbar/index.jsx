import React, { useMemo, useRef, useEffect } from 'react';
import { Slate, Editable, withReact, useSlate, useFocused } from 'slate-react';
import {
  Editor,
  Transforms,
  Text,
  createEditor,
  Range,
  Path
} from 'slate';
import { css } from '@emotion/css';
import { useExtractedText } from "../../../contexts/";
import { Button, Icon, Menu, Portal } from '../Button';




export default function HoveringToolbar({ blockId }) {
    const ref = useRef(null); // Fixed parentheses
    const editor = useSlate();
    const inFocus = useFocused();

    const { extractedTexts, setExtractedTexts } = useExtractedText();

    const handleExtractText = () => {
      const text = extractSelectedText(editor);
      if (text) {
        console.log("Selected Text for block:", blockId, text);
  
        // Set the extracted text for this specific block
        setExtractedTexts(prevTexts => ({
          ...prevTexts,
          [blockId]: text
        }));
      }
    };
  
    useEffect(() => {
      const el = ref.current;
      const { selection } = editor;
  
      if (!el) {
        return;
      }
  
      if (
        !selection ||
        !inFocus ||
        Range.isCollapsed(selection) ||
        Editor.string(editor, selection) === ''
      ) {
        el.removeAttribute('style');
        return;
      }
  
      const domSelection = window.getSelection();
      const domRange = domSelection.getRangeAt(0);
      const rect = domRange.getBoundingClientRect();
      el.style.opacity = '1';
      el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
      el.style.left = `${rect.left +
        window.pageXOffset -
        el.offsetWidth / 2 +
        rect.width / 2}px`;
    });

    const extractSelectedText = (editor) => {
      if (!editor.selection) return;  // Check if anything is selected
  
      const selectedTexts = [];
  
      // This will iterate over text nodes within the selection
      for (const [node, path] of Editor.nodes(editor, {
          match: n => Text.isText(n),
          at: editor.selection,
      })) {
          // If the text node's path matches the anchor's path, use the anchor's offset
          const startOffset = Path.equals(path, editor.selection.anchor.path)
              ? editor.selection.anchor.offset
              : 0;
          
          // If the text node's path matches the focus's path, use the focus's offset
          const endOffset = Path.equals(path, editor.selection.focus.path)
              ? editor.selection.focus.offset
              : node.text.length;
  
          // Extract the text from the text node based on the offsets
          const selectedText = node.text.slice(startOffset, endOffset);
          selectedTexts.push(selectedText);
      }
  
      return selectedTexts.join(' ');
  };
  
  

  
    return (
      <Portal>
        <Menu
          ref={ref}
          className={css`
            padding: 8px 7px 6px;
            position: absolute;
            z-index: 1;
            top: -10000px;
            left: -10000px;
            margin-top: -6px;
            opacity: 0;
            background-color: #d3d3d3;
            border-radius: 4px;
            transition: opacity 0.75s;
          `}
          onMouseDown={e => {
            // prevent toolbar from taking focus away from editor
            e.preventDefault();
          }}
        >
          <FormatButton format="bold" icon="format_bold" />
          <FormatButton format="italic" icon="format_italic" />
          <FormatButton format="underlined" icon="format_underlined" />
          <FormatButton format="highlight" icon="format_paint" />
          <FormatButton format="extract_text" icon="question_mark" action={handleExtractText} />

          
        </Menu>
      </Portal>
    );
  };
  
  const FormatButton = ({ format, icon, action }) => {
    const editor = useSlate();
    const handleMouseDown = action ? action : () => toggleMark(editor, format);
    return (
      <Button
        active={format !== "extract_text" && isMarkActive(editor, format)}
        onMouseDown={(event) => {
          event.preventDefault();
          handleMouseDown();
        }}
      >
        <Icon active={format !== "extract_text" && isMarkActive(editor, format)}>
          {icon}
        </Icon>
      </Button>
    );
  };
  

  const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format);
  
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };
  
  const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  };
