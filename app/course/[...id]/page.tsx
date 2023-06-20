"use client";
import { MaterialCard } from "@/components/MaterialCard";
import { Button } from "@/components/ui/Button";
import { IconDots } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { UserMenu } from "../../../components/MaterialMenu";
import { appContext, context2 } from "../../../context/appContext";
import { fetchMaterial } from "../../../services/fetchMaterial";
import TipTap from "../../../components/Editor";

export default function Home({ params }: { params: { id: string } }) {
  async function getMaterial() {
    return await fetchMaterial("/course/" + params.id[0]);
  }
  const result = useQuery({ queryKey: ["course"], queryFn: getMaterial });
  const context: context2 = useContext(appContext);
  // const course = await fetchMaterial("/course/" + params.id[0]);
  if (result.isLoading) {
    return <span className="loading loading-spinner text-primary"></span>;
  }
  return (
    <div style={{ padding: "0px 20px", flex: "80%" }}>
      <div className="flex justify-between items-center">
        <h1>{result.data.name + " " + result.data.emoji}</h1>
        <UserMenu id={result.data.id} context={context} type={"course"} />
      </div>
      <div className="flex justify-between items-center">
        <h3>Units</h3>
        <Button>Add Unit</Button>
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
