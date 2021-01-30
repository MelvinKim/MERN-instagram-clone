import React, { useEffect, createContext, useReducer, useContext } from 'react';
import Navbar from './components/Navbar';
import { Route, Switch } from "react-router-dom";

import Home from "./screens/Home";
import Login from "./screens/Login";
import Profile from "./screens/Profile";
import Signup from "./screens/Signup";
import CreatePost from "./screens/CreatePost";
import { useHistory } from "react-router-dom";

import { reducer, initialState } from "./reducers/userReducer";
import UserProfile from './screens/UserProfile';
import SubScribedUserPosts from './screens/SubscribedUserPosts';
import Reset from './screens/Reset';
import NewPassword from './screens/NewPassword';


export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const {state, dispatch} = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user){
      dispatch({ type: 'USER', payload: user})
      // history.push("/");
    } else {
      if(!history.location.pathname.startsWith('/reset')){
        history.push("/login");
      }
    }
  }, [])
  return (
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/reset' component={Reset} />
      <Route exact path='/reset/:token' component={NewPassword} />
      <Route exact path='/profile' component={Profile} />
      <Route exact path='/signup' component={Signup} />
      <Route exact path='/create' component={CreatePost} />
      <Route exact path='/profile/:userid' component={UserProfile} />
      <Route exact path='/myfollowingposts' component={SubScribedUserPosts} />
    </Switch>
  )
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
  <UserContext.Provider value={{ state:state, dispatch}}>
    <div className="App">
      <Navbar />
      <Routing />
    </div>
  </UserContext.Provider>
  )
}

export default App
