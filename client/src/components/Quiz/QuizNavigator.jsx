import { useDispatch } from "react-redux";
import { moveNextAction } from "../redux/question_reducer";
import Quiz from "./Quiz"


export default function QuizNavigator({ totalQuestions, currentIndex, userAnswers,onFinal}){
    const dispatch = useDispatch();
    const goToQ = (index) => {
        dispatch(moveNextAction(index));
    };
    const cells = Array.from({length: totalQuestions},(_,i)=>{
        const isAnswered = userAnswers[i] !== undefined && userAnswers[i] !== null && userAnswers[i] !=="";
        let className = 'nav-cell';
        if(i===currentIndex){
            className+='current';
        }
        else if(isAnswered){
            className+= ' answered';
        }
        else {
            className += ' skipped';
        }
        return (
            <div
                 key = {i}
                 className={className}
                 onClick={()=> goToQ(i)}>
                    {i+1}
            </div>
        );
    });
    return (
        <div className="question-navigator">
            <h3>Progress</h3>
            <div className="navigator-grid">
                <div className="cell"> {cells} </div>
                <button className="next-final" onClick={onFinal}>                    
                    Final Quiz!
                </button>
            </div>
        </div>
    );
}