import { useRef, useState } from "react";
import { useBlogPosts } from "@/app/context/BlogPostContext";
import { Editor, EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import FormActionButtons from "../common/actionButtons/FormActionButtons";
import CreatePostEditor from "./CreatePostEditor";
import CreatePostTitleInput from "./CreatePostTitleInput";

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreatePostModal({
  open,
  onClose,
}: CreatePostModalProps) {
  const { addPost } = useBlogPosts();

  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [loading, setLoading] = useState(false);
  const editorRef = useRef<Editor>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const rawContent = convertToRaw(editorState.getCurrentContent());
      const content = draftToHtml(rawContent);
      await addPost({ title: title.trim(), content });
      setTitle("");
      setEditorState(EditorState.createEmpty());
      onClose();
    } catch (error) {
      console.error("Failed to add post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditorContainerClick = () => {
    editorRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2 text-center">Create New Post</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
          <CreatePostTitleInput value={title} onChange={e => setTitle(e.target.value)} />
          <CreatePostEditor
            editorState={editorState}
            setEditorState={setEditorState}
            editorRef={editorRef}
            onContainerClick={handleEditorContainerClick}
          />
          <FormActionButtons
            onCancel={onClose}
            onSubmitLabel={loading ? "Posting..." : "Post"}
            loading={loading}
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
}
