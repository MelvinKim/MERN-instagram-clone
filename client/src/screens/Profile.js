import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from "../App";

const Profile = () => {

    const [myPics, setMyPics] = useState([]);
    const [image, setImage] = useState('');
    // const [url, setUrl] = useState('');
    const { state, dispatch } = useContext(UserContext)
    useEffect(() => {
        fetch('/myposts', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
        .then(result => {
            console.log(result)
            setMyPics(result.myPost)
        })
    }, [])

    useEffect(() => {
        if(image){
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
                    console.log(data);
                    // setUrl(data.url);

                    fetch('/updatepic', {
                        method:'put',
                        headers:{
                            "Content-Type": "application/json",
                            "Authorization":"Bearer " + localStorage.getItem('jwt')
                        },
                        body:JSON.stringify({
                            pic: data.url
                        })
                    }).then(res => res.json())
                    .then(result => {
                        console.log(result)
                        localStorage.setItem('user', JSON.stringify({...state, pic: result.pic}));
                        dispatch({ type: 'UPDATEPIC', payload: result.pic});
                        window.location.reload();
                    })
                })
                .catch(err => {
                    console.log("No internet connection" + err);
                })
        }
    }, [image])

    const updatePhoto = (file) => {
        setImage(file)
    }
    return (
        <div style={{ maxWidth: '550px', margin: '0px auto'}}>
            <div style={{  margin: '18px 0px', borderBottom: '1px solid grey' }}>
                {/* <button onClick={() => {
                    updatePhoto()
                }} style={{ margin: '10px 0px 10px 52px'}} className='btn waves-effect waves-light #64b5f6 blue darken-1' type='submit'>Update Pic</button> */}
                
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div>
                    <img style={{ width: '160px', height: '160px', borderRadius: "80px"}} src={state ? state.pic: "Loading image"} alt='profile' />
                </div>
                <div>
                    <h4>{ state ? state.name : "Loading"}</h4>
                    <h6>{ state ? state.email : "Loading"}</h6>
                    <div style={{ display: 'flex' , justifyContent: 'space-between', width: '108%'}}>
                        <h6>{myPics.length} posts</h6>
                        <h6>{ state ? state.followers.length: "0"} followers</h6>
                        <h6>{ state ? state.following.length: "0"} following</h6>
                    </div>
                </div>
            </div>

            <div className="file-field input-field" style={{ margin: '10px' }}>
                <div className="btn #64b5f6 blue darken-1">
                    <span >UPDATE PROFILE PIC</span>
                    <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input type="text" className="file-path validate" />
                </div>
            </div>
            <div className='gallery'>
                {
                    myPics.map(item => {
                       return (
                           <img key={item._id} className='item' src={item.photo} alt={item.title} />
                       )
                    })
                }
            </div>
        </div>
    )
}

export default Profile
