import React, { useState, useContext } from 'react';
import M from "materialize-css";
import EmailValidator from "email-validator";


const Reset = (props) => {


    const [email, setEmail] = useState("");
    const postData = () => {
        if (!EmailValidator.validate(email)) {
            M.toast({
                html: "invalid email",
                classes: "#c62828 red darken-3",
            });
            return;
        }
        
        fetch("/reset-password", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    M.toast({
                        html: data.error,
                        classes: "#c62828 red darken-3",
                    });
                } else {
                    M.toast({
                        html:data.message,
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
                <input type='text' placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <button onClick={() => postData()} className='btn waves-effect waves-light #64b5f6 blue darken-1' type='submit'>Reset password</button>
            </div>
        </div>
    )
}

export default Reset
