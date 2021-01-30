
import React, { useState, useEffect, useContext } from 'react';
import { FaHeart, FaThumbsDown, FaThumbsUp, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { UserContext } from "../App";
const SubScribedUserPosts = () => {

    const { state, dispatch } = useContext(UserContext);
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch('/getsubpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                setData(result.posts)
            })
    }, [])

    const likePost = (id) => {
        fetch('/like', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }
    const unlikePost = (id) => {
        fetch('/unlike', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    //comment on post 
    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: postId,
                text: text
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err);
            })
    }

    //delete post 
    const deletePost = (postId) => {
        fetch(`/deletePost/${postId}`, {
            method: 'delete',
            headers: {
                Authorization: "Bearer " + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData)
            })
    }

    return (
        <div className='home'>
            {
                data.map(item => {
                    return (
                        <div key={item._id} className='card home-card'>
                            <h5 style={{ padding: '0.5rem'}}>
                                <Link to={item.postedBy._id == state._id ? '/profile' : '/profile/' + item.postedBy._id}>{item.postedBy.name}</Link>
                                {item.postedBy._id == state._id && <i
                                    onClick={() => deletePost(item._id)}
                                    className='material-icons' style={{ cursor: 'pointer', float: 'right' }} > <FaTrash /> </i>}
                            </h5>
                            <div className='card-image'>
                                <img src={item.photo} alt='wallpaper' />
                            </div>
                            <div className='card-content'>
                                <i className='material-icons' style={{ color: 'red', cursor: 'pointer' }}> <FaHeart /> </i>
                                {item.likes.includes(state._id)
                                    ?
                                    <i onClick={() => unlikePost(item._id)} className='material-icons' style={{ cursor: 'pointer' }} > <FaThumbsDown /> </i>
                                    :
                                    <i onClick={() => likePost(item._id)} className='material-icons' style={{ cursor: 'pointer' }} > <FaThumbsUp /> </i>
                                }
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return (
                                            <h6 key={record._id}><span style={{ fontWeight: 'bolder' }}>{record.postedBy.name}</span> <small>{record.text}</small></h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    makeComment(e.target[0].value, item._id)
                                }}>
                                    <input type='text' placeholder='add a comment' />
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default SubScribedUserPosts;
