import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { resetAllAction } from "../redux/question_reducer";
import { resetAnswerAction } from "../redux/answer_reducer";
import ResultTable from "./ResultTable";
import React, { useState, useEffect } from "react";
import '../styles/result.css';
import AppHeader from "../Header";
import { FaTrophy, FaCheck, FaClock, FaClipboardList } from 'react-icons/fa'; 


const getStatus = (status) => {
    return status === 'Correct' ? 'status-correct' : 'status-wrong';
};

const displayAnswer = (answer, questionType) => {
    if (answer === null || answer === undefined) return 'No Answer.';

    if (questionType === 'matching') {
        try {
            const parsed = JSON.parse(answer);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return `Đã nối các cặp ID: [${parsed.join(', ')}]`;
            }
        } catch (e) {
            return answer;
        }
    }
    return answer;
};

export default function Result() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { answer, detailResult, completionTime, summary } = useSelector(state => state.answer);
    const { topicName, currentTopicId } = useSelector(state => state.questions);
    const [showDetail, setShowDetail] = useState(false);
    
    
    const totalQuestions = summary.total || 0;
    const correcAnswersCount = summary.correct || 0;
    const earnedPoints = summary.score || '0.00';
    const totalAttempts = answer.filter(a => a !== undefined && a !== null && a !== '').length;

    function restartQuiz() {
        dispatch(resetAllAction());
        dispatch(resetAnswerAction());
        navigate(`/quiz/start`);
    }

    useEffect(() => {
        document.body.classList.add('result-body');

        return () => {
            document.body.classList.remove('result-body');
        };
    }, []);

    const toggleDetails = () => {
        setShowDetail(prev => !prev);
    }

    return (
        <div className="result-container">
            <AppHeader />
            
            <div className='topic-selection-page-wrapper'>
                <h1 className="Result">Result</h1>
                <div className="ketquaht">
                    <p><FaClipboardList className="icon" />Total Questions: {totalQuestions}</p>
                    <p><FaCheck className="icon" />Attempts: {totalAttempts}</p>
                    <p><FaTrophy className="icon" />Correct Question: {correcAnswersCount}</p>
                    <p><FaTrophy className="icon" />Score: <span className='score-value'>
                        {typeof earnedPoints === 'string' ? earnedPoints : earnedPoints.toFixed(2)}
                    </span></p>
                    <p><FaClock className="icon" />Time: {completionTime}</p>
                </div>
                <div className="result-actions-group">
                <div className="detail-table">
                    <button onClick={toggleDetails} className="btn-detail">
                        {showDetail ? 'Hide Answer Detail' : 'View Answer Details'}
                    </button>
                </div>
                {showDetail && (
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
                                        detailResult.map((item, i) => (
                                            <tr key={i} className={item.status === 'Correct' ? 'row-correct' : 'row-wrong'}>
                                                <td>{i + 1}</td>
                                                <td>{item.questionText}</td>
                                                <td>{displayAnswer(item.userAnswer, item.type)}</td>
                                                <td>{displayAnswer(item.correctAnswer, item.type)}</td>
                                                <td className={getStatus(item.status)}>
                                                    {item.status === 'Correct' ? 'Correct' : 'Wrong'}
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </React.Fragment>
                )}
                
                {currentTopicId && topicName && <ResultTable topicId={currentTopicId} topicName={topicName} />}
                </div>
                <div className="result-actions">
                    <button onClick={restartQuiz} className="btn-detail"
                        >
                        Restart Quiz!
                    </button>
                </div>
            </div>
        </div>
    )
}