import { resetPassword } from "../redux/auth_reducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faLock } from "@fortawesome/free-solid-svg-icons";
import TextInput from "../Input";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Link,useNavigate,useParams} from "react-router-dom";
import AppHeader from "../Header";

const ResetPass = ()=>{
    const dispatch=useDispatch();
    const { token } = useParams();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [inputs, setInputs] = useState({ password: "", passwordConfirm: "" });
    const [status, setStatus ]= useState("idle");
    const [error, setError] = useState(null);
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(resetPassword(token,inputs.password,inputs.passwordConfirm,setStatus,setError));
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
    const handleChange = (e)=> {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
        if (error) {
            setStatus("idle");
            setError(null);
        }
    }
    return(
        <div className="login">
            <AppHeader/>
            <div className="login1">
            <h1>Reset Your Password!</h1>
            <form onSubmit={handleSubmit} >

                <TextInput 
                    labelText="Password"
                    id="form8"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={inputs.password}
                    onChange={handleChange}
                    icon={<FontAwesomeIcon icon={faLock} />}
                />
                <TextInput 
                    labelText="Password"
                    id="form9"
                    name="passwordConfirm"
                    type="password"
                    placeholder="Confirm Password"
                    value={inputs.passwordConfirm}
                    onChange={handleChange}
                    icon={<FontAwesomeIcon icon={faLock} />}
                />
                <button 
                    className="btn-primary1"
                    disabled={ inputs.passwordConfirm === "" ||inputs.password === "" }
                >
                {status === "loading" ? "Loading . . . " : status === "success" ? "Success!" : "Change Password"}

                </button >

            </form>
            {errorMessage !=="" && <p className="err-mes">{errorMessage}</p>}
        </div>
        </div>
    )

}
export default ResetPass;