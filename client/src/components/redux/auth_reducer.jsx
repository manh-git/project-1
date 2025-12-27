import axios from 'axios'
import {createAsyncThunk} from '@reduxjs/toolkit'
axios.defaults.withCredentials = true;

const AUTH_START = 'AUTH_START';
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const AUTH_FAIL = 'AUTH_FAIL';
const LOGOUT = 'LOGOUT';
const AUTH_VALIDATION_ERROR='AUTH_VALIDATION_ERROR';
const FETCH_USER_SESSION_FULFILLED = 'auth/fetchUserSession/fulfilled';
const FETCH_USER_SESSION_REJECTED = 'auth/fetchUserSession/rejected';
const FETCH_USER_SESSION_PENDING = 'auth/fetchUserSession/pending';
const FORGOT_PASSWORD_SUCCESS = 'FORGOT_PASSWORD_SUCCESS';
const API_URL ='http://localhost:3000/api/auth';

const initialState = {
    isAuthenticated: false,
    token:  null,
    user: null, 
    status: 'idle',  
    error: null,
    sessionChecked: false,
    
};
export const loginUser =(email, password, setLocalStatus, setLocalError)=> async(dispatch)=>{
    dispatch({type: AUTH_START});
    setLocalStatus("loading");
    setLocalError(null);

    try{
        const response = await axios.post(`${API_URL}/login`,{email, password});

        const userData={
            UserID: response.data.userId,
            UserName: response.data.username,
            Email: email,

        };
        dispatch({
            type: AUTH_SUCCESS,
            payload:{
                user: userData,
            },
        });
        setLocalStatus("success");
    }catch(err){
        const message= err.response?.data?.message || 'Login failed due to network or server error';
        dispatch({
            type: AUTH_FAIL,
            payload: message,
        });
        setLocalStatus("error");
        setLocalError({message});
    }
}
export const signupUser=(userName, email,password, setLocalStatus,setLocalError)=> async(dispatch)=>{
    dispatch({type: AUTH_START});
    setLocalStatus("loading");
    setLocalError(null);

    try{
        const response=await axios.post(`${API_URL}/signup`, {username: userName, email,password});

        const userData={
            UserID: response.data.userId,
            UserName: response.data.username,
            Email: email,
        };
        dispatch({
            type: AUTH_SUCCESS,
            payload: {
                user: userData,

            },
        });
        setLocalStatus("success");
    } catch(err){
        const message = err.response?.data?.message || 'Registration failed due to network or server error.';

        dispatch({
            type: AUTH_FAIL,
            payload: message,
        });
        setLocalStatus("error");
        setLocalError({ message });

    }
}

export const forgotPassword=(email,setLocalStatus,setLocalError)=> async(dispatch)=>{
    dispatch({type:AUTH_START});
    setLocalStatus("loading");
    setLocalError(null);
    try{
        const response = await axios.post(`${API_URL}/forgotPassword`, {email});
        setLocalStatus("success");
        setLocalError({message: response.data.message||'The password reset link has been sent.'})
        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload:{user: null}
        })
    }catch(err){
        const message = err.response?.data?.message|| 'Can not sent requies password reset.'
        dispatch({
            type: AUTH_FAIL,
            payload: message,
        })
        setLocalStatus("error");
        setLocalError({message});
    }
}

export const resetPassword = (token, password, passwordConfirm, setLocalStatus,setLocalError)=>async(dispatch)=>{
    dispatch({type: AUTH_START});
    setLocalStatus("loading");
    setLocalError(null);
    try{
        const response = await axios.patch(`${API_URL}/resetPassword/${token}`,{password,passwordConfirm});
        setLocalStatus("success");
        setLocalError({message: response.data.message || 'Password reset successfully.'})
        //dispatch({type: AUTH_SUCCESS});
    }catch(err){
        const message = err.response?.data?.message ||'Password reset failed. The token is invalid or has expired.';
        dispatch({
            type: AUTH_FAIL,
            payload: message
        })
        setLocalStatus("error");
        setLocalError({message});
    }
 
}

export const changePassword = (currentPassword,password, passwordConfirm,setLocalStatus,setLocalError)=>async(dispatch)=>{
    dispatch({type: AUTH_START});
    setLocalStatus("loading");
    setLocalError(null);
    try{
        const response = await axios.patch(`${API_URL}/updateMyPassword`, { currentPassword,password, passwordConfirm });
        setLocalStatus("success");
        setLocalError({message: response.data.message || 'Password reset successfully.'});
        
        dispatch({type: LOGOUT});
    
    }catch(err){
        const message = err.response?.data?.message ||'Password reset failed.';
        dispatch({
            type: AUTH_VALIDATION_ERROR,
            payload: message
        })
        setLocalStatus("error");
        setLocalError({message});
    }

}
export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case AUTH_START:
            return {
                ...state,
                status: 'loading',
                error: null,
            };
        
        case AUTH_FAIL:
            return {
                ...state,
                isAuthenticated: false,
                status: 'error',
                token: null,
                user: null,
                error: action.payload,
            };
        case LOGOUT:
            return {
                ...initialState, 
                token: null,
            };
        case FETCH_USER_SESSION_PENDING:
            return {
                ...state,
                status: 'loading',
                error: null,
            };

        case FETCH_USER_SESSION_FULFILLED:
            return {
                ...state,
                isAuthenticated: true, 
                status: 'success',
                sessionChecked: true,
                user: action.payload, 
                token: 'EXISTS', 
                error: null,
            };

        case FETCH_USER_SESSION_REJECTED:
            return {
                ...initialState,
                isAuthenticated: false, 
                status: 'error',
                sessionChecked: true,
                user: null,
                token: null,
                error: action.payload,
            };
        case AUTH_VALIDATION_ERROR:
            return{
                ...state,
                status: 'error',
                error: action.payload,
            };

        case AUTH_SUCCESS:
             return {
                ...state,
                isAuthenticated: true,
                status: 'success',
                token: action.payload.token || 'EXISTS', 
                user: action.payload.user, 
                error: null,
            };   
        case FORGOT_PASSWORD_SUCCESS:
             return {
                ...state,
                status: 'success',
                error: null,
            };
        default:
            return state;
    }
}

export const logoutUser= ()=>(dispatch)=>{
    axios.post(`${API_URL}/logout`).finally(()=>{
        dispatch({type: LOGOUT});
    })
    
};
export const fetchUserSession = createAsyncThunk(
    'auth/fetchUserSession',
    async(_,{ rejectWithValue}) =>{
        try{
            const API_BASE_URL = 'http://localhost:3000';
            const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                credentials: 'include',
                cache: 'no-store'
            });
            if(!response.ok){
                const errorStatus = response.status;
                throw new Error(`Session check failed:  ${errorStatus}.`);
            }
            const data = await response.json();
            return data.data; 
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)