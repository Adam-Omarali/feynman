"use client";
import { Button } from "@/components/ui/Button";
import { useQuery } from "@tanstack/react-query";
import { fetchMaterial } from "../../../services/fetchMaterial";
import TipTap from "../../../components/Editor";
import { UserMenu } from "@/components/MaterialMenu";

export default function Home({ params }: { params: { id: string } }) {
  async function getMaterial() {
    return await fetchMaterial("/course/" + params.id[0]);
  }
  const result = useQuery({ queryKey: ["course"], queryFn: getMaterial });
  // const course = await fetchMaterial("/course/" + params.id[0]);
  if (result.isLoading) {
    return <span className="loading loading-spinner text-primary"></span>;
  }
  return (
    <div style={{ padding: "0px 20px", flex: "80%" }}>
      <div className="flex justify-between items-center">
        <h1>{result.data.name + " " + result.data.emoji}</h1>
        <UserMenu id={result.data.id} type={"course"} />
      </div>
      <div className="flex justify-between items-center">
        <h3>Units</h3>
        <Button>Add Unit</Button>
      </div>
      {/* {context.value &&
        context.value.courses[result.data.id] &&
        Object.keys(context.value.courses[result.data.id].units).map(
          (unitID) => {
            if (context.value) {
              let unit = context.value.courses[result.data.id].units[unitID];
              return <MaterialCard />;
            }
          }
        )} */}
      <TipTap />
    </div>
  );
}
