import { useState, useContext, useEffect } from "react";
import {Link, useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import{faEnvelope, faUser, faLock} from "@fortawesome/free-solid-svg-icons"
import "../styles/up.css"
import TextInput from "../Input";
import { useDispatch } from "react-redux";
import { signupUser } from "../redux/auth_reducer";
import AppHeader from "../Header";
const Signup = () => {
    const dispatch=useDispatch();
    const [errorMessage, setErrorMessage] = useState("");
    const [inputs, setInputs] = useState({userName: "",email: "", password: ""});
    const [status, setStatus] = useState("idle");
    const[error, setError] = useState(null);
    const navigate=useNavigate();


    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(signupUser(inputs.userName,inputs.email,inputs.password,setStatus,setError));
    }
    useEffect(()=>{
        if(error=== null) return;
        console.log(error.message);
    },[error])
    const handleChange = e => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
  }
    useEffect(()=>{
        if(status==="success" ){
            navigate('/');

        }
    },[status,navigate]);
    useEffect(()=>{
        if(error === null){
            setErrorMessage("");
            return;
        }
        if(error.message){
            setErrorMessage(error.message);
            return;
        }
        setErrorMessage("An unknown error occurred. Please check your connection. ")

    },[error]);
   return(
    <div className="login">
        <AppHeader/>
    <div className="login1">
        <h1>Welcome! Create an account.</h1>
        <form onSubmit={handleSubmit} 
        >
        <TextInput 
          labelText="UserName"
          id="form1"
          name="userName"
          placeholder="Your Name"
          value={inputs.userName}
          onChange={handleChange}
          icon={<FontAwesomeIcon icon={faUser} />}
        />
        <TextInput 
          labelText="Email"
          id="form2"
          name="email"
          placeholder="Your Email"
          value={inputs.email}
          onChange={handleChange}
          icon={<FontAwesomeIcon icon={faEnvelope} />}
        />
        <TextInput 
          labelText="Password"
          id="form3"
          name="password"
          type="password"
          placeholder="Password"
          value={inputs.password}
          onChange={handleChange}
          icon={<FontAwesomeIcon icon={faLock} />}
        />
        <button 
          className="btn-primary"
          disabled={ inputs.password === "" || inputs.email === ""|| inputs.userName===""}
        >
          {status === "loading" ? "Loading . . . " : status === "success" ? "Success!" : "Sign Up"}

        </button >
        </form>
        {errorMessage!==""&&<p className="err-mes">{errorMessage}</p>}
        
         <p>Already have an account? <Link to="/login">Log in</Link>.</p></div>
    </div>
    
   )
    
    
}
export default Signup;