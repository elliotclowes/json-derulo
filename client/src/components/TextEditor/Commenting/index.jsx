import "../../../App.css";
import { Editor, Range } from "slate";
import { v4 as uuidv4 } from "uuid";
import classNames from "classnames";
import { useSlate } from "slate-react";

import { activeCommentThreadIDAtom } from "../CommentState";
import { useRecoilState } from "recoil";

const COMMENT_THREAD_PREFIX = "commentThread_";

export function getMarkForCommentThreadID(threadID) {
  return `${COMMENT_THREAD_PREFIX}${threadID}`;
}


export function getCommentThreadsOnTextNode(textNode) {
    return new Set(
       // Because marks are just properties on nodes,
      // we can simply use Object.keys() here.
      Object.keys(textNode)
        .filter(isCommentThreadIDMark)
        .map(getCommentThreadIDFromMark)
    );
  }
  
export function getCommentThreadIDFromMark(mark) {
    if (!isCommentThreadIDMark(mark)) {
      throw new Error("Expected mark to be of a comment thread");
    }
    return mark.replace(COMMENT_THREAD_PREFIX, "");
  }
  
function isCommentThreadIDMark(mayBeCommentThread) {
    return mayBeCommentThread.indexOf(COMMENT_THREAD_PREFIX) === 0;
  }

 
  
export function CommentedText(props) {
    const editor = useSlate()
    const { commentThreads, textNode, ...otherProps } = props;
    const [activeCommentThreadID, setActiveCommentThreadID] = useRecoilState(activeCommentThreadIDAtom)

    const onClick = () =>{
      setActiveCommentThreadID(getSmallestCommentThreadAtTextNode(editor, textNode))
    }
    return (
      <span
        {...otherProps}
        className={classNames({
          comment: true,
          "is-active": commentThreads.has(activeCommentThreadID)
        })}
        onMouseDown={onClick}
      >
        {props.children}
      </span>
    );
  }


export function insertCommentThread(editor, addCommentThreadToState) {
    const threadID = uuidv4()
    const newCommentThread = {
        comments:[],
        creationTime: new Date(),
        status: "open"
    }
    addCommentThreadToState(threadID, newCommentThread)
    Editor.addMark(editor, getMarkForCommentThreadID(threadID), true)
    return threadID
}



export function shouldAllowNewCommentThreadAtSelection(editor, selection) {
    if (selection == null || Range.isCollapsed(selection)) {
      return false;
    }
  
    const textNodeIterator = Editor.nodes(editor, {
      at: selection,
      mode: "lowest",
    });
  
    let nextTextNodeEntry = textNodeIterator.next().value;
    const textNodeEntriesInSelection = [];
    while (nextTextNodeEntry != null) {
      textNodeEntriesInSelection.push(nextTextNodeEntry);
      nextTextNodeEntry = textNodeIterator.next().value;
    }
  
    if (textNodeEntriesInSelection.length === 0) {
      return false;
    }
  
    return textNodeEntriesInSelection.some(
      ([textNode]) => getCommentThreadsOnTextNode(textNode).size === 0
    );
  }

export function getSmallestCommentThreadAtTextNode(editor, textNode){
    const commentThreads = getCommentThreadsOnTextNode(textNode)
    const commentThreadsAsArray =[...commentThreads]

    let shortestCommentThreadID = commentThreadsAsArray[0]

    const reverseTextNodeIterator = (slateEditor, nodePath) => 
    Editor.previous(slateEditor, {
      at:nodePath,
      mode: "lowest",
      match: Text.isText,
    })

    const forwardTextNodeIterator = (slateEditor, nodePath) =>
      Editor.next(slateEditor, {
        at: nodePath,
        mode: "lowest",
        match: Text.isText
      })

    if (commentThreads.size > 1) {
      const commentThreadsLengthByID = new Map(
        commentThreadsAsArray.map((id) => [id, textNode.text.length])
      )
      updateCommentThreadLengthMap(
        editor,
        commentThreads,
        reverseTextNodeIterator,
        commentThreadsLengthByID
      )

      updateCommentThreadLengthMap(
        editor,
        commentThreads,
        forwardTextNodeIterator,
        commentThreadsLengthByID
      )

      let minLength = Number.POSITIVE_INFINITY

      for (let[threadID, length] of commentThreadsLengthByID){
        if (length < minLength){
          shortestCommentThreadID = threadID
          minLength = length
        }
      }
    }
    return shortestCommentThreadID
  }


function updateCommentThreadLengthMap(editor, commentThreads, nodeIterator, map) {
  let nextNodeEntry = nodeIterator(editor)

  while (nextNodeEntry != null) {
    const nextNode = nextNodeEntry[0]
    const commentThreadsOnNextNode = getCommentThreadsOnTextNode(nextNode)

    const intersection = [...commentThreadsOnNextNode].filter((x) => commentThreads.has(x))

    if (intersection.length === 0){
      break
    }

    for (let i =0 ; i <intersection.length; i++){
      map.set(intersection[i], map.get(intersection[i]) + nextNode.text.length)
    }

    nextNodeEntry = nodeIterator(editor, nextNodeEntry[1])
  }

  return map
}

