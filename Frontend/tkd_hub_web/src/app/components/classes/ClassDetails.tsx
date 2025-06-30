import React from "react";
import { ClassSchedule } from "@/app/types/ClassSchedule";
import DetailRow from "./DetailRow";
import ScheduleRow from "./ScheduleRow";


type ClassDetailsProps = {
  name: string;
  schedules?: ClassSchedule[];
  coachName?: string;
  dojaangName?: string;
  dojaangId?: number;
};

const ClassDetails: React.FC<ClassDetailsProps> = ({
  name,
  schedules,
  coachName,
  dojaangName,
  dojaangId,
}) => (
  <form className="mb-4 p-4 bg-gray-50 rounded border shadow-md">
    <div className="flex flex-col space-y-4">
      <DetailRow label="Class:">{name}</DetailRow>
      <ScheduleRow schedules={schedules} />
      <DetailRow label="Coach:">{coachName ?? "N/A"}</DetailRow>
      <DetailRow label="Dojaang:">{dojaangName ?? dojaangId}</DetailRow>
    </div>
  </form>
);

export default ClassDetails;
