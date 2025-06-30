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
  // 1. Context hooks
  // (No context hooks)

  // 2. State hooks
  // (No state hooks)

  // 3. Effects
  // (No effects)

  // 4. Functions
  // (No local functions)

  // 5. Render
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4 text-blue-700 text-center">
        Classes I Give
      </h3>
      {loading && (
        <div className="flex items-center justify-center py-8 text-lg text-blue-500">
          Loading classes...
        </div>
      )}
      {!loading && coachClasses && coachClasses.length === 0 && (
        <div className="text-gray-400 text-center py-8">
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
