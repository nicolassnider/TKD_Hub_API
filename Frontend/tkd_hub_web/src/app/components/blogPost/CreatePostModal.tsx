import { useRef, useState } from "react";
import { useBlogPosts } from "@/app/context/BlogPostContext";
import { Editor, EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import FormActionButtons from "../common/actionButtons/FormActionButtons";

// 1. Context hooks
interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreatePostModal({ open, onClose }: CreatePostModalProps) {
  const { addPost } = useBlogPosts();

  // 2. State hooks
  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [loading, setLoading] = useState(false);
  const editorRef = useRef<Editor>(null);

  if (!open) return null;

  // 3. Effects
  // (No effects needed for this modal)

  // 4. Functions
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return; // Prevent empty titles

    setLoading(true);
    try {
      const rawContent = convertToRaw(editorState.getCurrentContent());
      const content = draftToHtml(rawContent);
      await addPost({ title: title.trim(), content });
      setTitle("");
      setEditorState(EditorState.createEmpty());
      onClose();
    } catch (error) {
      // Optionally handle error (e.g., show a toast or alert)
      console.error("Failed to add post:", error);
    } finally {
      setLoading(false);
    }
  };

  // Focus editor when modal opens
  const handleEditorContainerClick = () => {
    editorRef.current?.focus();
  };

  // 5. Render
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2 text-center">Create New Post</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <div
            className="border border-gray-300 rounded px-3 py-2 bg-white min-h-[200px] max-h-[40vh] overflow-y-auto cursor-text"
            onClick={handleEditorContainerClick}
          >
            <Editor
              ref={editorRef}
              editorState={editorState}
              onChange={setEditorState}
              placeholder="Write your post content..."
            />
          </div>
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
