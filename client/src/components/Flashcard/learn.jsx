import { useNavigate } from "react-router-dom";
import '../styles/flashcard.css'
import { Link } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { useState } from "react";
import {setUserId} from "../redux/answer_reducer";

export default function Learn(){
    const navigate = useNavigate();
    const userId = useSelector(state => state.answer.userId);
    const dispatch= useDispatch();
    const [isHovering, setIsHovering] = useState(false);
    function handleLogout(){
                dispatch(setUserId(null));
                navigate('/');
               }

    const selectTopic= (topicId)=>{
        navigate(`/learn/${topicId}`);
    };
    return(
        <div>
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
            <h1>Select Your Flashcard Topic</h1>
            <div className="btn-topic">
            <button onClick={()=> selectTopic('1')}>1</button>
            <button onClick={()=> selectTopic('2')}>2</button>
            <button onClick={()=> selectTopic('3')}>3</button>
            </div>
        </div>
    )
}
