"use client";

import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/slider";
import { RootState } from "@/redux/store";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

function GenerateTest({ params }: { params: { courseId: string } }) {
  let course = useSelector(
    (state: RootState) => state.courses.value[params.courseId]
  );
  let allQuestions = useSelector((state: RootState) => state.questions);
  const [numQuestions, setNumQuestions] = useState(0);
  const [maxQuestions, setMaxQuestions] = useState(0);
  const [possibleQ, setPossibleQ] = useState<Array<string>>([]);
  const [units, setUnits] = useState<Array<string>>([]);

  function handleUnits(unitId: string) {
    let temp = [...units];
    if (units.includes(unitId)) {
      temp.splice(temp.indexOf(unitId), 1);
    } else {
      temp.push(unitId);
    }
    setUnits(temp);
    handleSumbit(temp);
  }

  function handleSumbit(unitIds: Array<string>) {
    let count = 0;
    let qIds = [];
    for (let unitId in course.units) {
      if (unitIds.includes(unitId)) {
        let unit = course.units[unitId];
        for (let lessonId in unit.lessons) {
          let lesson = unit.lessons[lessonId];
          for (let qId in lesson.questions) {
            qIds.push(qId);
          }
          count += lesson.questions.length;
        }
      }
    }
    setMaxQuestions(count);
    setPossibleQ(qIds);
  }

  return (
    <div className="p-4">
      <h1>Select The Units for Your Test</h1>
      <div className="flex gap-2 py-4">
        {Object.values(course.units).map((unit, id) => {
          return (
            <div key={id}>
              <Button
                variant={units.includes(unit.id) ? "default" : "outline"}
                onClick={() => handleUnits(unit.id)}
              >
                {unit.name}
              </Button>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2">
        <Slider
          defaultValue={[0]}
          max={maxQuestions}
          step={1}
          onValueChange={(e: any) => setNumQuestions(e[0])}
        />
        <p>{numQuestions}</p>
      </div>
      <Button onClick={() => {}} className="mt-2">
        Submit
      </Button>
    </div>
  );
}

export default GenerateTest;
