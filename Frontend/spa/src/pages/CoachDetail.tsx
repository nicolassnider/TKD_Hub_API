import React from "react";
import ApiDetail from "../components/ApiDetail";
import { useParams } from "react-router-dom";

export default function CoachDetail() {
  const { id } = useParams();
  return <ApiDetail apiPath="/api/Coaches" id={id} />;
}
