import { Editor, EditorState } from "draft-js";
import { RefObject } from "react";

type Props = {
  editorState: EditorState;
  setEditorState: (state: EditorState) => void;
  editorRef: RefObject<Editor | null>; // <-- Allow null here
  onContainerClick: () => void;
};

const CreatePostEditor = ({
  editorState,
  setEditorState,
  editorRef,
  onContainerClick,
}: Props) => (
  <div
    className="border border-gray-300 rounded px-3 py-2 bg-white min-h-[200px] max-h-[40vh] overflow-y-auto cursor-text"
    onClick={onContainerClick}
  >
    <Editor
      ref={editorRef}
      editorState={editorState}
      onChange={setEditorState}
      placeholder="Write your post content..."
    />
  </div>
);

export default CreatePostEditor;
