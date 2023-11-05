"use client";
import TipTap from "@/components/editor/Editor";
import { RootState, store } from "@/redux/store";
import { useSelector } from "react-redux";

function Page() {
  let questions = useSelector((state: RootState) => state.questions);
  return (
    <div className="p-4">
      {Object.values(questions).map((question, id) => {
        console.log(question);
        return (
          <div key="id">
            <p>Question</p>
            <TipTap
              isEditable={false}
              setContent={() => {}}
              content={question.question}
              flashcard={true}
            />
            <div className="divider"></div>
            <p>Answer</p>
            <TipTap
              isEditable={false}
              setContent={() => {}}
              content={question.answer}
              flashcard={true}
            />
          </div>
        );
      })}
    </div>
  );
}

export default Page;
