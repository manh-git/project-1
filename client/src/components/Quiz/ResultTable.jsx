import React, { useEffect, useState } from "react";

const API_BASE_URL = 'http://localhost:3000';

export default function ResultTable({ topicId, topicName }) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showRanking, setShowRanking] = useState(false);

    useEffect(() => {
        if (!showRanking || !topicId) {
            setData([]);
            return;
        }

        const fetchRanking = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/api/quiz/ranking/${topicId}`);
                const result = await response.json();

                if (response.ok && result.status === 'success') {
                    setData(result.ranking || []);
                } else {
                    setError(result.message || 'Failed to fetch ranking.');
                    setData([]);
                }
            } catch (e) {
                console.error("Error fetching ranking:", e);
                setError("Network error or server connection failed.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRanking();

    }, [showRanking, topicId]);
    
    const toggleRanking = () => {
        setShowRanking(prev => !prev);
    };
    
    // Logic sắp xếp: Điểm cao nhất, sau đó thời gian nhanh nhất
    const sortedData = [...data].sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return a.completionTimeSeconds - b.completionTimeSeconds;
    });

    return (
        <div className="result-table-container">
            <div className="ranking-actions85">
                <button className="btn-detail" onClick={toggleRanking}>
                    {showRanking ? 'Hide Ranking' : 'View Ranking'}
                </button>
            </div>
            {isLoading && <p style={{ textAlign: 'center' }}>Loading ranking...</p>}
            {error && <p style={{ textAlign: 'center', color: 'red' }}>Error: {error}</p>}
            {showRanking && !isLoading && !error && (
                <React.Fragment>
                    <table className='history-table'>
                        <thead className='table-header'>
                            <tr className="table-row">
                                <th>Rank </th>
                                <th>UserName</th>
                                <th>Score</th>
                                <th>Time</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.length > 0 ? (
                                sortedData.map((item, index) => (
                                    <tr key={index}>
                                        <td className={`rank-cell rank-${index + 1}`}>
                                            {index + 1}
                                        </td>
                                        <td>{item.UserName || item.username || 'N/A'}</td>
                                        <td>{item.points}</td>
                                        <td>{item.time}</td>
                                        <td>{item.endTime}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No ranking data available for this topic.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </React.Fragment>)}
        </div>
    )
}