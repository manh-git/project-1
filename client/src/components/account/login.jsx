import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import TextInput from "../Input";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/auth_reducer";

import AppHeader from "../Header";
const Login=()=>{
    const dispatch=useDispatch();
    const [errorMessage, setErrorMessage] = useState("");
    const [inputs, setInputs] = useState({ email: "", password: "" });
    const [status, setStatus ]= useState("idle");
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(inputs.email, inputs.password,setStatus,setError));
    }
    const handleChange = (e)=> {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
        if (error) {
            setStatus("idle");
            setError(null);
        }
    }
    useEffect(()=>{
    if(status==="success" ){
       
        navigate('/');
        
    }},[status,navigate])
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
            <h1>Log In</h1>
            <form onSubmit={handleSubmit} 
        >
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
        <h>No account?</h>
        <Link to="/signup">
        Sign up<br />
        </Link>
        <p>Forgot your credentials? <Link to="/forgotPassword"> Reset your password.</Link></p> 
        
        <button 
          className="btn-primary"
          disabled={ inputs.password === "" || inputs.email === ""}
        >
          {status === "loading" ? "Loading . . . " : status === "success" ? "Success!" : "Log In"}

        </button >
        </form>
        {errorMessage !=="" && <p className="err-mes">{errorMessage}</p>}
        </div>
        </div>
    )
}
export default Login