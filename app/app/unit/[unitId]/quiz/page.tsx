"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQuestions } from "@/services/fetchMaterial";
import { useSelector } from "react-redux";
import { RootState, store } from "@/redux/store";
import Loading from "@/app/loading";
import TipTap from "@/components/editor/Editor";
import { Button } from "@/components/ui/Button";
import { defaultDoc } from "@/redux/questions";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/hooks/use-toast";
import { UserState } from "@/redux/user";

function QuizPage({ params }: { params: { unitId: string } }) {
  const [updatedQuestions, setUpdatedQuestions] = useState<{
    [key: string]: any;
  }>({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [numQuestions, setNumQuestions] = useState(0);
  const [currentQuestions, setCurrentQuestions] = useState<{
    [key: string]: any;
  }>({});
  const [currentQuestionId, setCurrentQuestionId] = useState<string>("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState(defaultDoc);
  const [confidence, setConfidence] = useState<number>(2);
  const [attempts, setAttempts] = useState(1);
  const { toast } = useToast();

  const user: UserState = useSelector((state: RootState) => state.user);

  const { isLoading, data: questions } = useQuery({
    queryKey: ["questions", params.unitId],
    queryFn: async () => {
      let questions = await getQuestions(user.id, params.unitId);
      setUpdatedQuestions(questions);
      return questions;
    },
    staleTime: Infinity,
  });

  const extractText = (content: any): string => {
    // If content is a string, return it
    if (typeof content === "string") return content;

    // If content is null/undefined, return empty string
    if (!content) return "";

    // If it's an array, process each element
    if (Array.isArray(content)) {
      return content.map((item) => extractText(item)).join("");
    }

    // If it has a text property, return it
    if (content.text) return content.text;

    // If it has a content property, process it
    if (content.content) return extractText(content.content);

    // If it's an object but doesn't have text/content, return empty string
    return "";
  };

  const isNumericAnswer = (answer: any) => {
    const text = extractText(answer);
    return text !== "" && !isNaN(parseFloat(text)) && isFinite(Number(text));
  };

  const checkNumericAnswer = (userAns: any, correctAns: any) => {
    const userNum = parseFloat(extractText(userAns));
    const correctNum = parseFloat(extractText(correctAns));
    console.log(userAns, userNum, correctNum);
    const percentDiff = Math.abs((userNum - correctNum) / correctNum) * 100;
    return percentDiff <= 5;
  };

  const handleAnswerSubmit = (isCorrect: boolean) => {
    const currentQuestion = currentQuestions[currentQuestionId];
    const attempt = {
      timestamp: Date.now(),
      correct: isCorrect,
      confidence: confidence,
    };

    // Update progress through API
    fetch("/api/updateQuestionProgress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        unitId: params.unitId,
        questionId: currentQuestionId,
        attempt,
      }),
    });

    let newUpdatedQuestions = {
      ...questions,
      [currentQuestionId]: {
        ...currentQuestion,
        history: currentQuestion.history
          ? [...currentQuestion.history, attempt]
          : [attempt],
      },
    };

    setUpdatedQuestions(newUpdatedQuestions);
    nextQuestion();
  };

  const checkAnswer = () => {
    if (!currentQuestion.answer) return;

    if (
      isNumericAnswer(userAnswer) &&
      isNumericAnswer(currentQuestion.answer)
    ) {
      const isCorrect = checkNumericAnswer(userAnswer, currentQuestion.answer);
      if (isCorrect) {
        toast({
          title: "Correct!",
          description: "Well done!",
        });
        setShowAnswer(true);
      } else {
        setAttempts(attempts + 1);
        toast({
          variant: "destructive",
          title: "Incorrect Answer",
          description: `Attempt ${attempts + 1}. Try again!`,
        });
        // Don't show answer yet, let them try again
      }
    } else {
      setAttempts(attempts + 1);
      setShowAnswer(true);
    }
  };

  const startQuiz = () => {
    if (!questions || numQuestions === 0) return;

    // Randomly select questions while maintaining map structure
    const questionIds = Object.keys(questions);
    const shuffledIds = [...questionIds].sort(() => 0.5 - Math.random());
    const selectedIds = shuffledIds.slice(0, numQuestions);

    const selectedQuestions = selectedIds.reduce(
      (acc: Record<string, any>, id: string) => {
        acc[id] = questions[id];
        return acc;
      },
      {}
    );

    setCurrentQuestions(selectedQuestions);
    setCurrentQuestionId(selectedIds[0]);
    setQuizStarted(true);
    setShowAnswer(false);
    setUserAnswer(defaultDoc);
    setConfidence(3);
    setAttempts(1);
  };

  const nextQuestion = () => {
    const questionIds = Object.keys(currentQuestions);
    const currentIndex = questionIds.indexOf(currentQuestionId);

    if (currentIndex < questionIds.length - 1) {
      setCurrentQuestionId(questionIds[currentIndex + 1]);
      setShowAnswer(false);
      setUserAnswer(defaultDoc);
      setConfidence(3);
      setAttempts(1);
    } else {
      setQuizStarted(false);
      setNumQuestions(0);
    }
  };

  if (isLoading) return <Loading />;

  if (!quizStarted) {
    const maxQuestions = questions ? Object.keys(questions).length : 0;
    return (
      <div className="flex flex-col items-center gap-4 p-4">
        <h1 className="text-2xl font-bold">Quiz Setup</h1>
        <div className="w-full max-w-xs">
          <label className="flex flex-col gap-4">
            <span className="text-sm font-medium">
              Number of questions: {numQuestions}
            </span>
            <Slider
              max={maxQuestions}
              min={0}
              step={1}
              onValueChange={(value) => setNumQuestions(value[0])}
              className="w-full"
            />
          </label>
        </div>
        <Button onClick={startQuiz}>Start Quiz</Button>
      </div>
    );
  }

  const currentQuestion = currentQuestions[currentQuestionId];

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="text-lg">
        Question {Object.keys(currentQuestions).indexOf(currentQuestionId) + 1}{" "}
        of {Object.keys(currentQuestions).length}
      </div>

      <div className="w-full max-w-2xl">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Question:</h2>
          <TipTap
            isEditable={false}
            setContent={() => {}}
            content={currentQuestion.question}
            flashcard={true}
          />
        </div>

        {currentQuestion.answer && !showAnswer && (
          <div className="mb-4">
            <TipTap
              isEditable={true}
              setContent={setUserAnswer}
              content={userAnswer}
              flashcard={true}
            />
            <div className="flex gap-2 mt-2">
              {isNumericAnswer(currentQuestion.answer) && attempts > 1 ? (
                <Button
                  onClick={() => {
                    if (
                      checkNumericAnswer(userAnswer, currentQuestion.answer)
                    ) {
                      setShowAnswer(true);
                    } else {
                      setUserAnswer(defaultDoc);
                      setAttempts(attempts + 1);
                    }
                  }}
                >
                  Try Again
                </Button>
              ) : (
                <Button onClick={checkAnswer}>Submit Answer</Button>
              )}
              <Button variant="secondary" onClick={() => setShowAnswer(true)}>
                Show Answer
              </Button>
            </div>
          </div>
        )}

        {!showAnswer && !isNumericAnswer(currentQuestion.answer) && (
          <Button className="w-full" onClick={() => setShowAnswer(true)}>
            Show Answer
          </Button>
        )}

        {showAnswer && (
          <div>
            <h2 className="text-xl font-bold mb-2">Answer:</h2>
            <TipTap
              isEditable={false}
              setContent={() => {}}
              content={currentQuestion.answer}
              flashcard={true}
            />

            <div className="mt-4">
              <div className="flex gap-4 items-center">
                <h3 className="font-bold">Rate your confidence:</h3>
                <div
                  className="rating"
                  onChange={(e: any) => setConfidence(parseInt(e.target.id))}
                >
                  <input
                    type="radio"
                    name="confidence-rating"
                    id="1"
                    className="mask mask-star"
                    checked={confidence === 1}
                  />
                  <input
                    type="radio"
                    name="confidence-rating"
                    id="2"
                    className="mask mask-star"
                    checked={confidence === 2}
                  />
                  <input
                    type="radio"
                    name="confidence-rating"
                    id="3"
                    className="mask mask-star"
                    checked={confidence === 3}
                  />
                </div>
              </div>
            </div>

            {isNumericAnswer(currentQuestion.answer) &&
            checkNumericAnswer(userAnswer, currentQuestion.answer) ? (
              <div className="flex gap-2 mt-4">
                <Button
                  className="flex-1"
                  variant="default"
                  onClick={() => handleAnswerSubmit(true)}
                >
                  Next Question
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 mt-4">
                <Button
                  className="flex-1 bg-green-700 hover:bg-green-800"
                  variant="default"
                  onClick={() => handleAnswerSubmit(true)}
                >
                  Got it Right
                </Button>
                <Button
                  className="flex-1"
                  variant="secondary"
                  onClick={() => handleAnswerSubmit(false)}
                >
                  Got it Wrong
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizPage;
