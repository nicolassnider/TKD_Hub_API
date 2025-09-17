import React from "react";
import ApiDetail from "../components/ApiDetail";
import { useParams } from "react-router-dom";
import ManageDojaangs from "../components/ManageDojaangs";

export default function CoachDetail() {
  const { id } = useParams();
  return (
    <div>
      <ApiDetail apiPath="/api/Coaches" id={id} />
      {id && <ManageDojaangs coachId={id} />}
    </div>
  );
}
