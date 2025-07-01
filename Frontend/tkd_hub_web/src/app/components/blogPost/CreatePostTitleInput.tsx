type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CreatePostTitleInput = ({ value, onChange }: Props) => (
  <input
    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Title"
    value={value}
    onChange={onChange}
    required
  />
);

export default CreatePostTitleInput;
