import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

export const initializeLoginFramework = () => {
    if(firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
    }
}

 export const handleGoogleSignIn = () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(googleProvider)
    .then(res => {
      const {displayName, email, photoURL} = res.user
      const singedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL,
        success: true,
      }
      return singedInUser;
    })
    .catch(err => {
      console.log(err);
      console.log(err.message);
    })
  }

 export const handleFbSignIn = () => {
    const Provider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithPopup(Provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;
      var user = result.user;
      user.success = true;
      return user;
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage)
    });
  }

 export const handleSignOut =() => {
   return firebase.auth().signOut()
    .then(res => {
          const signOutUser = {
           isSignedIn: false,
           name: '',
           email: '',
           photo: '',
           error: '',
           success: false,
          }
          return signOutUser;
    })
    .catch(err => {

    })
}

export const createUserWithEmailAndPassword = (name, email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then( res => {
          const newUserInfo = res.user;
          newUserInfo.error = '';
          newUserInfo.success = true;
          updateUserName(name);
          return newUserInfo;
        })
       .catch(error => {
         const newUserInfo = {};
         newUserInfo.error = error.message;
         newUserInfo.success = false;
         return newUserInfo;
       });
}

export const signInWithEmailAndPassword = (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .then(res => {
          const newUserInfo = res.user;
          newUserInfo.error = '';
          newUserInfo.success = true;
          return newUserInfo;
      })
      .catch((error) => {
          const newUserInfo = {};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          return newUserInfo;
      });
}

const updateUserName = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName:name,
    }).then(function() {
      console.log('user name update')
    }).catch(function(error) {
      console.log(error)
    });
}