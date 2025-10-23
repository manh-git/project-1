import {useDispatch} from 'react-redux'
import {useRef, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import TextInput from './Input';
import { setUserId } from './redux/answer_reducer';
import { Link } from 'react-router-dom'
import Flashcard from './Flashcard/Flashcard';
import image_main from '../assets/main.jpg'


function Main(){
    const navigate = useNavigate();
    const inputRef = useRef(null)
    const [userName,setUsername] = useState();
    const dispatch = useDispatch()
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    function handleLogout(){
                dispatch(setUserId(null));
                setIsMenuVisible(false);
                setUsername('');
               }

    function start(e){
        e.preventDefault();
        const currentName = userName.trim();
        if(currentName) {
            dispatch(setUserId(currentName));
            //console.log(`User ID: ${currentName}`)
            setIsMenuVisible(true)
        }
        else{
            alert("Please enter your name to start!")
        }
    }
    const handleSelection= (type)=>{
        alert(`start with ${type} mode with user: ${userName}` )
    }

    return(
    <div className='container'>
        <div className='main-container'>
        <h1 className='title text-light'>Review Vocabulary </h1>
        <p className='subtitle'>Improve your Marketing & Business language skills</p>
        {!isMenuVisible && (
        <form id="form" onSubmit={start}>
            <TextInput
            type="text"
            placeholder='Your Name'
            value={userName}
            onChange={(e)=> setUsername(e.target.value)}/>
            <button type="submit" className="start-learning">
                Start Learning
            </button>
        </form>)}
        {
            isMenuVisible && (
                <>
                <header className='fl-header'>
                          <Link className="return" to="/">
                            <span>Main</span>
                          </Link>
                          <div className="user-Infor"
                                onMouseEnter={()=> setIsHovering(true)}
                                onMouseLeave={()=> setIsHovering(false)}>
                                <div className="userId">
                                  <h2>Hello, {userName}</h2>
                                </div>
                                {isHovering &&(
                                  <div
                                    className="logout"
                                    onClick={handleLogout}> Exits

                                  </div>    

                                    )}

                          </div>  
                        </header>
                <div className='Menu'>
                    <h2 className='hear-menu'>
                        Welcome, {userName}! Choose Your Mode:
                    </h2>
                    <div className='Menu-1'>
                        <div>
                        <Link to={'learn'}
                           onClick={()=>handleSelection('Flashcard')}
                           className='Menu-C'>
                            <span>Flashcard</span>
                        </Link>
                        </div>
                        <Link className='Menu-C'
                        to={'quiz/start'}
                           onClick={()=>handleSelection('Quiz')}
                           >
                                <span>Quiz</span>
                        </Link>
                    </div>

                </div>
                </>
            )

        }

        </div>

        <div className='image-main'>

            <img src={image_main}/>

        </div>



       

    </div>)

}

export default Main