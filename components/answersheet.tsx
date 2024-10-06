import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";

type Answer = {
    value: string;
    correctAnswer: string;
    isCorrect: boolean | null;
};

const DEFAULT_NUMBER_OF_QUESTIONS = 65;

const AnswerSheet = () => {
    const [numberOfQuestions, setNumberOfQuestions] = useState(DEFAULT_NUMBER_OF_QUESTIONS);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [showAnswerKey, setShowAnswerKey] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState({ correct: 0, total: 0, percentage: 0 });
    const [darkMode, setDarkMode] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const savedNumberOfQuestions = localStorage.getItem('numberOfQuestions');
        const savedAnswers = localStorage.getItem('answers');
        const savedShowAnswerKey = localStorage.getItem('showAnswerKey');
        const savedDarkMode = localStorage.getItem('darkMode');

        if (savedNumberOfQuestions) {
            setNumberOfQuestions(parseInt(savedNumberOfQuestions, 10));
        }
        if (savedAnswers) {
            setAnswers(JSON.parse(savedAnswers));
        } else {
            setAnswers(Array(DEFAULT_NUMBER_OF_QUESTIONS).fill({ value: '', correctAnswer: '', isCorrect: null }));
        }
        if (savedShowAnswerKey) {
            setShowAnswerKey(JSON.parse(savedShowAnswerKey));
        }
        if (savedDarkMode) {
            setDarkMode(JSON.parse(savedDarkMode));
        }
    }, []);

    useEffect(() => {
        if (isClient) {
            localStorage.setItem('numberOfQuestions', numberOfQuestions.toString());
            localStorage.setItem('answers', JSON.stringify(answers));
            localStorage.setItem('showAnswerKey', JSON.stringify(showAnswerKey));
            localStorage.setItem('darkMode', JSON.stringify(darkMode));
        }
    }, [isClient, numberOfQuestions, answers, showAnswerKey, darkMode]);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

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

    const resetAll = () => {
        const defaultAnswers = Array(DEFAULT_NUMBER_OF_QUESTIONS).fill({ value: '', correctAnswer: '', isCorrect: null });
        setNumberOfQuestions(DEFAULT_NUMBER_OF_QUESTIONS);
        setAnswers(defaultAnswers);
        setShowAnswerKey(false);
        setResults({ correct: 0, total: 0, percentage: 0 });
        if (isClient) {
            localStorage.setItem('numberOfQuestions', DEFAULT_NUMBER_OF_QUESTIONS.toString());
            localStorage.setItem('answers', JSON.stringify(defaultAnswers));
            localStorage.setItem('showAnswerKey', 'false');
        }
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
                            className={`w-12 ${answer.isCorrect === null
                                ? ''
                                : answer.isCorrect
                                    ? 'bg-green-100 dark:bg-green-900'
                                    : 'bg-red-100 dark:bg-red-900'
                                }`}
                            maxLength={5}
                        />
                        {showAnswerKey && (
                            <Input
                                value={answer.correctAnswer}
                                onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
                                className="w-12"
                                maxLength={5}
                                placeholder="Key"
                            />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    if (!isClient) {
        return null; // or a loading spinner
    }

    return (
        <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
            <div className="container mx-auto py-8 px-4 dark:bg-gray-900 min-h-screen">
                <Card className="w-full max-w-7xl mx-auto bg-white dark:bg-gray-800">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Answer Sheet</CardTitle>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setDarkMode(!darkMode)}
                                className="rounded-full"
                            >
                                {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                            </Button>
                        </div>
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
                                        onChange={(e) => setNumberOfQuestions(parseInt(e.target.value, 10) || DEFAULT_NUMBER_OF_QUESTIONS)}
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
                        <div className="max-h-[calc(100vh-250px)] overflow-y-auto p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            {renderAnswerInputs()}
                        </div>
                    </CardContent>
                </Card>
            </div>
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
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                            {results.percentage >= 70 ? "Great job!" : "Keep practicing!"}
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AnswerSheet;