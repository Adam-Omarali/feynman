import React from "react";
import { fetchMaterial } from "../../../services/fetchMaterial";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  console.log(searchParams);
  const unit = await fetchMaterial("/unit/" + params.id[0]);
  return <div>{unit.name}</div>;
}
