"use client";

import Question from "@/components/Question";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/slider";
import { getUnitIdFromLessonId } from "@/lib/utils";
import { question } from "@/redux/questions";
import { RootState } from "@/redux/store";
import { getQuestions } from "@/services/fetchMaterial";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

function selectQuestion({
  answeredQ,
  allQ,
}: {
  answeredQ: question[];
  allQ: question[];
}) {
  //if prev question answered wrong
  //ask a simpler question (lower difficulty) with the same topic (similarity)
  //else select a random question from possible topics
  //then select a question that uses those topics
}

function GenerateTest({ params }: { params: { courseId: string } }) {
  let user = useSelector((state: RootState) => state.user);
  let questionState = useSelector((state: RootState) => state.questions);
  const [numQuestions, setNumQuestions] = useState(0);
  const [maxQuestions, setMaxQuestions] = useState(0);
  const [possibleQ, setPossibleQ] = useState<Array<question>>([]);
  const [units, setUnits] = useState<Array<string>>([]);
  const [testing, setTesting] = useState(false);

  function handleUnits(unitId: string) {
    let temp = [...units];
    if (units.includes(unitId)) {
      temp.splice(temp.indexOf(unitId), 1);
    } else {
      temp.push(unitId);
    }
    setUnits(temp);
    addQuestion(temp);
  }

  async function addQuestion(unitIds: Array<string>) {
    let count = 0;
    let qs: Array<question> = [];
    for (let unitId in unitIds) {
      let questions = await getQuestions(user.id, unitId);
      qs.concat(questions);
      count += questions.length;
    }
    // for (let unitId in course.units) {
    //   if (unitIds.includes(unitId)) {
    //     let unit = course.units[unitId];
    //     for (let lessonId in unit.lessons) {
    //       let lesson = unit.lessons[lessonId];
    //       for (let i in lesson.questions) {
    //         qs.push(allQuestions[lesson.questions[i]]);
    //       }
    //       count += lesson.questions.length;
    //     }
    //   }
    // }
    console.log(qs);
    setMaxQuestions(count);
    setPossibleQ(qs);
  }

  if (!testing) {
    return (
      <div className="p-4">
        <h1>Select The Units for Your Test</h1>
        <div className="flex gap-2 py-4">
          {Object.keys(user.courses[params.courseId].units).map(
            (unitId, idx) => {
              let unit = Object.values(user.courses[params.courseId].units)[
                idx
              ];
              return (
                <div key={idx}>
                  <Button
                    variant={units.includes(unitId) ? "default" : "outline"}
                    onClick={() => handleUnits(unitId)}
                  >
                    {unit.name}
                  </Button>
                </div>
              );
            }
          )}
        </div>
        <div className="flex gap-2 items-center">
          <p className="w-fit">Number of Questions</p>
          <Slider
            defaultValue={[0]}
            max={maxQuestions}
            step={1}
            onValueChange={(e: any) => setNumQuestions(e[0])}
          />
          <p>{numQuestions}</p>
        </div>
        <Button
          onClick={() => setTesting(true)}
          className="mt-2"
          disabled={numQuestions <= 0}
        >
          Submit
        </Button>
      </div>
    );
  } else {
    return (
      <div className="p-4">
        <Question question={possibleQ[0]} />
      </div>
    );
    //progress bar
    //
  }
}

export default GenerateTest;
