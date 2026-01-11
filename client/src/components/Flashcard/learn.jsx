import { useNavigate } from "react-router-dom";
import '../styles/flashcard.css'
import { useSelector,useDispatch } from "react-redux";
import { useState,useEffect } from "react";
import { fetchUserSession } from '../redux/auth_reducer';
import image_main from '/src/assets/main1.svg'
import AppHeader from "../Header";
import { FaStar, FaBook,FaCloud } from 'react-icons/fa';
const MODES = {
    all: 'All',
    new: 'New',
    learning: 'UnKnown',
    mastered: 'Known'
};
const API_BASE_URL = 'http://localhost:3000';
export default function Learn(){
    const navigate = useNavigate();
    const dispatch= useDispatch();
    const {status,sessionChecked}= useSelector(state=>state.auth||{});

    const [selectedTopicId, setSelectedTopicId] = useState('0'); 
    const [selectedMode, setSelectedMode] = useState('all');        
    const [selectedLimit, setSelectedLimit] = useState(0);        
    const [countsAndLimits, setCountsAndLimits] = useState(null); 
    const [isLoadingCounts, setIsLoadingCounts] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        if (!sessionChecked && status === 'idle') {  dispatch(fetchUserSession()); 
    }
        }, [dispatch, sessionChecked,status]);
     
    

    const fetchCountsAndLimits = async (topicId,statusFilter ) => {
        setIsLoadingCounts(true);
        setFetchError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/topics/${topicId}?limit=0&status=${statusFilter}`,{
                credentials: 'include',
            }); 
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
                if (response.status === 404 && errorData.counts) {
                     setCountsAndLimits(errorData);
                     setFetchError(errorData.message || 'Topic is empty or invalid.');
                     setSelectedLimit(0);
                     return;
                 }
                throw new Error(errorData.message || `Session check failed: ${response.status}.`);
            }

            const data = await response.json();
            
            setCountsAndLimits(data);
            setFetchError(null);
            const allLimits = data.suggestedLimits || [];
            const defaultLimit = allLimits.includes(20) ? 20 : allLimits[0] || 0;
            setSelectedLimit(defaultLimit);
             } catch (error) {
                console.error("Error fetching counts and limits:", error);
                setFetchError("Failed to load topic data. Please check server connection.");
                setCountsAndLimits(null);
                setSelectedLimit(0);
            } finally {
                setIsLoadingCounts(false);
            }
    };

    useEffect(() => {
        if (selectedTopicId !== '0') {
            fetchCountsAndLimits(selectedTopicId,selectedMode);
        } else {
            setCountsAndLimits(null);
            setFetchError(null);
            setSelectedMode('all');
            setSelectedLimit(0); 
        }
    }, [selectedTopicId,selectedMode]);
    
    const getAvailableLimits = () => {
        if (!countsAndLimits || !countsAndLimits.suggestedLimits) return [];
        const currentCount = countsAndLimits.counts[selectedMode] || 0;
        return countsAndLimits.suggestedLimits.filter(limit => limit <= currentCount);
    };
    
    const handleTopicChange = (e) => {
        const newTopicId = e.target.value;
        if(newTopicId!=='0' && newTopicId!==selectedTopicId){
            setSelectedMode('all');
            setSelectedLimit(0);
        }
        setSelectedTopicId(newTopicId);
    };
    
    const handleModeChange = async (e) => {
        const newMode = e.target.value;
        setSelectedMode(newMode);
    };
    
    const handleStartLearning = () => {
        if (selectedTopicId === '0') {
            alert("Please choose a Topic.");
            return;
        }
        if (selectedLimit <= 0) {
            alert(`No vocab in the mode'${MODES[selectedMode]}' to study.`);
            return;
        }
        navigate(`/learn/${selectedTopicId}?status=${selectedMode}&limit=${selectedLimit}`);
    };
    
    const availableLimits = getAvailableLimits();
    const currentModeCount = countsAndLimits?.counts[selectedMode] || 0;
    const isReadyToDisplayControls = selectedTopicId !== '0' && countsAndLimits && !isLoadingCounts && !fetchError;
    
    return(
        <div>
            <div class="shape shape-5"></div>
            <div class="shape1 shape1-1"></div>
            <AppHeader/>
            <FaStar className="floating-icon icon-1 star" />
            <FaBook className="floating-icon icon-2 star" />
            <FaStar className="floating-icon icon-3 circle-deco" />
            <FaStar className="floating-icon icon-4 star" />
            <FaStar className="floating-icon icon-5 star" />
            <FaCloud className="floating-icon icon-8 star" />
            <div className='topic-selection-page-container'>
            <div className="selection-card">
            <h1>Select Your Flashcard Topic</h1>
            <div class="form-group">
            <div className="select-topic-page">
                <label
                  htmlFor="topic-select"
                  className="Topic-ID"
                >
                  1.Topic ID
                </label>
                <select
                  id="topic-select"
                  className="topic"
                  value={selectedTopicId}
                  onChange={handleTopicChange}
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
                </div>
                {isLoadingCounts && <div className="loading-message">Loading vocabulary counts...</div>}
                {fetchError && <div className="error-message" style={{color: 'red', marginTop: '10px'}}>{fetchError}</div>}
                
                {isReadyToDisplayControls && (
                    <>
                        <div class="form-group">
                        <label className="Topic-ID">
                            2. Select Mode (Available: {currentModeCount})
                        </label>
                        <select
                            id="mode-select"
                            className="topic"
                            value={selectedMode}
                            onChange={handleModeChange}
                        >
                            {Object.entries(MODES).map(([key, label]) => (
                            <option 
                                key={key} 
                                value={key}
                                disabled={countsAndLimits.counts[key] === 0}
                                >
                                {label} ({countsAndLimits.counts[key] || 0})
                            </option>
                            ))}
                        </select> 
                        </div>
                        <div class="form-group">
                        <label className="Topic-ID">
                            3. Select Card Limit (Max: {currentModeCount})
                        </label>
                        <select
                            id="limit-select"
                            className="topic"
                            value={selectedLimit}
                            onChange={(e) => setSelectedLimit(parseInt(e.target.value))}
                            disabled={availableLimits.length === 0}
                        >
                            {availableLimits.length > 0 ? (
                                availableLimits.map(limit => (
                                <option key={limit} value={limit}>{limit}</option>
                                ))
                            ) : (
                                <option value="0">No Cards Available</option>
                            )}
                        </select>
                        </div>
                        <br/>
                        <br/>
                        
                        <button 
                            className="start-quiz" 
                            onClick={handleStartLearning}
                            disabled={selectedLimit <= 0 || isLoadingCounts}
                            >
                                Start 
                        </button>
                    </>
                )}

            </div>
            </div>
            
            <div className='image-main1'>
                <img src={image_main} alt="Flashcard learning illustration"/>
            </div>
            </div>
        </div>
    )
}