import React from "react";
import ApiDetail from "../components/ApiDetail";
import { useParams } from "react-router-dom";

export default function UserDetail() {
  const { id } = useParams();
  return <ApiDetail apiPath="/api/Users" id={id} />;
}
