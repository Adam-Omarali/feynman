"use client";

import { Button } from "@/components/ui/Button";
import { useQuery } from "@tanstack/react-query";
import { fetchMaterial } from "../../../services/fetchMaterial";
import TipTap from "../../../components/Editor";
import { UserMenu } from "@/components/MaterialMenu";
import { RootState, store } from "@/redux/store";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSelector } from "react-redux";

export default function Home({ params }: { params: { id: string } }) {
  let course = useSelector(
    (state: RootState) => state.courses.value[params.id[0]]
  );
  if (course === undefined) {
    return <Skeleton></Skeleton>;
  }
  return (
    <div style={{ padding: "0px 20px", flex: "80%" }}>
      <div className="flex justify-between items-center">
        <h1>{course.name + " " + course.emoji}</h1>
        <UserMenu
          ids={{ courseId: course.id, lessonId: "", unitId: "" }}
          type={"course"}
        />
      </div>
      <div className="flex justify-between items-center">
        <h3>Units</h3>
        <Button>Add Unit</Button>
      </div>
      <div className="flex justify-between items-center">
        <Button>Add Questions</Button>
      </div>

      {/* {context.value &&
        context.value.courses[course.id] &&
        Object.keys(context.value.courses[course.id].units).map(
          (unitID) => {
            if (context.value) {
              let unit = context.value.courses[course.id].units[unitID];
              return <MaterialCard />;
            }
          }
        )} */}
      <TipTap />
    </div>
  );
}
