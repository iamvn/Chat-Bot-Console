import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {useChatAppStore} from "../main/main";
function Login() {
//Change base url here : 
const baseURL = "https://example.com/api/v1";
const navigate = useNavigate();
 const setUserDetails = useChatAppStore(state => state.setUserDetails);
const loginAPI = (user, pass) => {
        let datadsd = {
          username: user,
          password: pass
        }
          axios({
            method: 'POST',
            url: `${baseURL}/login`,
            data: JSON.stringify(datadsd),
            headers: {
              'Content-Type': 'application/json'
            }
          }).then((response)=>{
              console.log(response);
              if(response.status == 200)
              {
                window.alert("Logged in successfully");
                setUserDetails(response.data.data);
                const {authToken, userId} = response.data.data;
                navigate('/home', {state:{userId:userId,authToken:authToken}});
              }
          }).catch((error)=>{
            console.log(error);
            window.alert(error?.response?.data?.message || "Something went wrong");
          });
}

const callLogin = (e) => {
e.preventDefault();
console.log(e);
let username = e.target[0].value;
let password = e.target[1].value;
loginAPI(username, password);
}
  return (
    <div>
      <form onSubmit={(e)=>{callLogin(e)}} style={{display: 'flex', gap: '6px', width: '450px', 
        alignItems: 'center', margin: "19% auto"}}>
        <input style={{width: "95%", padding: "10px", background: "white",
         borderRadius: "5px", border: "none"}} type='text' placeholder='Enter user username'/>
        <input style={{width: "95%", padding: "10px", background: "white",
        borderRadius: "5px", border: "none", color: "black"}} type='password' placeholder='Enter password'/>
            <button style={{padding: "10px 25px", background: "green", border: "none", borderRadius: "4px", cursor: "pointer"}} 
            type='submit'>{'Login'}</button>
      </form>
    </div>
  )
}

export default Login