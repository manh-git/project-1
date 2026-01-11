import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faReply, faTimes,faCheckSquare} from '@fortawesome/free-solid-svg-icons'
import {useEffect} from 'react';
import Content from './content';
import { Link, useNavigate } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux';
import { fetchUserSession } from '../redux/auth_reducer';
import { StatsIcons } from './example';
import AppHeader from '../Header';
import Decorations from './icon';
const FlashCard=({
    topicName,
    frontText,
    backText,
    isFlipped,
    setIsFlipped,
    onMarkKnown,
    onMarkUnknown,
    learningCount,
    masteredCount,
    currentCartIndex,
    totalCards,
    wiggleTrigger,
    animationClass = 'is-current',
}
)=>{

    const navigate = useNavigate();
    function handleGoTopic(){
      navigate('/learn');
    }
    
    const displayIndex = currentCartIndex+1;
    const dispatch= useDispatch();
    const {status,sessionChecked}= useSelector(state=>state.auth||{});

    useEffect(() => {
        if (!sessionChecked && status === 'idle') {   dispatch(fetchUserSession()); 
 }
    }, [dispatch, sessionChecked,status]);

    
    const handleToggleFlip = (e) => {
      if (e.target.closest('button') || e.target.closest('a')) {
            return;}
      setIsFlipped(prev => !prev);
    }

    const handleMarkKnown = (e) => {
        e.stopPropagation(); 
        onMarkKnown();
    }
    const handleMarkUnknown = (e) => {
        e.stopPropagation(); 
        onMarkUnknown();
    }
    const footerFront=(
        <div>
            <button className='quay' 
                 name="toggle"
                 onClick={(e)=> {e.stopPropagation(); setIsFlipped(prev=>!prev);}}
            >
                <FontAwesomeIcon icon={faReply} size="2x" className="icon"/>
            </button>
        </div>
    );
    const footerBack =(
      <div className='back-card'>
        <div className='b-unknow'>
          <button className='unknow'
          onClick={handleMarkUnknown}>
            <FontAwesomeIcon icon={faTimes} className='icon-un'/>
            UnKnown

          </button>

        </div>
        <div className='b-know'>
          <button className='know'
          onClick={handleMarkKnown}>
            <FontAwesomeIcon icon={faCheckSquare} className='icon-k'/>
            Known

          </button>

        </div>
      </div>

    )
    return(
      <div className='flascard-page'>
        <div className='topic-selection-page-wrapper'>
        <h1 className="head-quiz">Topic: {topicName}</h1>
        <StatsIcons stats={{unknown: learningCount, known: masteredCount}} wiggleTrigger={wiggleTrigger} />
        
        <div className={`flippable ${isFlipped ? "flipped" : ""} ${animationClass}`}
             onClick={handleToggleFlip}
        >
            
          <div className="flippable__inner">
            <div className="flippable__content front">
              <button
                className='close-card'
                onClick={(e) => { e.stopPropagation(); handleGoTopic(); }}>
                  <FontAwesomeIcon icon={faTimes}/>
                  <span>Close </span>

              </button>

              <div className='card-index'>
                {displayIndex}/{totalCards}
              </div>
              <div className="card-main-content"> <Content text={frontText}/></div>
             
              {footerFront}
            </div>
            <div className="flippable__content back">
               <div className="card-main-content"><Content text={backText} /></div>
              
              {footerBack}
            </div>
          </div>
        </div>
        </div>
      </div>
  );


};



export default FlashCard;