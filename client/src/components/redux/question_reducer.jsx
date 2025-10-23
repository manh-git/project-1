import {createSlice} from '@reduxjs/toolkit'

export const questionReducer = createSlice({
    name: 'questions',
    initialState:{
        queue: [],
        answers: [],
        trace: 0  //vị trí câu hỏi hiện tại
    },
    reducers: {
        startExamAction :(state, action)=>{
            let {question, answers} = action.payload
            return {
                ...state,
                queue: question,
                answers
            }
        },
        moveNextAction:(state,action)=>{
            if(action.payload != undefined && typeof action.payload ==='number'){
                state.trace = action.payload;
            }
            else{
                state.trace+=1;
            }
        },
        movePreAction:(state)=>{
            if(state.trace>0){
                state.trace-=1;
            }
        },
        resetAllAction: ()=>{
            return {
                queue:[],
                answers:[],
                trace:0
            }
        }
    }

})

export const {startExamAction, moveNextAction, movePreAction,resetAllAction  } = questionReducer.actions;
export default questionReducer.reducer;
// quản lý trạng thái câu hỏi quay về câu trước đến câu tiếp, xóa hết đáp án làm lại,bắt đầu làm
