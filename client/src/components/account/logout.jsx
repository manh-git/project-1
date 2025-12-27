import { useDispatch } from "react-redux";
import { useNavigate} from 'react-router-dom';
import { logoutUser } from "../redux/auth_reducer";

const Logout = ()=> {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout=()=>{
        dispatch(logoutUser);
        navigate('/');
    };

}
export default Logout;