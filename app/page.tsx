'use client'

import * as React from "react"

import { useTheme } from "next-themes"

import AnswerSheet from '@/components/answersheet'

interface Answer {
  text: string;
  correct: boolean | null;
}

export default function Home() {

  return (
    <main className="container mx-auto p-4">

      <AnswerSheet />
    </main>
  )
}
