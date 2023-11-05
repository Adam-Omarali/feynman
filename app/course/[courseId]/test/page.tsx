"use client";

import Loading from "@/app/loading";
import { Slider } from "@/components/ui/slider";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function GenerateTest({ params }: { params: { courseId: string } }) {
  let course = useSelector(
    (state: RootState) => state.courses.value[params.courseId]
  );
  let allQuestions = useSelector((state: RootState) => state.questions);
  const [numQuestions, setNumQuestions] = useState(5);
  const [maxQuestions, setMaxQuestions] = useState(-1);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    setMaxQuestions(0);
    for (let unitId in course.units) {
      let unit = course.units[unitId];
      for (let lessonId in unit.lessons) {
        let lesson = unit.lessons[lessonId];
        console.log(maxQuestions + lesson.questions.length);
        setMaxQuestions(maxQuestions + lesson.questions.length);
      }
    }
  }, []);

  console.log(maxQuestions);

  if (maxQuestions < 0) {
    return <Loading />;
  }

  return (
    <div className="p-4">
      <Slider defaultValue={[0]} max={maxQuestions} step={1} />
      <p>hi</p>
    </div>
  );
}

export default GenerateTest;
