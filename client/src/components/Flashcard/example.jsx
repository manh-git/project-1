import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import FlashCard from './Flashcard'; 

const CARDS_DATA = [
    { id: 1, frontText: "Advertisement (n)", backText: "A notice or announcement that promotes a product, service, or event." },
    { id: 2, frontText: "Advertise (v)", backText: "To promote or make something known to the public through advertising." },
    { id: 3, frontText: "Analysis (n)", backText: "The examination and evaluation of data or information for insights." },
    
];

const FlashCardExample = () => {
    const navigate = useNavigate();
    
  
    const [isFlipped, setIsFlipped] = useState(false);


    const [currentCardIndex, setCurrentCardIndex] = useState(0);


    const totalCards = CARDS_DATA.length;
    
    const currentCard = CARDS_DATA[currentCardIndex];



    const handlePrev = () => {
        setIsFlipped(false);
        if (currentCardIndex > 0) {
            setCurrentCardIndex(prevIndex => prevIndex - 1);
        }
    };


    const handleNext = () => {
        setIsFlipped(false); 
        if (currentCardIndex < totalCards - 1) {
            setCurrentCardIndex(prevIndex => prevIndex + 1);
        }
    };
    
 
    const handleClose = () => {
        console.log("Đóng và quay về trang chính.");
        navigate('/'); 
    };
    
    if (!currentCard) {
        return <div>Không có thẻ nào để hiển thị.</div>;
    }

    return (
        <FlashCard
            
            frontTitle="Topic"
            backTitle="Topic"
            frontText={currentCard.frontText}
            backText={currentCard.backText}   
            
      
            isFlipped={isFlipped}
            setIsFlipped={setIsFlipped}

            onClick={handleClose} 

            onPrev={handlePrev}
            onNext={handleNext}
            currentCartIndex={currentCardIndex} // Truyền chỉ mục hiện tại (0, 1, 2...)
            totalCards={totalCards}             // Truyền tổng số thẻ (3)
        />
    );
};

export default FlashCardExample;