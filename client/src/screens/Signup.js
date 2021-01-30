import React, {useState} from 'react';
import { Link } from "react-router-dom";
import M from 'materialize-css';
import EmailValidator from 'email-validator';
const Signup = (props) => {
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');

  //send our post data 
  const postData = () => {
    if(image){
      uploadPic()
    }
    
    if( !EmailValidator.validate(email)){
        M.toast({ html: "invalid email", classes: "#c62828 red darken-3" });
        return
    } if(name.length < 3){
       M.toast({ html: "Name must be a minimum of 3 characters", classes: "#c62828 red darken-3" });
       return;
    } if(password.length <= 6){
       M.toast({ html: "Password must be a minimum of 6 characters", classes: "#c62828 red darken-3" });
       return;
    }
    fetch('/signup', {
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        password: password,
        email: email
      })
    }).then(res => res.json())
    .then(data => {
      if(data.error){
        M.toast({html: data.error, classes: '#c62828 red darken-3'})
      } else {
        M.toast({ html: data.message, classes: '#43a047 green darken-1'});
        props.history.push('/login')
      }
    })
    .catch(err => {
      console.log('err while saving user', err);
      
    })
  }

  //upload profile pic 
  const uploadPic = () => {
    const data = new FormData();
    data.append("file", image);
    //cloudinary
    data.append('upload_preset', 'insta-clone');
    data.append("cloud_name", 'dyjp6vejk');
    fetch('https://api.cloudinary.com/v1_1/dyjp6vejk/image/upload', {
      method: 'post',
      body: data
    }).then(res => res.json())
      .then(data => {
        console.log(data)
        setUrl(data.url)
      })
      .catch(err => {
        console.log("No internet connection" + err);
      })
  }

    return <div className="mycard">
        <div className="card auth-card input-field">
          <h2>Instagram</h2>
          <input
          type="text"
          name='name'
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
              />

          <input
           type="text"
          name='email'
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
           />

          <input
          type="password"
          name='password'
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
           />
          <div className="file-field input-field">
            <div className="btn #64b5f6 blue darken-1">
              <span >UPLOAD PROFILE PIC</span>
              <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
              <input type="text" className="file-path validate" />
            </div>
          </div>
          <button onClick={() => postData()} className="btn waves-effect waves-light #64b5f6 blue darken-1" type="submit">
            Signup
          </button>
          <br />
          <small>
            <Link to="/login">Already have an Account??</Link>
          </small>
        </div>
      </div>;
}

export default Signup
