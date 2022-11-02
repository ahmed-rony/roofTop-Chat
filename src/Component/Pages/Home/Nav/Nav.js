import React, { useState, useEffect } from 'react';
import './Nav.scss';
import image1 from '../../../image/217444869_1430812633984278_7046843196953871679_n.jpg';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import * as firebase from 'firebase/app';
import firebaseConfig from '../../Login/firebase.config';
import useAuth from '../../../Hook_Context/useAuth';


const Nav = () => {
    const [loggedIn, setLoggedIn, currentUser, setCurrentUser] = useAuth();
    const [user, setUser] = useState({
        email: '',
        password: '',
        error: '',
        success: false
    });

    firebase.initializeApp(firebaseConfig);
    const auth = getAuth();

    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, (user) =>{
            setCurrentUser(user);
            // console.log(user);
        })

        return () =>{
            unsub()
        }
    }, []);

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                const signOutUser = {
                    email: ''  // conditionally email is only required; check PrivateRoute;
                }
                setLoggedIn(signOutUser);
            }).catch((error) => {
                console.log(error.messege);
            });
    }
    return (
        <div className='navbar'>
            <span className='logo'>RoofTop</span>
            <img className='user-avatar' src={image1} alt="" />
            <span className='user-name f-rub'>{currentUser.displayName}Harry</span>
            <button onClick={handleSignOut} className='f-rub logout'>logout</button>
        </div>
    );
};

export default Nav;