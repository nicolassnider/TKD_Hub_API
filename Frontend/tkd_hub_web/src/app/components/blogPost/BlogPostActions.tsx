type Props = {
  canEditOrDelete: boolean;
  onEdit?: () => void;
};

const BlogPostActions = ({ canEditOrDelete, onEdit }: Props) =>
  canEditOrDelete ? (
    <div className="flex justify-end gap-2">
      <button
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition"
        onClick={onEdit}
      >
        Edit
      </button>
      <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition">
        Delete
      </button>
    </div>
  ) : null;

export default BlogPostActions;
