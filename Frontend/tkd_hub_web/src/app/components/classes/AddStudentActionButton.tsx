import GenericButton from "../common/actionButtons/GenericButton";

type Props = {
  handleAdd: () => void;
  loading: boolean;
  studentId: number | "";
  message: string | null;
};

const AddStudentActionButton = ({
  handleAdd,
  loading,
  studentId,
  message,
}: Props) => (
  <>
    <div className="flex justify-end mt-4">
      <GenericButton
        type="button"
        variant="primary"
        onClick={handleAdd}
        disabled={loading || !studentId}
      >
        {loading ? "Adding..." : "Add Student"}
      </GenericButton>
    </div>
    {message && (
      <div className="text-green-700 text-sm mt-2 text-right">{message}</div>
    )}
  </>
);

export default AddStudentActionButton;
