import GenericButton from "../common/actionButtons/GenericButton";

type Props = {
  onClick: () => void;
};

const CreatePostButton = ({ onClick }: Props) => (
  <div className="mb-6 flex justify-end">
    <GenericButton
      type="button"
      variant="neutral-dark"
      onClick={onClick}
      className="bg-neutral-900 hover:bg-neutral-800 text-neutral-50"
    >
      Create Post
    </GenericButton>
  </div>
);

export default CreatePostButton;
