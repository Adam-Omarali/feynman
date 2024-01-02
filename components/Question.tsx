import { content, editorContent, question } from "@/redux/questions";
import React, { useRef, useState } from "react";
import TipTap from "./editor/Editor";
import { Button } from "./ui/Button";
import ReactCanvasConfetti from "react-canvas-confetti";
import { randomInt } from "crypto";
import { updateHistory } from "@/services/updateMaterial";

function Question({ question }: { question: question }) {
  const [answer, setAnswer] = useState<content | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [correct, setCorrect] = useState(false);

  const real_ans = question.answer;

  function getAllText(obj: content, ret: string = ""): string {
    if (obj.type === "text") {
      return ret + obj.text.trim().toLowerCase() + "\n";
    } else {
      let paragraph = obj.content;
      let temp = "";
      for (let index = 0; index < paragraph.length; index++) {
        const element = paragraph[index];
        temp += getAllText(element, ret);
      }
      return temp;
    }
  }

  function checkAnswer() {
    if (answer) {
      if (getAllText(real_ans!) === getAllText(answer)) {
        console.log("correct!");
        setCorrect(true);
      } else {
        console.log(wrongCount + 1);
        if (!correct) setWrongCount(wrongCount + 1);
      }
    } else {
      console.log(getAllText(real_ans!));
    }
  }

  async function submit(confidence: number) {
    //api request
    let date = Date.now();
    await updateHistory({
      qId: question.id,
      confidence,
      attempts: wrongCount,
      correct,
      date,
    });
  }

  return (
    <div>
      {/* <ReactCanvasConfetti
        // set the class name as for a usual react component
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
        fire={correct ? {} : false}
        onFire={() => console.log("fired")}
      /> */}
      <TipTap
        isEditable={false}
        setContent={() => {}}
        content={question.question}
        flashcard={true}
      />
      <p>Answer</p>
      <TipTap
        isEditable={true}
        setContent={setAnswer}
        content={""}
        flashcard={true}
      />
      <div className="flex gap-2">
        {real_ans ? (
          <>
            {!showAnswer ? (
              <Button onClick={checkAnswer} variant="secondary">
                Check
              </Button>
            ) : null}
            <Button variant="secondary" onClick={() => setShowAnswer(true)}>
              Answer
            </Button>
          </>
        ) : null}
        {question.solution ? (
          <Button
            variant="secondary"
            onClick={() => setShowSolution(!showSolution)}
          >
            Solution
          </Button>
        ) : null}
      </div>

      <div className="pt-4">
        {showAnswer && question.answer?.type != "text" ? (
          <div>
            <p className="font-medium">Real Answer</p>
            <TipTap
              isEditable={false}
              setContent={() => {}}
              content={question.answer!.content}
              flashcard={true}
            />
          </div>
        ) : null}
        {showSolution && question.solution?.type != "text" ? (
          <div>
            <p className="font-medium">Solution</p>
            <TipTap
              isEditable={false}
              setContent={() => {}}
              content={question.solution!.content}
              flashcard={true}
            />
          </div>
        ) : null}
      </div>

      <div className="py-4">
        <p>How did you feel about that question?</p>
        <div className="flex gap-2 pt-2">
          <Button onClick={async () => await submit(0)}>No Idea</Button>
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={async () => await submit(1)}
          >
            Wrong
          </Button>
          <Button
            className="bg-yellow-500 hover:bg-yellow-600"
            onClick={async () => await submit(2)}
          >
            Somewhat Right
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={async () => await submit(3)}
          >
            Got It!
          </Button>
        </div>
      </div>

      {/* <Button variant="outline">Next</Button> */}
    </div>
  );
}

export default Question;
