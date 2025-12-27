import React, { useCallback, useEffect, useState } from 'react';
import FlashCard from './Flashcard';
import { useParams, useLocation } from 'react-router-dom';
import keep from '/src/assets/keep.png'
import good from '/src/assets/good.png'
const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

export const StatsIcons = ({ stats, wiggleTrigger }) => {
    return (
        <div className="learn-process">
            <div className={`un`} >
                <span className='learn' key={`u-${wiggleTrigger.unknown}`} data-trigger={wiggleTrigger.unknown}>{stats.unknown}</span>
                <p>UnKnown</p>
            </div>
            <div className={`known`} >
                <p>Known</p>
                <span className='master' key={`k-${wiggleTrigger.known}`} data-trigger={wiggleTrigger.known}>{stats.known}</span>
            </div>
        </div>
    );
};

export default function FlashCardData(){
    const {topicId}= useParams();
    const query = useQuery();
    const modeStatus = query.get('status') || 'all';
    const limit = query.get('limit') || 20;
    const [vocabs, setVocabs]=useState([]);
    const [topicName, setTopicName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentCartIndex, setCurrrentCartIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    
    const [learningCount, setLearningCount] = useState(0);
    const [masteredCount, setMasteredCount] = useState(0);

    const [isAnimating, setIsAnimating] = useState(false);
    const [outAnimationClass, setOutAnimationClass] = useState(null);
    const [currentOutIndex, setCurrentOutIndex] = useState(null);
    const [wiggleTrigger, setWiggleTrigger] = useState({ known: 0, unknown: 0 });
    const [isUnknownAction, setIsUnknownAction] = useState(false);
    const [feedback, setFeedback] = useState(null);

    useEffect(()=>{
        const fetchVocab = async ()=>{
            setLoading(true);
            setError(null);
            try{
                const response = await fetch(`http://localhost:3000/api/topics/${topicId}?status=${modeStatus}&limit=${limit}`,{
                    cache: 'no-cache',
                    credentials: 'include',
                });
                const data = await response.json();
                if(response.ok && data.status === 'success'){
                    setVocabs(data.data);
                    setTopicName(data.topic);
                    setLearningCount(data.counts.learning || 0);
                    setMasteredCount(data.counts.mastered || 0);
                } else {
                    setError(data.message || 'Failed to load vocab.')
                }
            }catch(err){
                setError('Network error or sever connection failed.',err);
            } finally{
                setLoading(false);
                setCurrrentCartIndex(0);
                setIsFlipped(false);
            }
        }
        if(topicId){
            fetchVocab();
        }
    },[topicId]);
    
    const total = vocabs.length;

    const handleNextCardAnimation = useCallback((direction, feedbackMsg) => {
        if (isAnimating) return;

        const transitionDuration = 1200;
        const nextIndex = (currentCartIndex + 1) % total;
        
        if (currentCartIndex >= total - 1) {
            alert("Congratulations! You have finished this session.");
            return;
        }

        const isUnknown = direction === 'unknown';
        
        setIsAnimating(true);
        setCurrentOutIndex(currentCartIndex);
        
        if (isUnknown) {
            setOutAnimationClass('is-unknown-out');
            setIsUnknownAction(true);
        } else {
            setOutAnimationClass('is-known-out');
            setIsUnknownAction(false);
        }

        setFeedback({ message: feedbackMsg, type: direction });
        
        setCurrrentCartIndex(nextIndex); 
        
        setTimeout(() => {
            setIsFlipped(false);
            setOutAnimationClass(null);
            setCurrentOutIndex(null);
            setIsAnimating(false);
            setIsUnknownAction(false);
            setFeedback(null);
        }, transitionDuration);

    }, [currentCartIndex, total, isAnimating]);
    
    const updateVocabStatus = async (vocabId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:3000/api/vocab/status/${vocabId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }), 
                credentials: 'include'
            });
            return response.ok;
        } catch (error) {
            console.error("API call failed:", error);
            return false;
        }
    };

    const handleMark = async (newStatus) => {
        const currentVocab = vocabs[currentCartIndex];
        if (!currentVocab) return;
        
        const direction = newStatus.toLowerCase() === 'mastered' ? 'known' : 'unknown';
        const feedbackMsg = direction ;
        
        const oldStatus = (currentVocab.Status || 'new').toLowerCase();
        const normalizedNewStatus = newStatus.toLowerCase();

        if (oldStatus !== normalizedNewStatus) {
            const success = await updateVocabStatus(currentVocab.VocabId, normalizedNewStatus);
            if (success) {
                setVocabs(prevVocabs => {
                    const newVocabs = [...prevVocabs];
                    if (newVocabs[currentCartIndex]) {
                        newVocabs[currentCartIndex] = { ...newVocabs[currentCartIndex], Status: normalizedNewStatus };
                    }
                    return newVocabs;
                });
                
                if (oldStatus === 'learning') setLearningCount(p => Math.max(0, p - 1));
                else if (oldStatus === 'mastered') setMasteredCount(p => Math.max(0, p - 1));

                if (normalizedNewStatus === 'learning') { 
                    setLearningCount(p => p + 1);
                    setWiggleTrigger(p => ({ ...p, unknown: p.unknown + 1 })); 
                } else if (normalizedNewStatus === 'mastered') { 
                    setMasteredCount(p => p + 1);
                    setWiggleTrigger(p => ({ ...p, known: p.known + 1 })); 
                }
            } else { return; }
        }
        handleNextCardAnimation(direction, feedbackMsg);
    };
    
    const onMarkUnknown = () => handleMark('learning');
    const onMarkKnown = () => handleMark('mastered');

    if(loading) return <div>Loading</div>
    if(error) return <div>{error}</div>
    if(vocabs.length===0) return <div>No Vocab.</div>
    
    const renderSingleCard = (vocab, index) => {
        let isOutCard = index === currentOutIndex && isAnimating;
        let isCurrentCard = index === currentCartIndex; // Thẻ mới khi animation
        let animClass = 'is-hidden';
        
        if (isOutCard) {
            animClass = outAnimationClass;
        } else if (isCurrentCard) {
            animClass = isAnimating ? 'is-entering-known' : 'is-current';
        }

        let shouldBeFlipped = isFlipped;
        if (isUnknownAction && isOutCard) {
            shouldBeFlipped = true; 
        } else if (isOutCard && !isUnknownAction) {
             shouldBeFlipped = false; 
        }
        
        const showButtons = !isAnimating || (index === currentCartIndex && !isOutCard);

        let frontContent; 
        let wordContent = vocab.Word.replace(/\s*(\([^)]+\))/g, '<br/>$1');
        if(topicId === '101' || topicId ==='103'||topicId==='104'){
            frontContent = wordContent + '<br/>'+ vocab.Pronunciation;
        }
        else frontContent= wordContent +'<br/>/' + vocab.Pronunciation+'/';
        
        return (
            <FlashCard
                key={vocab.VocabId}
                topicName = {topicName}
                frontText={frontContent}
                backText={vocab.Mean_A +'<br/>e.g. '+vocab.ExampleSentence}
                isFlipped={shouldBeFlipped}
                setIsFlipped={setIsFlipped}
                onMarkKnown={showButtons ? onMarkKnown : null}
                onMarkUnknown={showButtons ? onMarkUnknown : null}
                learningCount={learningCount}
                masteredCount={masteredCount}
                currentCartIndex={index}
                totalCards={total}
                wiggleTrigger={wiggleTrigger}
                animationClass={animClass}
            />
        );
    };

    const currentVocab = vocabs[currentCartIndex];
    const outVocab = currentOutIndex !== null ? vocabs[currentOutIndex] : null;

    return(
        <div className="flashcard-wrapper">
            
            <div className="flashcard-container">
                {isAnimating && currentVocab && (
                    renderSingleCard(currentVocab, currentCartIndex)
                )}

                {outVocab && (
                    renderSingleCard(outVocab, currentOutIndex)
                )}

                {!isAnimating && currentVocab && (
                    renderSingleCard(currentVocab, currentCartIndex)
                )}
            </div>

            {feedback && (
                <div className={`feedback-overlay is-visible ${feedback.type}`}>
                    {feedback.type === 'unknown' ? (
                        <img src={keep} className="feedback-image" />
                    ) : (<img src={good}  className="feedback-image" />
            )}
            </div>)}
        </div>
    )
}