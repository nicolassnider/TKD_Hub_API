import LabeledInput from "../common/inputs/LabeledInput";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CreatePostTitleInput = ({ value, onChange }: Props) => (
  <LabeledInput
    label="Title"
    name="post-title"
    value={value}
    onChange={onChange}
    required
    placeholder="Title"
  />
);

export default CreatePostTitleInput;
