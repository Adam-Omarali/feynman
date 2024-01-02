import TipTap from "@/components/editor/Editor";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export default function Page({ params }: { params: { questionId: string } }) {
  let question = useSelector(
    (state: RootState) => state.questions[params.questionId]
  );
  return (
    <div>
      <p>Question</p>
      <TipTap
        isEditable={false}
        setContent={() => {}}
        content={question.question}
        flashcard={true}
      />
    </div>
  );
}
