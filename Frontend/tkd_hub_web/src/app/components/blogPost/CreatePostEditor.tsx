import { Editor, EditorState } from "draft-js";
import { RefObject } from "react";

type Props = {
  editorState: EditorState;
  setEditorState: (state: EditorState) => void;
  editorRef: RefObject<Editor | null>;
  onContainerClick: () => void;
};

const CreatePostEditor = ({
  editorState,
  setEditorState,
  editorRef,
  onContainerClick,
}: Props) => (
  <div
    className="border border-neutral-300 dark:border-neutral-700 rounded px-3 py-2 min-h-[200px] max-h-[40vh] overflow-y-auto cursor-text focus-within:ring-2 focus-within:ring-blue-500 transition bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400"
    onClick={onContainerClick}
    tabIndex={0}
    style={{
      boxShadow: "0 1px 2px 0 rgba(0,0,0,0.04)",
      outline: "none",
    }}
  >
    <Editor
      ref={editorRef}
      editorState={editorState}
      onChange={setEditorState}
      placeholder="Write your post content..."
      spellCheck
    />
  </div>
);

export default CreatePostEditor;
