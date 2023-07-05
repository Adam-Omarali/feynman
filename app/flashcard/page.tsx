"use client"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { RootState } from "@/redux/store"
import { addFlashcard } from "@/services/addMaterial"
import { useState } from "react";
import { useSelector } from "react-redux"

export default function PopoverDemo() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [difficulty, setDifficulty] = useState(0);
    const [lesson, setLesson] = useState("");

    function createFlashCard(){
        const user = useSelector((state: RootState) => state.user);
        addFlashcard(user.id, {question: question, answer: answer, difficulty: difficulty, lesson: lesson})
    }

    return (
        <div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline">Open popover</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">New Flashcard</h4>
                        </div>
                        <div className="grid gap-2">
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="question">Question</Label>
                                <Input
                                    id="question"
                                    defaultValue="What is 1+1?"
                                    className="col-span-2 h-8"
                                    onChange={(e) => setQuestion(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="answer">Answer</Label>
                                <Input
                                    id="answer"
                                    defaultValue="2"
                                    className="col-span-2 h-8"
                                    onChange={(e) => setAnswer(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="difficulty">Difficulty</Label>
                                <Input
                                    id="difficulty"
                                    defaultValue="1"
                                    className="col-span-2 h-8"
                                    onChange={(e) => setDifficulty(e.target.valueAsNumber)}
                                />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="lesson">Lesson</Label>
                                <Input
                                    id="lesson"
                                    defaultValue="none"
                                    className="col-span-2 h-8"
                                    onChange={(e) => setLesson(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button onClick={createFlashCard}>Submit</Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export type Flashcard = {
    question: string;
    answer: string;
    difficulty: number;
    lesson: string;
}

