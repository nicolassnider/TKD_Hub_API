import React from "react";
import { TrainingClass } from "../../types/TrainingClass";
import CoachClassCard from "./CoachClassCard";

type CoachClassesProps = {
  loading: boolean;
  coachClasses: TrainingClass[] | null;
};

const CoachClasses: React.FC<CoachClassesProps> = ({
  loading,
  coachClasses,
}) => {
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-neutral-100 text-center">
        Classes I Give
      </h3>
      {loading && (
        <div className="flex items-center justify-center py-8 text-lg text-neutral-500 dark:text-neutral-400">
          Loading classes...
        </div>
      )}
      {!loading && coachClasses && coachClasses.length === 0 && (
        <div className="text-neutral-400 dark:text-neutral-500 text-center py-8">
          You are not assigned to any classes.
        </div>
      )}
      {!loading && coachClasses && coachClasses.length > 0 && (
        <ul
          className={`grid gap-6 ${
            coachClasses.length === 1
              ? "grid-cols-1"
              : coachClasses.length === 2
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1 md:grid-cols-3"
          }`}
        >
          {coachClasses.map((c) => (
            <CoachClassCard key={c.id} coachClass={c} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default CoachClasses;
