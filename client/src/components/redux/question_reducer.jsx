import {createSlice} from '@reduxjs/toolkit'

const loadQuestionStart = ()=>{
    try{
        const seriallizedState = localStorage.getItem('quizQuestionData');
        if(seriallizedState === null){
            return {};
        }
        return JSON.parse(seriallizedState);
    } catch(e){
        
        console.warn("Could not load question state from localStorage", e);
        return {};
    }
    
}
const saveQuestionStart = (state)=>{
    try{
        const { questions, trace, quizId, topicName,currentTopicId } = state; 
        const stateToPersist = { questions, trace, quizId, topicName,currentTopicId }; 
        const seriallizedState = JSON.stringify(stateToPersist);
        localStorage.setItem('quizQuestionData', seriallizedState);
    }
    catch(e){
        console.warn("Could not save question state to localStorage",e);
    }

}
const defaultQuestionState = {
    questions: [],
    answers: [],
    trace: 0,
    quizId: null,
    topicName: null,
    currentTopicId: null,
    isLoading: false,
    error: null
};
const persistedQuestionState = loadQuestionStart();
export const questionReducer = createSlice({
    name: 'questions',
    initialState:{
        ...defaultQuestionState,
        ...persistedQuestionState
    },
    reducers: {
        setQuizData :(state, action)=>{
            const {questions, quizId, topicName,currentTopicId} = action.payload
            const newState = {
                ...state,
                questions: questions,
                quizId: quizId,
                topicName: topicName,
                currentTopicId: currentTopicId,
                trace: 0,
                isLoading: false,
                error: null
            }
            saveQuestionStart(newState);
            return newState;
        },
        moveNextAction:(state,action)=>{
            if(action.payload != undefined && typeof action.payload ==='number'){
                state.trace = action.payload;
            }
            else{
                state.trace+=1;
            }
            saveQuestionStart(state);
        },
        movePreAction:(state)=>{
            if(state.trace>0){
                state.trace-=1;
            }
            saveQuestionStart(state);
        },
        resetAllAction: ()=>{
            localStorage.removeItem('quizQuestionData');
            return {
                questions:[],
                answers:[],
                trace:0,
                quizId: null,
                topicName: null,
                isLoading: false,
                currentTopicId: null,
                error: null
            }
        },
        setLoading: (state, action)=>{
            state.isLoading = action.payload;
            state.error = null;
        },
        setError: (state, action) =>{
            state.error = action.payload;
            state.isLoading = false;
        }
    }

})

export const {setQuizData, moveNextAction, movePreAction,resetAllAction,setError,setLoading } = questionReducer.actions;
export default questionReducer.reducer;
// quản lý trạng thái câu hỏi quay về câu trước đến câu tiếp, xóa hết đáp án làm lại,bắt đầu làm
