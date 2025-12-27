import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import TextInput from "../Input";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../redux/auth_reducer";
import {FaHome} from 'react-icons/fa'
const Forgot =()=>{
    const dispatch = useDispatch();
    const [inputs,setInputs]=useState({email:""});
    const[errorMessage,setErrorMessage]=useState("");
    const[status,setStatus] = useState("idle");
    const [error,setError] = useState(null);
    const handleSubmit =(e) =>{
        e.preventDefault();
        dispatch(forgotPassword(inputs.email,setStatus,setError));

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
    return (
        <div className="login">
            <header className='fl-header'>
                    <Link className="return" to="/">
                    <FaHome size={20} style={{ marginRight: '8px' }} />
                        <span>Home</span>
                    </Link>
                    
            </header>
            <div className="login1">
            <h1>Reset password.</h1>
            <p>Please enter the email address you signed up with.</p>
            <form onSubmit={handleSubmit}>
                <TextInput
                labelText="Email"
                id="form2"
                name="email"
                placeholder="Your Email"
                value={inputs.email}
                onChange={handleChange}
                icon={<FontAwesomeIcon icon={faEnvelope} />}
                />
                <button
                    className="btn-primary"
                    disabled={ inputs.email === ""}
                    >
                        Reset Password

                </button>
            </form>
            {errorMessage !=="" && <p className="err-mes">{errorMessage}</p>}
        
            <Link to="/login"> 
            <h2>Login</h2>
            </Link>
        </div>
        </div>
    )
}
export default Forgot;