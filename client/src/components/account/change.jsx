import { changePassword } from "../redux/auth_reducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faLock } from "@fortawesome/free-solid-svg-icons";
import TextInput from "../Input";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Link,useNavigate} from "react-router-dom";
import AppHeader from "../Header";
const ChangePass = () => {
    const dispatch=useDispatch();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [inputs, setInputs] = useState({ currentPassword: "", password: "",passwordConfirm: "" });
    const [status, setStatus ]= useState("idle");
    const [error, setError] = useState(null);
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(changePassword(inputs.currentPassword, inputs.password,inputs.passwordConfirm,setStatus,setError));
    }
    useEffect(()=>{
    if(status==="success" ){
       
        navigate('/login');
        
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
            <h1>Change Your Password!</h1>
            <form onSubmit={handleSubmit} >
                <TextInput 
                    labelText="Password"
                    id="form12"
                    name="currentPassword"
                    type="password"
                    placeholder="Current Password"
                    value={inputs.currentPassword}
                    onChange={handleChange}
                    icon={<FontAwesomeIcon icon={faLock} />}
                />
                <TextInput 
                    labelText="Password"
                    id="form11"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={inputs.password}
                    onChange={handleChange}
                    icon={<FontAwesomeIcon icon={faLock} />}
                />
                <TextInput 
                    labelText="Password"
                    id="form10"
                    name="passwordConfirm"
                    type="password"
                    placeholder="Confirm Password"
                    value={inputs.passwordConfirm}
                    onChange={handleChange}
                    icon={<FontAwesomeIcon icon={faLock} />}
                />
                <button 
                    className="btn-primary"
                    disabled={ inputs.passwordConfirm === "" ||inputs.password === "" || inputs.currentPassword === ""}
                >
                {status === "loading" ? "Loading . . . " : status === "success" ? "Success!" : "Change Password"}

                </button >

            </form>
            {errorMessage !=="" && <p className="err-mes">{errorMessage}</p>}
        </div>
        </div>
    )
};  
export default ChangePass;