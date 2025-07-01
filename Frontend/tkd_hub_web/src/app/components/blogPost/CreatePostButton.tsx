type Props = {
  onClick: () => void;
};

const CreatePostButton = ({ onClick }: Props) => (
  <div className="mb-6 flex justify-end">
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow transition"
    >
      Create Post
    </button>
  </div>
);

export default CreatePostButton;
