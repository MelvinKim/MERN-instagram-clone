import React, { useState, useContext } from 'react';
import { Link, useParams } from "react-router-dom";
import M from "materialize-css";


const NewPassword = (props) => {

    const [password, setPassword] = useState("");
    const {token} = useParams();
    console.log(token)
    const postData = () => {
        
        if (password.length <= 6) {
            M.toast({
                html: "Password must be a minimum of 6 characters",
                classes: "#c62828 red darken-3",
            });
            return;
        }
        fetch("/new-password", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password: password,
                token:token
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
                    M.toast({
                        html: data.message,
                        classes: "#43a047 green darken-1",
                    });
                    props.history.push("/login");
                }
            })
            .catch((err) => {
                console.log("err while signin  user", JSON.stringify(err, null, 2));
            });
    };
    return (
        <div className='mycard'>
            <div className='card auth-card input-field'>
                <h2>Instagram</h2>
                <input type='password' placeholder='Enter new password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <button onClick={() => postData()} className='btn waves-effect waves-light #64b5f6 blue darken-1' type='submit'>Update Password</button>
            </div>
        </div>
    )
}

export default NewPassword
