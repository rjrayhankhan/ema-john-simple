import React, { useContext, useState } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword, handleFbSignIn, handleGoogleSignIn, handleSignOut, initializeLoginFramework, signInWithEmailAndPassword } from './LoginManager';




function Login() {
     const [newUser, setNewUser] = useState(false);
     const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        email: '',
        password: '',
        photo: '',
       });
      
       initializeLoginFramework();

    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const history = useHistory();
    const location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };


    const googleSignIn = () =>{
       handleGoogleSignIn()
       .then(res => {
        handleResponses(res, true);
       })
    }

    const fbSignIn = () => {
       handleFbSignIn()
        .then(res => {
         handleResponses(res, true);
      })
    }

    const signOut = () => {
      handleSignOut()
      .then(res => {
        handleResponses(res, false);
      })
    }

    const handleResponses = (res, redirect) => {
          setUser(res);
          setLoggedInUser(res);
          if(redirect) {
            history.replace(from);
          }
    }

     const handleBlur = (event) => {
            let isFieldValid = true;
           if(event.target.name === 'email'){
            isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
           }
           if(event.target.name === 'password'){
              const isPasswordValid = (event.target.value.length > 6);
              const PasswordHasNumber = /\d{1}/.test(event.target.value);
              isFieldValid = isPasswordValid && PasswordHasNumber;
           }
           if(isFieldValid){
              const newUserInfo = {...user};
              newUserInfo[event.target.name] = event.target.value;
              setUser(newUserInfo);
           }
  }
     const handleSubmit = (event) => {
    // console.log(user.email, user.password)
      if(newUser && user.email && user.password){
         createUserWithEmailAndPassword(user.name, user.email, user.password)
         .then(res => {
          handleResponses(res, true);
         })
     }

     if(!newUser && user.email && user.password){
       signInWithEmailAndPassword(user.email, user.password)
            .then(res => {
              handleResponses(res, true);
          })
     }

      event.preventDefault();
  }

 
 
  return (
    <div style={{textAlign: 'center'}}>
      {
        user.isSignedIn ? <button onClick={signOut}>Sign out</button> : <button onClick={googleSignIn}>Sign in</button>
      }
      <br/>
      <button onClick={fbSignIn}>Sign in using Facebook</button>
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your Email: {user.email}</p> 
          <img src={user.photo} alt=""/>
        </div>
      }

      <h1>Our own Authentication</h1>
        <input type="checkbox" onClick={() => setNewUser(!newUser)} name="newUser" id=""/>
        <label htmlFor="newUser">New User Sign Up</label>
        <form onSubmit={handleSubmit}>
            {newUser && <input onBlur={handleBlur} placeholder="Your name" name="name" type="text" />}
            <br/>
            <input onBlur={handleBlur} placeholder="Enter Your EmailAddressed" type="text" name="email" required />
            <br/>
            <input onBlur={handleBlur} placeholder="Enter Your Password" type="password" name="password" id="" required />
             <br/>
             <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'}/> 
        </form>
          <p style={{color: 'red'}}>{user.error}</p>
          {user.success && <p style={{color: 'green'}}>User {newUser ? 'Created' : 'Logged In'} Successfully</p>}
    </div>
  );
}

export default Login;
