import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type Answer = {
    value: string;
    correctAnswer: string;
    isCorrect: boolean | null;
};

const AnswerSheet = () => {
    const [numberOfQuestions, setNumberOfQuestions] = useState(65);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [showAnswerKey, setShowAnswerKey] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState({ correct: 0, total: 0, percentage: 0 });

    useEffect(() => {
        setAnswers(Array(numberOfQuestions).fill({ value: '', correctAnswer: '', isCorrect: null }));
    }, [numberOfQuestions]);

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = { ...newAnswers[index], value: value.toLowerCase() };
        setAnswers(newAnswers);
    };

    const handleCorrectAnswerChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = { ...newAnswers[index], correctAnswer: value.toLowerCase() };
        setAnswers(newAnswers);
    };

    const checkAnswers = () => {
        const newAnswers = answers.map(answer => ({
            ...answer,
            isCorrect: answer.value && answer.correctAnswer
                ? answer.value === answer.correctAnswer
                : false
        }));
        setAnswers(newAnswers);

        const validQuestions = newAnswers.filter(a => a.value && a.correctAnswer);
        const correct = validQuestions.filter(a => a.isCorrect).length;
        const total = validQuestions.length;
        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
        setResults({ correct, total, percentage });
        setShowResults(true);
    };

    const renderAnswerInputs = () => {
        return (
            <div className="grid grid-cols-5 gap-x-4 gap-y-2">
                {answers.map((answer, index) => (
                    <div key={index} className="flex items-center space-x-1">
                        <Label htmlFor={`answer-${index}`} className="w-6 text-right">{index + 1}.</Label>
                        <Input
                            id={`answer-${index}`}
                            value={answer.value}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                            className={`w-14 ${answer.isCorrect === null
                                ? ''
                                : answer.isCorrect
                                    ? 'bg-green-100'
                                    : 'bg-red-100'
                                }`}
                            maxLength={5}
                        />
                        {showAnswerKey && (
                            <Input
                                value={answer.correctAnswer}
                                onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
                                className="w-14"
                                maxLength={5}
                                placeholder="Key"
                            />
                        )}
                    </div>
                ))}
            </div>
        );
    };


    const resetAll = () => {
        setNumberOfQuestions(65);
        setAnswers(Array(65).fill({ value: '', correctAnswer: '', isCorrect: null }));
        setShowAnswerKey(false);
        setResults({ correct: 0, total: 0, percentage: 0 });
    };
    return (
        <Card className="w-full max-w-7xl mx-auto my-8">
            <CardHeader>
                <CardTitle>Answer Sheet</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Label htmlFor="questionCount" className="text-gray-700 dark:text-gray-300">Number of Questions:</Label>
                            <Input
                                id="questionCount"
                                type="number"
                                value={numberOfQuestions}
                                onChange={(e) => setNumberOfQuestions(parseInt(e.target.value, 10) || 0)}
                                className="w-20"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Label htmlFor="showAnswerKey" className="text-gray-700 dark:text-gray-300">Show Answer Key:</Label>
                            <Switch
                                id="showAnswerKey"
                                checked={showAnswerKey}
                                onCheckedChange={setShowAnswerKey}
                            />
                        </div>
                        <Button onClick={checkAnswers}>Check Answers</Button>
                    </div>
                    <Button onClick={resetAll} variant="outline">Reset All</Button>
                </div>
                <div className="max-h-[calc(100vh-250px)] overflow-y-auto p-4  rounded-lg">
                    {renderAnswerInputs()}
                </div>
            </CardContent>
            <Dialog open={showResults} onOpenChange={setShowResults}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Results</DialogTitle>
                        <DialogDescription>
                            You got {results.correct} out of {results.total} correct.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <h3 className="text-2xl font-bold text-center">
                            {results.percentage}%
                        </h3>
                        <p className="text-center text-sm text-gray-500">
                            {results.percentage >= 70 ? "Great job!" : "Keep practicing!"}
                        </p>
                    </div>
                </DialogContent>
            </Dialog>

        </Card>
    );
};

export default AnswerSheet;