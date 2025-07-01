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
    <div className="flex justify-end">
      <button
        onClick={handleAdd}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
        disabled={loading || !studentId}
      >
        {loading ? "Adding..." : "Add Student"}
      </button>
    </div>
    {message && <div className="text-green-700 text-sm mt-2">{message}</div>}
  </>
);

export default AddStudentActionButton;
