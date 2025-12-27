import '../styles/quiz.css';
import { Outlet } from 'react-router-dom';

function QuizLayout() {
  return (
    <div className="quiz-background-container">
      <div className="quiz-content-wrapper">
        <Outlet />
      </div>
    </div>
  );
}
export default QuizLayout;