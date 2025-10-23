import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faReply, faTimes,faArrowLeft, faArrowRight} from '@fortawesome/free-solid-svg-icons'
import {useState} from 'react';
import Content from './content';
import { Link,useParams, useNavigate } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux';
import {    setUserId } from "../redux/answer_reducer";

const FlashCard=({
    //frontTitle,
    //backTitle,
    frontText,
    backText,
    isFlipped,
    setIsFlipped,
    onPrev,
    onNext,
    currentCartIndex,
    totalCards,
}
)=>{

    const navigate = useNavigate();
    function handleGoTopic(){
      navigate('/learn');
    }
    const userId = useSelector(state => state.answer.userId);
    
    
    const displayIndex = currentCartIndex+1;
    const dispatch= useDispatch();
    const [isHovering, setIsHovering] = useState(false);
    function handleLogout(){
            dispatch(setUserId(null));
            navigate('/');
           }
    const {topicId} = useParams();
    const footer=(
        <footer>
            {}
            {currentCartIndex>0 && (
              <button className='nav-button prev' onClick={onPrev}>
                <FontAwesomeIcon icon={faArrowLeft} size="2x"/>
              </button>
            )}
            <button className='quay' 
                 name="toggle"
                 onClick={()=> setIsFlipped(prev=>!prev)}
            >
                <FontAwesomeIcon icon={faReply} size="2x" className="icon"/>


            </button>
            {}
            {
              currentCartIndex< totalCards-1 &&(
                <button className='nav-button next' onClick={onNext}>
                  <FontAwesomeIcon icon={faArrowRight} size="2x"/>
                </button>
              )
            }
        </footer>
    );
    return(
      <div className='flascard-page'>
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
        
        
        <div className={isFlipped ? "flippable flipped" : "flippable"}>
            
          <div className="flippable__inner">
            <div className="flippable__content front">
              <button
                className='close-card'
                onClick={handleGoTopic}>
                  <FontAwesomeIcon icon={faTimes}/>
                  <span>Close </span>

              </button>

              <div className='card-index'>
                {displayIndex}/{totalCards}
              </div>
              <Content text={frontText}/>
              {footer}
            </div>
            <div className="flippable__content back">
          
              <Content text={backText} />
              {footer}
            </div>
          </div>
        </div>
      </div>
  );


};



export default FlashCard;