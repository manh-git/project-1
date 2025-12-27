import {FontAwesomeIcon} from '@fortawesome/react-fortawesome'
import {faSpinner} from '@fortawesome/free-solid-svg-icons'
const Spinner =({
    size ="1x"
}) =>{
    return <FontAwesomeIcon icon ={faSpinner} size = {size}
    classname="spinner"/>
}
export default Spinner

//tạo logo quay khi đợi load trang