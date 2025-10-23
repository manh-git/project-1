import React ,{ useEffect,useState } from "react"

const MOCK_RESULT_DATA = [
    { username: 'Anh Minh', attempts: 10, points: 80, time: '05:30', endTime:'11:30:15' },
    { username: 'Chi Mai', attempts: 5, points: 45, time: '07:15' , endTime: '11:10:10'},
    { username: 'Bảo Khanh', attempts: 12, points: 95, time: '04:01' , endTime: '11:15:10'},
    { username: 'Lê Dũng', attempts: 3, points: 60, time: '06:00', endTime: '11:12:10' },
]; 

export default function ResultTable(){
    const [data, setData] = useState([]);
    useEffect(()=>{
        setData(MOCK_RESULT_DATA);
    },[]
    );
    const [showRanking, setShowRanking ]=useState(false);
    const toggleRanking = ()=>{
        setShowRanking(prev=>!prev);
    };
    
    return (
        <div className="result-table">
            <div className="result-table">

                <button className="btn-detail" onClick={toggleRanking}>
                    {showRanking ? 'Hide Ranking' : 'View Ranking'}

                </button>
            </div>
            {showRanking && (
                <React.Fragment>
                <table className='history-table'>
                <thead className='table-header'>
                    <tr className="table-row">
                        <th># </th>
                        <th>UserName</th>
                        <th>Attempts</th>
                        <th>Points</th>
                        <th>Time</th>
                        <th>End-Time</th>
                    </tr>
                </thead>
                <tbody>
                    {(data.length ===0)&& (
                        <tr>
                            <td colSpan="6" className="no-data">No data</td>
                        </tr>
                    )}
                    {data.map((v,i)=>(
                        <tr className="table-body" key={i}>
                            <td>{i+1}</td>
                            <td>{v?.username}</td>
                            <td>{v?.attempts}</td>
                            <td>{v?.points}</td>
                            <td>{v?.time}</td>
                            <td>{v?.endTime}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </React.Fragment>)}
        </div>
    )
}
