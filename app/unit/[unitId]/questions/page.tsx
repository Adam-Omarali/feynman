"use client";
import Loading from "@/app/loading";
import TipTap from "@/components/editor/Editor";
import { defaultDoc } from "@/redux/questions";
import { RootState } from "@/redux/store";
import { getQuestions } from "@/services/fetchMaterial";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

function Page({ params }: { params: { unitId: string } }) {
  let user = useSelector((state: RootState) => state.user);

  const {
    isLoading,
    error,
    data: questions,
  } = useQuery(
    ["questions"],
    async () => {
      let qs = await getQuestions(user.id, params.unitId);
      console.log("useQuery", qs);
      return qs;
    },
    { keepPreviousData: true, staleTime: 1000 * 60 * 5 }
  );

  if (isLoading) return <Loading />;
  if (questions)
    return (
      <div className="p-4">
        {Object.values(questions).map((question) => {
          return (
            <div key={question.id}>
              <p>Question</p>
              <TipTap
                isEditable={false}
                setContent={() => {}}
                content={question.question}
                flashcard={true}
              />
              <p>Answer</p>
              <TipTap
                isEditable={false}
                setContent={() => {}}
                content={question.answer ? question.answer : defaultDoc}
                flashcard={true}
              />
              <div className="divider"></div>
            </div>
          );
        })}
      </div>
    );
  else return <Loading />;
}

export default Page;
