import React from 'react';
import { FaStar, FaBook, FaCloud, FaGraduationCap,FaLightbulb } from 'react-icons/fa';

const Decorations = React.memo(() => {
    return (
        <div className="decorations-container">
            <FaStar className="floating-icon icon-1 star" />
            <FaBook className="floating-icon icon-2 star" />
            <FaStar className="floating-icon icon-4 star" />
            <FaBook className="floating-icon icon-6 star" />
            <FaCloud className="floating-icon icon-7 star" />
            <FaLightbulb className="floating-icon icon-13 star" />
            <FaGraduationCap className="floating-icon icon-8 star" />
        </div>
    );
});

export default Decorations;