"use client";
import { RootState, store } from "@/redux/store";
import { useSelector } from "react-redux";

function Page() {
  let questions = useSelector((state: RootState) => state.questions);
  return (
    <div>
      {Object.values(questions).map((question) => {
        return <p>{question.question}</p>;
      })}
    </div>
  );
}

export default Page;
