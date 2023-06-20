import React from "react";
import { fetchMaterial } from "../../../services/fetchMaterial";
import TipTap from "../../../components/Editor";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string[] };
  searchParams: { course: string };
}) {
  const unit = await fetchMaterial("/unit/" + params.id[0]);
  return (
    <div>
      <h1 className="text-rose-500 text-2xl">{unit.name}</h1>
      <button className="btn btn-primary">Button</button>
      <TipTap />
    </div>
  );
}
