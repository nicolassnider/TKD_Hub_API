import { TrainingClass } from "@/app/types/TrainingClass";
import ClassDetails from "./ClassDetails";

type Props = {
  classDetails?: TrainingClass; // <-- allow undefined
};

const AddStudentClassDetails = ({ classDetails }: Props) =>
  classDetails ? (
    <ClassDetails
      name={classDetails.name}
      schedules={classDetails.schedules}
      coachName={classDetails.coachName}
      dojaangName={classDetails.dojaangName}
      dojaangId={classDetails.dojaangId}
    />
  ) : null;

export default AddStudentClassDetails;
