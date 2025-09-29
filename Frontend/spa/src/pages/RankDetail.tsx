import React from "react";
import ApiDetail from "../components/common/ApiDetail";
import { useParams } from "react-router-dom";

export default function RankDetail() {
  const { id } = useParams();
  return <ApiDetail apiPath="/api/Ranks" id={id} />;
}
