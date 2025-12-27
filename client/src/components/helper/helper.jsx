//import {useSelector} from "react-redux"


export function attempts_Number(result){
    return result.filter( r=>r !== undefined).length;
    
}
// tính sô câu trả lời rồi của mỗi người chơi
export function earnPoints_Number(result, answers, point){
    return result
          .map((element,i) => answers[i] === element)
          .filter(i=>i)
          .map(i => point)
          .reduce((prev,curr) => prev + curr,0)
}
// tính tổng điểm các câu trả lời đúng
export function flagResult(totalPoints, earnPoints){
    return totalPoints == earnPoints;
}
// hàm xem đúng hết không


