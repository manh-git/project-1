import { createSlice} from '@reduxjs/toolkit'

const loadAnswerStart = ()=>{
    try {
        const seriallizedState = localStorage.getItem('quizAnswerData');
        if(seriallizedState === null){
            return {};
        }
        return JSON.parse(seriallizedState);
    } catch(e){
        console.warn("Could not load state from localStorage", e);
        return {};
    }
}
const saveAnswerStart = (state)=>{
    try{
        const { answer, startTime, completionTime, detailResult, endTime, summary } = state;
        const stateToPersist = { answer, startTime, completionTime, detailResult, endTime, summary };
        const seriallizedState = JSON.stringify(stateToPersist);
        localStorage.setItem('quizAnswerData',seriallizedState);
    }
    catch(e){
        console.warn("Could not save state to localStorage",e);
    }

}
const defaultInitialState = {
    userId: localStorage.getItem('userId')||null,
    answer: [],
    startTime: null,
    completionTime: null,
    detailResult: [],
    endTime: null,
    summary: {}
};
const persistedState = loadAnswerStart();
export const answerReducer = createSlice({
    name: 'answer',
    initialState:{
        ...defaultInitialState,
        ...persistedState
    },
    reducers: {
        setUserId: (state,action)=>{
            state.userId= action.payload;
            if(action.payload){
            localStorage.setItem('userId',action.payload); 
        }
             else{
                localStorage.removeItem('userId');
             }
            
            },
        pushAnswerAction: (state, action)=>{
            state.answer.push(action.payload);
            saveAnswerStart(state);
        },
        updateAnswerAction: (state, action)=>{
            const{trace, checked} = action.payload;
            while(state.answer.length<=trace){
                state.answer.push(null);
            }
            state.answer[trace]=checked;
            saveAnswerStart(state);
        },
        setStartTime: (state, action)=>{
            state.startTime = action.payload;
            saveAnswerStart(state);
        },
        resetAnswerAction: (state)=>{
            state.answer=[];
            state.startTime=null;
            state.completionTime=null; 
            state.detailResult=[];
            state.summary={};
            state.endTime=null;
            localStorage.removeItem('quizAnswerData');
        },
        logoutAction:(state)=>{
            state.userId= null;
            localStorage.removeItem('userId');

        
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
            saveAnswerStart(state);
        }

    }
})
export const{setUserId,
        pushAnswerAction,
        updateAnswerAction,
        resetAnswerAction,
        pushResultAction,
        setStartTime,
    logoutAction}= answerReducer.actions;
export default answerReducer.reducer;

