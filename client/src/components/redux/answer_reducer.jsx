import {createSlice} from '@reduxjs/toolkit'

export const answerReducer = createSlice({
    name: 'answer',
    initialState:{
        userId: null,
        answer: [], 
        startTime: null,
        completionTime: null,
        detailResult: [],
        endTime: null,
        summary: {}
    },
    reducers: {
        setUserId: (state,action)=>{
            state.userId= action.payload 
        },
        pushAnswerAction: (state, action)=>{
            state.answer.push(action.payload)
        },
        updateAnswerAction: (state, action)=>{
            const{trace, checked} = action.payload;
            while(state.answer.length1<=trace){
                state.answer.push(null);
            }
            state.answer[trace]=checked;
        },
        setStartTime: (state, action)=>{
            state.startTime = action.payload;
        },
        resetAnswerAction: ()=>{
            return{
                userId: null,
                answer: [],
                startTime: null,
                completionTime: null, 
                detailResult: [],
                endTime: null
            }
        },
        pushResultAction: (state, action)=>{
            state.summary = action.payload.summary;
            state.detailResult = action.payload.details;
            state.endTime = action.payload.endTime;
            state.completionTime = action.payload.completionTime;
        }

    }
})
export const{setUserId, pushAnswerAction, updateAnswerAction, resetAnswerAction,pushResultAction,setStartTime}= answerReducer.actions;
export default answerReducer.reducer;
