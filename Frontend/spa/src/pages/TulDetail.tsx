import React from "react";
import ApiDetail from "../components/ApiDetail";
import { useParams } from "react-router-dom";

export default function TulDetail() {
  const { id } = useParams();
  return <ApiDetail apiPath="/api/Tuls" id={id} />;
}
