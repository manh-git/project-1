import { moveNextAction, movePreAction,setQuizData,setLoading, setError } from "../redux/question_reducer"
import { pushResultAction, setStartTime, updateAnswerAction,resetAnswerAction } from "../redux/answer_reducer";
import {  useNavigate,useParams } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState,useCallback,useRef } from "react";
import { fetchUserSession } from '../redux/auth_reducer';
import QuizNavigator from "./QuizNavigator";
import '../styles/quiz.css';
import quizMusic from '/src/assets/quiz.mp3'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadphonesSimple,faSlash  } from "@fortawesome/free-solid-svg-icons";
import AppHeader from "../Header";

const Min_Vocab= 4
const API_BASE_URL = 'http://localhost:3000';

const isFillCorrect = (userAnswer, correctAnswer)=>{
    if (!userAnswer || !correctAnswer) return false;
    return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
}
export const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    

    const pad = (num) => num.toString().padStart(2, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};


export default function Quiz(){

    const Time_Limit = 5*60;
    const { topicId,modes}=useParams();
    console.log("Curren topic: ",topicId);
    const dispatch=useDispatch();
    
    const {trace, questions, quizId, topicName, isLoading, error,currentTopicId}= useSelector(state =>state.questions);
    const{answer, startTime} = useSelector(state => state.answer)

    const navigate= useNavigate();
    
    const [isPlaying, setIsPlaying] = useState(false);

    const [seconds, setSeconds] = useState(0);
    const [isQuizFinished, setIsQuizFinished]= useState(false);

    const {user,status,sessionChecked}= useSelector(state=>state.auth||{});
    
    const isTimeRunningLow = seconds<=30 && seconds>0;

    useEffect(() => {
        if (!sessionChecked && status === 'idle') { 
            dispatch(fetchUserSession()); 
    }
    }, [dispatch, sessionChecked,status]);
    const quizModes = modes;
    const fetchQuizData = useCallback(async () => {
        const selectedMode = quizModes;
    if(isLoading) return;
    dispatch(setLoading(true));
    try{
        const response = await fetch(`${API_BASE_URL}/api/quiz/generate/${topicId}/${selectedMode}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', 
            }
        );
        const data = await response.json();
        
        if(response.ok && data.questions && data.questions.length > 0){
            dispatch(setQuizData({
                questions: data.questions,
                quizId: data.quizId,
                topicName: data.topic,
                currentTopicId: topicId 
            }));
            
            dispatch(resetAnswerAction());
            dispatch(setStartTime(Date.now())); 
        } else {
            throw new Error(data.message || 'Failed to generate quiz.');
        }
    }
    catch(e){
        console.error("Fetch Quiz Error:", e);
        dispatch(setError(e.message ||'Failed to download quiz data.'));
    } finally {
        dispatch(setLoading(false));
    }
}, [dispatch, topicId, isLoading,error,quizModes]);
    useEffect(() => {
        if (!sessionChecked) return;
        if (!user && sessionChecked) {
            navigate('/login'); 
            return;
    }

        const isCorrectQuizLoaded = questions.length > 0 && topicId === currentTopicId;
    
        if (!isCorrectQuizLoaded && !isLoading && !error) {
            fetchQuizData();
    }
    
        if (isCorrectQuizLoaded && !startTime) {
            dispatch(setStartTime(Date.now()));
    }
    
}, [dispatch, topicId, currentTopicId, questions.length, startTime, isLoading, error, fetchQuizData, navigate, user, sessionChecked]);


    const audioRef = useRef(null);
    function toggleMusic(){
        if(audioRef.current){
            if(isPlaying){
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.muted = false;
                audioRef.current.volume = 0.5;
                audioRef.current.play()
                .then(()=>{
                    setIsPlaying(true);
                })
                .catch(error=>{
                    console.error("Autoplay", error);
                })
            }
        }
    }
    const currentIndex =trace;
    const totalQuestions = questions.length;
    const currentQuestion = questions[currentIndex];

    function onSelectMCQ(optionText){
        dispatch(updateAnswerAction({trace: currentIndex, checked: optionText}));
    }
    function handleFillInChange(event){
        const userInput = event.target.value;
        dispatch(updateAnswerAction({trace: currentIndex, checked: userInput}));
    }
    
    const [selectedElementIds, setSelectedElementIds] = useState([]);
    
    const [selectedMatchIds, setSelectedMatchIds] = useState([]);
    
    function handleMatching(elementId){
        const elementIdString = String(elementId);
        let newSelectedIds = [...selectedElementIds];
        let newMatchIds = [];
        let finalElementIdsToRedux = null;

        const selectedIndex = newSelectedIds.indexOf(elementIdString);

        if (selectedIndex !== -1) {
            
            newSelectedIds = newSelectedIds.filter(id => id !== elementIdString);
            
            if (newSelectedIds.length % 2 !== 0 && newSelectedIds.length > 0) {
                
                newSelectedIds = [];
            } else if (selectedIndex === newSelectedIds.length) {
                
            } else {
                
                newSelectedIds = [];
            }

            
        } else { 
            
            if (newSelectedIds.length < Min_Vocab) {
                newSelectedIds.push(elementIdString);
            } else {
                
                newSelectedIds = [elementIdString];
            }
        }
        
        setSelectedElementIds(newSelectedIds);

        if (newSelectedIds.length === Min_Vocab) {
            
            newMatchIds = Array.from(new Set(
                newSelectedIds.map(id => {
                    const el = currentQuestion.matchingElements.find(e => String(e.id) === id);
                    return el ? String(el.matchId) : null;
                }).filter(id => id !== null)
            )).sort();
            setSelectedMatchIds(newMatchIds);
            
            
            const pairs = [
                [newSelectedIds[0], newSelectedIds[1]],
                [newSelectedIds[2], newSelectedIds[3]]
            ];
            finalElementIdsToRedux = JSON.stringify(pairs);

        } else {
            
            setSelectedMatchIds([]);
            if(newSelectedIds.length > 0){
                
                finalElementIdsToRedux = JSON.stringify(newSelectedIds);
            }
            else{
                finalElementIdsToRedux = null;
            }
        }

        
        dispatch(updateAnswerAction({
            trace: currentIndex,
            checked: finalElementIdsToRedux 
        }));
    }

    useEffect(()=>{
        if(currentQuestion?.type === 'matching'){
            const currentAnswer = answer[currentIndex];
            let restoredElementIds = [];
            let restoredMatchIds = [];
            
            if(currentAnswer){
                try{
                    const parsedAnswer = JSON.parse(currentAnswer);

                    
                    if (Array.isArray(parsedAnswer) && parsedAnswer.length === 2 && Array.isArray(parsedAnswer[0])) {
                        restoredElementIds = parsedAnswer.flat().map(String);
                        
                        
                        restoredMatchIds = Array.from(new Set(
                            restoredElementIds.map(id => {
                                const el = currentQuestion.matchingElements.find(e => String(e.id) === id);
                                return el ? String(el.matchId) : null;
                            }).filter(id => id !== null)
                        )).sort();

                    } 
                    
                    else if (Array.isArray(parsedAnswer) && parsedAnswer.length < Min_Vocab) {
                        restoredElementIds = parsedAnswer.map(String);
                        restoredMatchIds = [];
                    }
                
                } catch(e){
                    console.error("error parsing stored matching answer:",e);
                    restoredElementIds = [];
                    restoredMatchIds = [];
                }
            } 
            setSelectedMatchIds(restoredMatchIds);
            setSelectedElementIds(restoredElementIds);
        }
        else{setSelectedMatchIds([]); setSelectedElementIds([]);}
    },[currentIndex, currentQuestion,answer]);

    const renderQuestion = ()=>{
        if(!currentQuestion) return null;
        if(currentQuestion.type === 'multiple-choice'){
            return(
                <div className="options">
                    {currentQuestion.options?.map((option,index)=>(
                        <button key={option.optionText}
                                className ={`option-button ${answer[currentIndex]=== option.optionText ? 'selected' :''}`} 
                                onClick={() => onSelectMCQ(option.optionText|| '')} 
                                >{String.fromCharCode(65 + index)}.{option.optionText||'lỗi'}
                        </button>
                    ))}

                </div>
            )
        }
        else if(currentQuestion.type === 'fill-in-the-blank'){
            return (
            <div className="fill-in-container">
                <input 
                    type="text"
                    className="fill-in-input"
                    placeholder="Your answer..."
                    value={answer[currentIndex] || ''} 
                    onChange={handleFillInChange}
                />
            </div>
        );

        }
        else if(currentQuestion.type === 'matching'){
            const selectionCount = selectedElementIds.length;
            

            return (
                <div className="matching-container">
                    <div className ="matching-grid">
                        {currentQuestion.matchingElements?.map((el)=>{
                            const elIdString = String(el.id);
                            const selectedIndex = selectedElementIds.indexOf(elIdString); 
                            
                            let matchClass = '';

                            if(selectedIndex !== -1){
                                
                                if (selectedIndex === 0 || selectedIndex === 1) { 
                                    matchClass = 'select-1'; 
                                } else if (selectedIndex === 2 || selectedIndex === 3) {
                                    matchClass = 'select-2'; 
                                }
                            }
                            return(
                            <button key = {el.id}
                                        className={`matching-item ${el.type} ${matchClass}`}
                                        onClick={()=> handleMatching(el.id)}
                                        
                                        disabled={selectionCount === Min_Vocab && selectedIndex === -1} >
                                            {el.text}
                            </button>)
        })}
                    </div>
                    
                    
                </div>
            )
        }
    }
    const handleSum = useCallback(async(isTimeUp = false)=>{
    
        if(isQuizFinished || totalQuestions === 0 || !quizId) return;

        setIsQuizFinished(true);
        if(audioRef.current && isPlaying){
            audioRef.current.pause();
            setIsPlaying(false);
        }

        const endTime = isTimeUp ? startTime + (Time_Limit*1000): Date.now();
        
        const tgian = endTime-startTime;
        const totalSeconds = Math.floor(tgian/1000);
        const completionTimeSeconds = Math.max(0, totalSeconds); 
        const timeDisplay=formatTime(completionTimeSeconds);
        
        const safePointPerQuestion = totalQuestions > 0 ? 100/totalQuestions : 0;
        
        let correctAnswersCount=0;
        const details = [];

        questions.forEach((question, index)=> {
            const userAnswer= answer[index];
            let isCorrect = false;
            let displayCorrectAnswer= question.correctAnswer;
            let displayUserAnswer = userAnswer ;
            let vocabIdToSave = question.VocabId;

            if(question.type === 'matching'){
    isCorrect= false;
    let userElementPairs = [];
    let userElementIds = [];
    let userMatchIds = [];

    if (typeof userAnswer === 'string') {
        try {
            const parsedAnswer = JSON.parse(userAnswer);

            if (Array.isArray(parsedAnswer) && parsedAnswer.length === 2 && Array.isArray(parsedAnswer[0])) {
                userElementPairs = parsedAnswer;
                userElementIds = parsedAnswer.flat().map(String);

                userMatchIds = Array.from(new Set(
                    userElementIds.map(id => {
                        const el = question.matchingElements.find(e => String(e.id) === id);
                        return el ? String(el.matchId) : null;
                    }).filter(id => id !== null)
                )).sort();

                const userSelections = [];

                userElementPairs.forEach((pair, idx) => {
                    const el1 = question.matchingElements.find(el => String(el.id) === pair[0]);
                    const el2 = question.matchingElements.find(el => String(el.id) === pair[1]);
                    if (el1 && el2) {
                        userSelections.push(`(${idx + 1}) ${el1.text} - ${el2.text}`);
                    }
                });
                displayUserAnswer = userSelections.join(' || ');


            } else if (Array.isArray(parsedAnswer) && parsedAnswer.length > 0) {

                const texts = parsedAnswer.map(id => {
                    const el = question.matchingElements.find(e => String(e.id) === id);
                    return el ? el.text : '?';
                });
                displayUserAnswer = `Curently Selecting: ${texts.join('__')}`;
            } else {
                displayUserAnswer = 'No Answer.';
            }
        } catch (e) {
            console.error("Error parsing user answer for matching:", e);
            displayUserAnswer = 'Error Data';
        }
    }


    if (userElementPairs.length === 2) {
        let allPairsArePerfectMatch = true;


        for (const pair of userElementPairs) {
            const el1 = question.matchingElements.find(el => String(el.id) === pair[0]);
            const el2 = question.matchingElements.find(el => String(el.id) === pair[1]);


            if (!el1 || !el2) {
                allPairsArePerfectMatch = false;
                break;
            }


            const isCorrectMatchIdPair = (el1.matchId === el2.matchId);


            const isWordMeanPair = (el1.type !== el2.type) &&
                ((el1.type === 'word' && el2.type === 'mean') || (el1.type === 'mean' && el2.type === 'word'));


            if (!isCorrectMatchIdPair || !isWordMeanPair) {
                allPairsArePerfectMatch = false;
                break;
            }
        }


        if (allPairsArePerfectMatch) {
            isCorrect = true;
        }
    }


    if(question.matchingDetails){
        displayCorrectAnswer = question.matchingDetails.map((d,idx)=>`(${idx+1}) ${d.word} - ${d.mean}`);
        displayCorrectAnswer = displayCorrectAnswer.join(' || ')
    } else {
        displayCorrectAnswer = 'No information correct answer.';
    }

    vocabIdToSave = null;
}else if(question.type === 'fill-in-the-blank'){
                isCorrect = isFillCorrect(userAnswer, question.correctAnswer);
            } else {
                isCorrect = userAnswer === question.correctAnswer;
            }

            if(isCorrect) correctAnswersCount++;

            details.push({
                vocabId: vocabIdToSave,
                questionText: question.questionText,
                correctAnswer: displayCorrectAnswer,
                userAnswer: displayUserAnswer,
                status: isCorrect? 'Correct':'Wrong',
                type: question.type
            })
            
        })
                        const finalScore = correctAnswersCount* safePointPerQuestion;
        const summaryData = {
            score: finalScore.toFixed(2),
            correct: correctAnswersCount,
            total: totalQuestions
        };


        dispatch(pushResultAction({
            summary: summaryData,
            details: details,
            endTime: endTime,
            completionTimeSeconds: completionTimeSeconds,
            completionTime: timeDisplay
        }));

        try {

            const submissionResponse = await fetch(`${API_BASE_URL}/api/quiz/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    quizId: quizId,
                    summary: summaryData,
                    completionTimeSeconds: completionTimeSeconds,
                    details: details
                })
            });
            const submissionResult = await submissionResponse.json();
            console.log("Submission Response Status:", submissionResponse.status);
            console.log("Submission Result Body:", submissionResult);
            if (!submissionResponse.ok || submissionResult.status !== 'success') {
                console.error("Quiz Submission Failed:", submissionResult.message);
            }
        }catch(e) {
            console.error("Error submitting quiz to backend:", e);
        } 

        navigate('/result');

    }, [dispatch, navigate, startTime, answer, totalQuestions, Time_Limit, quizId, questions]);
    
    useEffect(()=>{
        
        let interval = null;

        if(startTime && !isQuizFinished){
            interval = setInterval(()=>{
                const so_giay = Math.floor((Date.now()- startTime)/1000);
            
                const tg_con = Time_Limit- so_giay;
                setSeconds(tg_con);


            if(tg_con<=0){
                clearInterval(interval);
                setSeconds(0);
                setIsQuizFinished(true);
                handleSum(true);
            }
            },1000)
        }
        else if(isQuizFinished && interval){
            clearInterval(interval);
        }
        return()=> clearInterval(interval);
    },[startTime,isQuizFinished, handleSum, Time_Limit]

    );
    if (isLoading) {
        return (
            <div className="container-1 loading-state">
                <h2>Loading Quiz Questions...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-1 error-state">
                <h2> Error: {error}</h2>
                <button onClick={() => navigate('/')}>Return to Home</button>
            </div>
        );
    }
    
    if (totalQuestions === 0) {
        return (
            <div className="container-1 empty-state">
                <h2> No questions found for this topic.</h2>
                <button onClick={() => navigate('/')}>Return to Home</button>
            </div>
        );
    }    
    
    function onNext(){
        if(currentIndex < totalQuestions-1){
            dispatch(moveNextAction());}
        else {
            handleSum();
        }}

    function onFinal(){
        handleSum();
    }
    function onPrev(){
        if(currentIndex>0){
            dispatch(movePreAction());}
    }

    return (
        <div className="container-1">
            <audio ref = {audioRef} src={quizMusic} loop className="hiden"></audio>
            
            <AppHeader/>
            <h1 className="head-quiz1">Topic: {topicName}</h1>

            <div className="quiz-time-process">
            <div className={`time-display ${isTimeRunningLow ? 'time-low-alert' : ''}`}> 
                <span>Time: {formatTime(seconds)}</span>
            </div>
            <button onClick = {toggleMusic} className="music-control" title={isPlaying ? "Playing" : " Paused"}>
                <div className="icon-overlay-container"> 
                    <FontAwesomeIcon 
                        icon={faHeadphonesSimple} 
                        className="headphones-icon"
                    />
                    {!isPlaying && (
                        <FontAwesomeIcon
                           icon = {faSlash}
                           className="overlay-slash-icon"
                        />
                    )}
                </div>
            </button>
            <QuizNavigator
                    totalQuestions={totalQuestions}
                    currentIndex={currentIndex}
                    userAnswers={answer}
                    onFinal={onFinal}/>
            </div>
           
            <div className="Q-content">
                <p className="q-text">{currentQuestion.questionText}</p>
                {renderQuestion()}
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