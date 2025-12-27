
import React from 'react';
import { Link } from 'react-router-dom';
import './styles/footer.css'

export default function Footer() {
    return (
        <footer className="app-footer">
            <div className="footer-content">
                <div className="footer-section brand">
                    <h3>QuizVocab</h3>
                    <p>&copy; {new Date().getFullYear()} QuizVocab. All rights reserved.</p>
                </div>
                
                
                
                <div className="footer-section legal">
                    <h4>Contact Us</h4>
                    <ul>
                        <li>Đại học Bách khoa Hà Nội
Số 1 Đại Cồ Việt - Hai Bà Trưng - Hà Nội</li>
                    </ul>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>Designed for learning vocabulary.</p>
            </div>
        </footer>
    );
}