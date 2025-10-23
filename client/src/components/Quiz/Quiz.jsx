import { moveNextAction, movePreAction } from "../redux/question_reducer"
import {   pushResultAction, setStartTime, setUserId, updateAnswerAction } from "../redux/answer_reducer";
import { Link, useNavigate,useParams } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState,useCallback } from "react";

import QuizNavigator from "./QuizNavigator";
import '../styles/quiz.css';
import QUIZ_DATA from "./example1";
import { earnPoints_Number} from '../helper/helper'

const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    

    const pad = (num) => num.toString().padStart(2, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};


export default function Quiz(){
       const userId = useSelector(state => state.answer.userId);

       const Time_Limit = 5*60;
       const { topicId}=useParams();
       const dispatch=useDispatch();
       const {trace}= useSelector(state =>state.questions);
       const{answer} = useSelector(state => state.answer)
       const navigate= useNavigate();
       const {startTime} = useSelector(state=> state.answer);
       const [seconds, setSeconds] = useState(0);
       const [isQuizFinished, setIsQuizFinished]= useState(false);
       const [isHovering, setIsHovering] = useState(false);

       const currentIndex =trace;
       const currentQuestion = QUIZ_DATA[currentIndex];
       const totalQuestions = QUIZ_DATA.length;
       const pointPerQuestion = 100/totalQuestions;

       const handleSum = useCallback((isTimeUp = false)=>{
        
        const endTime = isTimeUp ? startTime + (Time_Limit*1000): Date.now();
        
        const tgian = endTime-startTime;
        const totalSeconds = Math.floor(tgian/1000);
        const timeDisplay=formatTime(totalSeconds);
        
        const correctAnswers = QUIZ_DATA.map(q=>q.answer);
        const details =[];
        const correcAnswersCount = earnPoints_Number(answer, correctAnswers, 1); 
        const finalScore = earnPoints_Number(answer, correctAnswers, pointPerQuestion);
        

        QUIZ_DATA.forEach((question, index)=> {
            const userAnswer= answer[index];

            const isCorrect= userAnswer ===question.answer;
            
            details.push({
                questionText: question.question,
                correctAnswer: question.answer,
                userAnswer: userAnswer,
                status: isCorrect? 'Correct':'Wrong'
            })
             
        })

        dispatch(pushResultAction({
            summary: {
                score: finalScore.toFixed(2),
                correct: correcAnswersCount,
                total: totalQuestions},
            details: details,
            endTime: endTime,
            completionTime: timeDisplay
        }));
        navigate('/result');

        }, [dispatch, navigate, startTime, answer, totalQuestions, pointPerQuestion, Time_Limit]);
       useEffect(()=>{
        if(!startTime){
            dispatch(setStartTime(Date.now()));
        }
        let interval = null;

        if(startTime && !isQuizFinished){
            interval = setInterval(()=>{
                const so_giay = Math.floor((Date.now()- startTime)/1000);
            
                const tg_con = Time_Limit- so_giay;
                setSeconds(tg_con);


            if(tg_con<=0){
                clearInterval(interval);
                setIsQuizFinished(true);
                handleSum(true);
            }
            },1000)
        }
        else if(isQuizFinished && interval){
            clearInterval(interval);
        }
        return()=> clearInterval(interval);
    },[dispatch, startTime,isQuizFinished, handleSum, Time_Limit]

    );
          
       function handleLogout(){
        dispatch(setUserId(null));
        navigate('/');
       }

       function onSelect(index){
        const checked = currentQuestion.options[index];
        dispatch(updateAnswerAction({trace: currentIndex,checked}));

       }
       
       

        function handleSum1(){
            setIsQuizFinished(true);
            handleSum();
        }

        function onNext(){
        if(currentIndex < totalQuestions-1){
            dispatch(moveNextAction());}
        else {
            handleSum1();
        }}

        function onFinal(){
            handleSum1();
        }
        function onPrev(){
        if(currentIndex>0){
            dispatch(movePreAction());}
        }

        const selectAnswer= answer[currentIndex];
        const getOptionLabel=(index)=>{
        return String.fromCharCode(65+index);
        }


        return (
        <div className="container-1">
            
            <header className='fl-header'>
                          <Link className="return" to="/">
                                <span>Home</span>
                          </Link>
                          <div className="user-Infor"
                               onMouseEnter={()=> setIsHovering(true)}
                               onMouseLeave={()=> setIsHovering(false)}>
                          
                          <div className="userId">
                              <h2>Hello, {userId}</h2>
                          </div>
                          {isHovering &&(
                            <div
                                className="logout"
                                onClick={handleLogout}> Log Out
                            </div>    
                          )}
                          </div>  
                    </header> 
            <h1 className="head-quiz">Topic: {topicId}</h1>

            <div className="time-display">                
                <span>Time: {formatTime(seconds)}</span>
            </div>
            <QuizNavigator
                 totalQuestions={totalQuestions}
                 currentIndex={currentIndex}
                 userAnswers={answer}
                 onFinal={onFinal}/>
            <div className="Question-Index">
                Question: {currentIndex+1}/{totalQuestions}
            </div>
            
            <div className="Q-content">
                <p className="q-text">{currentQuestion.question}</p>
                <div className="options">
                    {currentQuestion.options.map((option, index)=>(
                        <button key={index} 
                                className={`option-button ${selectAnswer===option ? 'selected' :''}`} 
                                onClick={()=> onSelect(index)}
                            >
                            {getOptionLabel(index)}.{option}
                        </button>
                    ))}

                </div>                
            </div>

            <div className="next-prev">
                {currentIndex>0 &&(
                <button className="prev" onClick={onPrev}>Prev </button> )}

                <button className="next" onClick={onNext}>
                    {currentIndex === (totalQuestions-1)? 'Final Quiz!' : 'Next'}
                </button>
            </div>

        </div>
       )
    }
  
