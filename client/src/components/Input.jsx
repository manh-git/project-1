//import {useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUser} from "@fortawesome/free-solid-svg-icons"

const TextInput =({
    icon= null,
    type="text",
    id="",
    placeholder="",
    value,
    onChange,
    autoComplete="on"
}
) =>{
  
    if(icon === null && type ==="text"){
        icon =<FontAwesomeIcon icon={faUser}/>
    }
    return(
        <div className="input-block">
            <div className="input-row">
                {icon}
                <input
                  type ='text'
                  id={id}
                  value={value}
                  onChange={onChange}
                  placeholder={placeholder}
                  autoComplete={autoComplete}></input>
            </div>
        </div>
    )

}
export default TextInput