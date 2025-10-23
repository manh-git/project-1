import { useSelector, useDispatch } from "react-redux";
import {Link, useNavigate} from 'react-router-dom'
import { resetAllAction } from "../redux/question_reducer";
import { resetAnswerAction,setUserId} from "../redux/answer_reducer";
import ResultTable from "./ResultTable"
import QUIZ_DATA from "./example1";
import React,{ useState,useEffect}  from "react";
import { attempts_Number, earnPoints_Number} from '../helper/helper';
import '../styles/result.css'

const totalQuestions = QUIZ_DATA.length;
const pointPerQuestion = 100 / totalQuestions;

const getStatus= (status)=>{
    return status ==='Correct' ? 'status-correct' : 'status-wrong';
}

export default function Result(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showDetail, setShowDetail] = useState(false);

    const {
        userId,
        answer,
        detailResult,
        completionTime
    } = useSelector(state => state.answer);

    const [isHovering, setIsHovering] = useState(false);
    function handleLogout(){
            dispatch(setUserId(null));
            navigate('/');
           }
    const correctAnswers= QUIZ_DATA.map(q=>q.answer);
    const totalAttempts = attempts_Number(answer);
    const earnedPoints = earnPoints_Number(answer, correctAnswers, pointPerQuestion);
    const correcAnswersCount = earnPoints_Number(answer, correctAnswers,1)

    function restartQuiz(){
        dispatch(resetAllAction());
        dispatch(resetAnswerAction());
        navigate(`/quiz/start`);
    }

    useEffect(()=>{
            document.body.classList.add('result-body');
    
            return()=>{
                document.body.classList.remove('result-body');
            };
        },[]); 
    /*if(answer.length===0){
        return(
            <div className="no-result">
                Currently, there are no results.
                <Link to="/">Main</Link>

            </div>
        )
    }*/
   const toggleDetails =()=>{
    setShowDetail(prev=>!prev);
   }

    return (
        <div className="result-container">
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
            <h1 className="Result">Result</h1>
            <div className="ketquaht">
                <p>Total Questions: {totalQuestions}</p>
                <p>Attemps: {totalAttempts}</p>
                <p>Correct Question: {correcAnswersCount}</p>
                <p>Score: {earnedPoints.toFixed(2)}</p>
                <p>Time : {completionTime}</p>
            </div>
            <div className="detail-table">
                <button onClick={toggleDetails} className="btn-detail">
                    {showDetail? 'Hide Answer Detail.' :'View Answer Details.' }
                </button>
                
            </div>
            {showDetail &&(
                <React.Fragment>
                    <h3 className="table-title">Answer Detail</h3>
                    <div className="table1">
                        <table className="table2">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Question</th>
                                    <th>Your Answer</th>
                                    <th>Correct Answer</th>
                                    <th>Status</th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    detailResult.map((item,i)=>(
                                        <tr key ={i} className={item.status === 'Correct' ? 'row-correct' : 'row-wrong'}>
                                           <td>{i+1}</td>
                                           <td>{item.questionText}</td>
                                           <td>{item.userAnswer || 'No Answer'}</td>
                                           <td>{item.correctAnswer}</td>
                                           <td className={getStatus(item.status)}>
                                            {item.status ==='Correct' ? 'Correct' :'Wrong'}
                                           </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>

                    </div>
                </React.Fragment>
            )}



            <div className="result-actions">
                <button onClick={restartQuiz} className="btn-restart">
                    Restart Quiz!
                </button>
                
            </div>
            {<ResultTable/>}
        </div>
    )

}
