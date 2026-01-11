import {useDispatch, useSelector} from 'react-redux'
import { useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import image_main from '../assets/download.png'
import { fetchUserSession} from './redux/auth_reducer';
import AppHeader from './Header'; 
import { FaFire ,FaBrain, FaLightbulb } from 'react-icons/fa';
import { FaStar, FaBook } from 'react-icons/fa';
function Main(){
    const [showGlow, setShowGlow] = useState(false);
    
    const dispatch = useDispatch()
    
    
    const {isAuthenticated,user,status,sessionChecked}= useSelector(state=>state.auth||{});

    useEffect(() => {
        if (!sessionChecked && status === 'idle') { 
            dispatch(fetchUserSession()); 
        }
    }, [dispatch, sessionChecked,status]);
    
    useEffect(() => {
        const totalAnimationDuration = 600 + 500 + 50; 
        
        const timer = setTimeout(() => {
            setShowGlow(true);
        }, totalAnimationDuration);

        return () => clearTimeout(timer);
    }, []);


    const displayName = user?.UserName || user?.username;
    
  

    return(
    <div className='container'>
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <AppHeader /> 

    <div className='main-content-wrapper'>
        <div className='main-container'>
        <h1 className={`title ${showGlow ? 'animated-glow' : ''}`}>REVIEW</h1>
        <p className={`highlight-title ${showGlow ? 'animated-glow' : ''}`}>VOCABULARY

        </p>
        <p className='subtitle-text'>Elevate your specialized language proficiency in Economics and Business</p>
        {!isAuthenticated &&(
            <div className='not-logged-in'>
                <Link to="/login" className="start-learning">
                <FaFire size={24} style={{ marginRight: '10px' }}/>
                Start Learning
                </Link>
            </div>
        )}
        
        {
            isAuthenticated && (
                <>
                
                <div className='Menu'>
                    <h2 className='hear-menu'>
                        Welcome, {displayName}! Choose Your Mode:
                    </h2>
                    <div className='Menu-1'>
                        <div>
                        <Link to={'learn'}
                            className='Menu-C'>
                                
                            <span><FaLightbulb size={24} style={{ marginRight: '2px' }} />Flashcard</span>
                        </Link>
                        </div>
                        <Link className='Menu-C1'
                        to={'quiz/start'}
                            >
                                
                            <span><FaBrain size={24} style={{ marginRight: '10px' }} />Quiz</span>
                        </Link>
                    </div>

                </div>
                </>
            )

        }

        </div>

        <div className='image-main'>
            <div className="floating-icons-wrapper">
        <FaStar className="f-icon star-1" />
        <FaBook className="f-icon book-1" />
        <FaStar className="f-icon star-2" />
        <FaStar className="f-icon star-3" />
        <FaStar className="f-icon star-4" />
        <img src={image_main} alt="Main illustration" />
    </div>
        </div>
    </div> 
    </div>)
}

export default Main