import { useNavigate } from "react-router-dom";
import '../styles/flashcard.css'
import { useSelector,useDispatch } from "react-redux";
import { useState,useEffect } from "react";
import { fetchUserSession } from '../redux/auth_reducer';
import image_main from '/src/assets/main2.svg'
import AppHeader from "../Header";
import { FaStar, FaBook } from 'react-icons/fa';
export default function Learn(){
    const navigate = useNavigate();
    const dispatch= useDispatch();
    const {status,sessionChecked}= useSelector(state=>state.auth||{});
    const [selecQuizMode, setSelecQuizMode] = useState([]);
    const quizTypes = [
        { value: 'all', label: 'All Question Types' },
        { value: 'multiple-choice', label: 'Multiple Choice' },
        { value: 'fill-in-the-blank', label: 'Fill In The Blank' },
        { value: 'matching', label: 'Matching' },
    ];

    useEffect(() => {
        if (!sessionChecked && status === 'idle') {   dispatch(fetchUserSession()); 
 }
    }, [dispatch, sessionChecked,status]);
   
    const [selectedTopicId, setSelectedTopicId] = useState('0');
    const all_mode = quizTypes.slice(1).map(t => t.value);
    const handleModeChange = (mode)=>{
      setSelecQuizMode(prevModes =>{
        if(mode ==='all'){
          if (prevModes.includes('all') || prevModes.length=== all_mode.length) {
          return [];}
          else {return all_mode;}
        }
        let newModes;
          if(prevModes.includes(mode)){
            newModes = prevModes.filter(m => m !== mode);
           
          } else {
            newModes = [...prevModes, mode];
          
          }
          return newModes.length === all_mode.length ? all_mode : newModes;
      })
    }
    const startQuiz = ()=>{
      if(selectedTopicId !=='0' && selecQuizMode.length>0){
        const modeString = selecQuizMode.join(',');
        navigate(`/quiz/${selectedTopicId}/${modeString}`)
      }
    }
    return(
        <div>
          <div class="shape shape-3"></div>
          <div class="shape1 shape1-1"></div>
          <FaStar className="floating-icon icon-1 star" />
            <FaBook className="floating-icon icon-2 star" />
            <FaStar className="floating-icon icon-3 circle-deco" />
            <FaStar className="floating-icon icon-4 star" />
            <FaStar className="floating-icon icon-5" />
            <AppHeader/>
            <div className='topic-selection-page-container'>
              <div className="selection-card">
            <h1>Practice Topics</h1>
            
        <div className="select-topic">
        <label
          htmlFor="topic-select"
          className="Topic-ID"
        >
          1. Topic ID
        </label>
        <select
          id="topic-select"
          className="topic"
          onChange={(e) => setSelectedTopicId(e.target.value)}
        >
          <option value="0"> -- Select Topic --</option>
          <option value="101"> Banking</option>
          <option value="102"> Business</option>
          <option value="103"> Marketing</option>
          <option value="104"> Human Resources</option>
          <option value="105"> Sales</option>
          <option value="106"> Accounting</option>
          <option value="107"> Commerce</option>
        </select>
      
        <label
          htmlFor="topic-select"
          className="Topic-ID"
        >
          2. Select Quiz Modes
        </label>
        <div className="checkbox">
          {quizTypes.map((type) => {
            const allSelectedExplicitly = selecQuizMode.length === all_mode.length;
            let isChecked;
            if (type.value === 'all') {
              isChecked = allSelectedExplicitly;}
            else {isChecked = selecQuizMode.includes(type.value);}
            return (
                            <label key={type.value}>
                                <input 
                                    type="checkbox" 
                                    checked={(isChecked)}
                                    onChange={() => handleModeChange(type.value)} 
                                    disabled={false }
                                /> 
                                {type.label}
                            </label>
                        );
          })}
        </div>
      </div>
      <button
        className="start-quiz"
        onClick={startQuiz}
        disabled = {selectedTopicId==='0' || selecQuizMode.length===0}
      >
        Start Quiz
      </button>
      </div>
<div className='image-main2'>
       
                   <img src={image_main}/>
       
               </div>
       </div>
       
        </div>
    )
}
