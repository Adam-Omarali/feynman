"use client";
import { Button, Skeleton } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import TipTap from "../../../components/Editor";
import { MaterialCard } from "../../../components/MaterialCard";
import {
  appContext,
  context2,
  contextInterface,
} from "../../../context/appContext";
import { fetchMaterial } from "../../../services/fetchMaterial";

export default function Home({ params }: { params: { id: string } }) {
  async function getMaterial() {
    return await fetchMaterial("/course/" + params.id[0]);
  }
  const result = useQuery({ queryKey: ["course"], queryFn: getMaterial });
  const context: context2 = useContext(appContext);
  // const course = await fetchMaterial("/course/" + params.id[0]);
  if (result.isLoading) {
    return <Skeleton height={8} radius="xl" />;
  }
  if (context.value) {
    console.log(context.value.courses[result.data.id]);
  }
  return (
    <div style={{ width: "80%" }}>
      <h1>{result.data.name}</h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3>Units</h3>
        <Button color="primary">Add Unit</Button>
      </div>
      {context.value &&
        context.value.courses[result.data.id] &&
        Object.keys(context.value.courses[result.data.id].units).map(
          (unitID) => {
            if (context.value) {
              let unit = context.value.courses[result.data.id].units[unitID];
              return <MaterialCard />;
            }
          }
        )}
      <TipTap />
    </div>
  );
}
