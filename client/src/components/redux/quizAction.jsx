import { pushResultAction } from "./answer_reducer";
import { resetAllAction } from "./question_reducer";
import { formatTime } from "../Quiz/Quiz";

export const submitQuiz = ()=> async(dispatch, getState)=>{
    const state = getState();
    const questions = state.questions.questions;
    const userAnswers = state.answer.answer;
    const quizId = state.questions.quizId;
    const startTime = state.answer.startTime;

    const details = questions.map((q, index) => {
        const userAnswerText = userAnswers[index] || 'No Answer';
        const isCorrect = userAnswerText === q.correctAnswer;
        
        return {
            vocabId: q.VocabId,
            questionText: q.questionText, 
            userAnswer: userAnswerText,
            correctAnswer: q.correctAnswer,
            isCorrect: isCorrect,
            status: isCorrect ? 'Correct' : 'Wrong'
        };
    });
    const endTime = new Date();
    const durationSeconds = (endTime.getTime() - new Date(startTime).getTime()) / 1000;
    const correctCount = details.filter(d => d.isCorrect).length;
    const totalQuestions = questions.length;
    const score = (correctCount / totalQuestions) * 100;

    const apiBody = {
        quizId,
        summary: { score, correct: correctCount, total: totalQuestions },
        completionTimeSeconds: Math.round(durationSeconds),
        details: details 
    };
    try {
        const response = await fetch('/api/quiz/submit', { 
            method: 'POST', body: JSON.stringify(apiBody), 
        });
        
        if (!response.ok) throw new Error('Failed to submit quiz.');

        dispatch(pushResultAction({
            summary: apiBody.summary, 
            details: details, 
            endTime: endTime.toISOString(),
            completionTime: formatTime(durationSeconds) 
        }));
        
        dispatch(resetAllAction()); 
        
    } catch(error) {
        console.error("Submission failed:", error);
    }
}