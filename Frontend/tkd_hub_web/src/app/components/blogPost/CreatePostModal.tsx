"use client";
import { useRef, useState, useEffect } from "react";
import { useBlogPosts } from "@/app/context/BlogPostContext";
import { Editor, EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import FormActionButtons from "../common/actionButtons/FormActionButtons";
import CreatePostEditor from "./CreatePostEditor";
import CreatePostTitleInput from "./CreatePostTitleInput";
import htmlToDraft from "html-to-draftjs";

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  postId?: number;
  initialTitle?: string;
  initialContent?: string;
}

export default function CreatePostModal({
  open,
  onClose,
  postId,
  initialTitle = "",
  initialContent = "",
}: CreatePostModalProps) {
  const { addPost, updatePost } = useBlogPosts();

  const [title, setTitle] = useState(initialTitle);
  const [editorState, setEditorState] = useState(() =>
    initialContent
      ? EditorState.createWithContent(
          ContentState.createFromBlockArray(
            htmlToDraft(initialContent).contentBlocks
          )
        )
      : EditorState.createEmpty()
  );
  const [loading, setLoading] = useState(false);
  const editorRef = useRef<Editor>(null);

  // Reset form when modal opens/closes or when editing a different post
  useEffect(() => {
    setTitle(initialTitle);
    if (initialContent) {
      const blocks = htmlToDraft(initialContent);
      setEditorState(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(blocks.contentBlocks)
        )
      );
    } else {
      setEditorState(EditorState.createEmpty());
    }
  }, [open, initialTitle, initialContent, postId]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const rawContent = convertToRaw(editorState.getCurrentContent());
      const content = draftToHtml(rawContent);

      if (postId) {
        await updatePost(postId, { title: title.trim(), content });
      } else {
        await addPost({ title: title.trim(), content });
      }
      setTitle("");
      setEditorState(EditorState.createEmpty());
      onClose();
    } catch (error) {
      console.error("Failed to submit post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditorContainerClick = () => {
    editorRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-100 bg-opacity-80 dark:bg-neutral-900 dark:bg-opacity-80">
      <div className="rounded-lg shadow-lg p-6 w-full max-w-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto bg-neutral-50 dark:bg-neutral-800">
        <h2 className="text-2xl font-bold mb-2 text-center text-neutral-900 dark:text-neutral-100">
          {postId ? "Edit Post" : "Create New Post"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
          <CreatePostTitleInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <CreatePostEditor
            editorState={editorState}
            setEditorState={setEditorState}
            editorRef={editorRef}
            onContainerClick={handleEditorContainerClick}
          />
          <FormActionButtons
            onCancel={onClose}
            onSubmitLabel={
              loading
                ? postId
                  ? "Saving..."
                  : "Posting..."
                : postId
                ? "Save"
                : "Post"
            }
            loading={loading}
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
}
