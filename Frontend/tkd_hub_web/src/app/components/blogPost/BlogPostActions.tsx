import GenericButton from "../common/actionButtons/GenericButton";

type Props = {
  canEditOrDelete: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

const BlogPostActions = ({ canEditOrDelete, onEdit, onDelete }: Props) =>
  canEditOrDelete ? (
    <div className="flex justify-end gap-2">
      <GenericButton variant="primary" onClick={onEdit}>
        Edit
      </GenericButton>
      <GenericButton variant="secondary" onClick={onDelete}>
        Delete
      </GenericButton>
    </div>
  ) : null;

export default BlogPostActions;
