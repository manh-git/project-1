import {combineReducers} from '@reduxjs/toolkit'
// kết hợp nhiều reducer thành 1

import {configureStore} from '@reduxjs/toolkit'
import questionReducer from './question_reducer'
import answerReducer  from './answer_reducer'
import authReducer from './auth_reducer'

const rootReducer = combineReducers({
    questions: questionReducer,
    answer: answerReducer,
    auth: authReducer,
})

export default configureStore({ reducer : rootReducer});
//tạo redux store