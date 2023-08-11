import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import { Slate, Editable, withReact, useSlate, useFocused } from 'slate-react';
import {
  Editor,
  Transforms,
  Text,
  createEditor,
  Range,
} from 'slate';
import { css } from '@emotion/css';

import { Button, Icon, Menu, Portal } from '../Button';

import { insertCommentThread, shouldAllowNewCommentThreadAtSelection } from '../Commenting';

import useAddCommentThreadToState from '../hooks/useAddCommentThreadToState';


export default function HoveringToolbar () {
    const ref = useRef(null); // Fixed parentheses
    const editor = useSlate();
    const inFocus = useFocused();

    const addCommentThread = useAddCommentThreadToState()

    const onInsertComment = useCallback(()=>{
      const newCommentThreadID = insertCommentThread(editor, addCommentThread)
    }, [editor, addCommentThread])
  
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
          <FormatButton format="comment" icon="add_comment" onInsertComment={onInsertComment}/>
        </Menu>
      </Portal>
    );
  };
  
  const FormatButton = ({ format, icon , onInsertComment = null}) => {
    const editor = useSlate();
    const { selection } = editor
    if (!onInsertComment) {
    return (
      
      <Button
        
        active={isMarkActive(editor, format)}
        disabled={!shouldAllowNewCommentThreadAtSelection(
          editor,
          selection
        )}
        onMouseDown={() => toggleMark(editor, format)}
      >
        <Icon active={isMarkActive(editor, format)}>{icon}</Icon>
      </Button>
    );}
    else{
      return (
      
        <Button  
          active={isMarkActive(editor, format)}
          onMouseDown = {onInsertComment}
          >
            <Icon active={isMarkActive(editor, format)}>{icon}</Icon>
          </Button>
      )
    }
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
