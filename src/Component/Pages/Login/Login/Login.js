import React, { useState } from 'react';
import * as firebase from 'firebase/app';
import firebaseConfig from '../firebase.config';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { Paper, TextField } from '@mui/material';
import { FcGoogle } from 'react-icons/fc';
import './Login.css';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../../Hook_Context/useAuth';
import { getStorage } from 'firebase/storage';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { doc, getFirestore, setDoc } from "firebase/firestore";


const Login = () => {
    const [ loggedIn, setLoggedIn ] = useAuth();
    const [userInfo, setUserInfo] = useState({
        displayName: '',
        email: '',
        password: '',
        error: '',
        success: false
    });
    const [newUser, setNewUser] = useState(false);

    firebase.initializeApp(firebaseConfig);
    const auth = getAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';


    const handleGoogle = () => {
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then((result) => {
                const { displayName, email, photoURL } = result.user;
                const signInUser = {
                    displayName: displayName,
                    email: email,
                    avater: photoURL
                }
                setLoggedIn(signInUser);
                setUserToken();
                navigate(from, { replace: true });

            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    const handleBlur = (e) => {
        let isFieldValid = true;

        if (e.target.name === 'email') {
            isFieldValid = /\S+@\S+\.\S+/.test(e.target.value)
        }
        if (e.target.name === 'password') {
            const validPassword = e.target.value.length >= 6;
            const hasNumber = /\d{1}/.test(e.target.value);
            isFieldValid = validPassword && hasNumber;
        }
        if (isFieldValid) {
            const newUserInfo = { ...userInfo };
            newUserInfo[e.target.name] = e.target.value;
            setUserInfo(newUserInfo);
        }
    }

    const handlePassword = (event) => {

        if (newUser && userInfo.email && userInfo.password) {
            try {

                // ========================================
                const res = createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password)
                    .then((userCredential) => {
                        const userInfo = userCredential.user;
                        let addUserInfo = { ...userInfo };
                        addUserInfo.error = '';
                        addUserInfo.success = true;
                        setUserInfo(addUserInfo);
                        setLoggedIn(addUserInfo);
                        setUserToken();
                        navigate(from, { replace: true });
                        
                        // =========================================
                        const file = event.target.file.files[0];
                        const displayName = event.target.displayName.value;
                        const email = userInfo.email;
        
                        const db = getFirestore();
                        const storage = getStorage();
                        const storageRef = ref(storage, displayName);
                        
                        const uploadTask = uploadBytesResumable(storageRef, file);

                        uploadTask.on(
                            (error) => {
                                console.log(error);
                            },
                            () => {
                                // Handle successful uploads on complete
                                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                    // console.log('File available at', downloadURL);
                                    updateProfile(res.user, {
                                        displayName,
                                        photoURL: downloadURL,
                                    });
                                    setDoc(doc(db, 'users', userInfo.uid), {
                                        uid: userInfo.uid,
                                        displayName,
                                        email,
                                        photoURL: downloadURL
                                    });
                                    setDoc(doc(db, 'userchats', userInfo.uid), {});
                                });
                            }
                        );
                    })


            } catch (error) {
                let addUserInfo = { ...userInfo };
                addUserInfo.error = error.message;
                addUserInfo.success = false;
                setUserInfo(addUserInfo);
            }
        }
        if (!newUser && userInfo.email && userInfo.password) {
            try {
                signInWithEmailAndPassword(auth, userInfo.email, userInfo.password)
                    .then((userCredential) => {
                        const userInfo = userCredential.user;
                        let addUserInfo = { ...userInfo };
                        addUserInfo.error = '';
                        setUserInfo(addUserInfo);
                        setLoggedIn(addUserInfo);
                        navigate(from, { replace: true });
                        setUserToken();
                    })
            } catch (error) {
                let addUserInfo = { ...userInfo };
                addUserInfo.error = error.message;
                addUserInfo.success = false;
                setUserInfo(addUserInfo);
            }
        }
        event.preventDefault();

    }
    // ===============  setting firebase verify tokens  ==============

    const setUserToken = () =>{
        auth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
            sessionStorage.setItem('token', idToken)
            
          }).catch(function(error) {
            // Handle error
          });
    }


    return (
        <div>

            <div className="container">
                <div className="row">
                    <div className="col-md-5 m-auto text-center login-box">
                        <Paper className='login-form' elevation={3}>
                            {
                                newUser
                                    ? <h2 className='f-rub text-center training-header p-0 mb-4'>Sign <span className='brand-c'>Up</span></h2>
                                    : <h2 className='f-rub text-center training-header p-0 mb-4'>Sign <span className='brand-c'>In</span></h2>
                            }
                            <form onSubmit={handlePassword}>
                                {
                                    newUser &&
                                    <TextField
                                        className="form-field"
                                        label="Name"
                                        name='displayName'
                                        variant="outlined"
                                        onBlur={handleBlur}
                                    />
                                }
                                <TextField
                                    className="form-field"
                                    label="Email"
                                    name='email'
                                    variant="outlined"
                                    onBlur={handleBlur}
                                />
                                <TextField
                                    className="form-field"
                                    type='password'
                                    label="Password"
                                    name='password'
                                    variant="outlined"
                                    onBlur={handleBlur}
                                />
                                {
                                    newUser &&
                                    <TextField
                                        className="form-field"
                                        type='file'
                                        name='file'
                                        variant="outlined"
                                    />
                                }

                                <input onChange={() => setNewUser(!newUser)} className='form-check-input' type="checkbox" name="" />
                                <label className='ms-3 f-ral' htmlFor=""><h6>create Account</h6></label>



                                <button type='Submit' className="brand-btn d-block m-auto ps-5 pe-5 mb-4 mt-4">Submit</button>
                                {
                                    userInfo.error && <p style={{ color: 'red' }}>{userInfo.error}error!</p>
                                }
                                {
                                    userInfo.success && <p className="brand-c">Account {newUser ? 'Created' : 'Signed In'} Successfully!</p>
                                }
                            </form>

                            <button onClick={handleGoogle} className='f-rub google-btn'><FcGoogle className='me-2 google-icon' />Google</button>
                        </Paper>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Login;