"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import TipTap from "../../../components/Editor";
import { UserMenu } from "../../../components/MaterialMenu";
import { appContext, context2 } from "../../../context/appContext";
import { fetchMaterial } from "../../../services/fetchMaterial";

export default function Page(url: {
  params: { id: string[] };
  searchParams: { course: string; unit: string };
}) {
  // const course = await getMaterial("getUnit", params);
  async function getMaterial() {
    return await fetchMaterial("/lesson/" + url.params.id[0]);
  }

  const result = useQuery({ queryKey: ["course"], queryFn: getMaterial });
  const context: context2 = useContext(appContext);
  // const course = await fetchMaterial("/course/" + params.id[0]);
  if (result.isLoading) {
    return <Skeleton />;
  }

  return (
    <div style={{ padding: "0px 20px", flex: "80%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1>{result.data.name + " " + result.data.emoji}</h1>
        <UserMenu id={result.data.id} context={context} type={"lesson"} />
      </div>
    </div>
  );
}
