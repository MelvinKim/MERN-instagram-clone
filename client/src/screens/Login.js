import React, {useState, useContext} from 'react';
import { Link } from "react-router-dom";
import{ UserContext } from '../App';
import M from "materialize-css";
import EmailValidator from "email-validator";


const Login = (props) => {
     
    const {state, dispatch} = useContext(UserContext)

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
      const postData = () => {
        if (!EmailValidator.validate(email)) {
          M.toast({
            html: "invalid email",
            classes: "#c62828 red darken-3",
          });
          return;
        }
        if (password.length <= 6) {
          M.toast({
            html: "Password must be a minimum of 6 characters",
            classes: "#c62828 red darken-3",
          });
          return;
        }
        fetch("/signin", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: password,
            email: email,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
              console.log(data)
            if (data.error) {
              M.toast({
                html: data.error,
                classes: "#c62828 red darken-3",
              });
            } else {
              localStorage.setItem('jwt', data.token);
              localStorage.setItem('user', JSON.stringify(data.user));
              dispatch({ type: 'USER', payload: data.user})
              M.toast({
                html: 'signed in successfully',
                classes: "#43a047 green darken-1",
              });
              props.history.push("/");
            }
          })
          .catch((err) => {
            console.log("err while signin  user",JSON.stringify(err,null,2));
          });
      };
    return (
        <div className='mycard'>
            <div className='card auth-card input-field'>
                <h2>Instagram</h2>
                <input type='text' placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input type='password' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <button onClick={() => postData()} className='btn waves-effect waves-light #64b5f6 blue darken-1' type='submit'>Login</button>
                <br />
                <small>
                    <Link to='/reset'>Forgot Password ??</Link>
                </small>
                <br />
                <small>
                    <Link to='/signup'>Don't have an Account??</Link>
                </small>
            </div>
        </div>
    )
}

export default Login
