import React, { useState } from 'react';
import './Search.scss';
import { TextField } from '@mui/material';
import { collection, query, where, doc, getDoc, getFirestore, serverTimestamp, setDoc, updateDoc, getDocs } from 'firebase/firestore';
import useAuth from '../../../Hook_Context/useAuth';

const Search = () => {
    const [userName, setUserName] = useState("");
    const [user, setUser, currentUser, setCurrentUser] = useAuth();
    const [err, setErr] = useState();

    const db = getFirestore();
    
    const handleKey = (e) => {
        e.code === "Enter" && handleSearch();
    }

    const handleSearch = async () => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("displayName", "==", userName));

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data());
            });

        } catch (error) {
            setErr(error.message);
        }

    }



    const handleSelect = async () => {
        // check whether the group exist(chats in firestore), if not create new one;
        const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;  // user is the searching result user ID;
        try {
            const res = await getDoc(doc(db, "chats", combinedId));  // 'getDoc' searching if there is a chat collection between these two users;

            // create user chats for two person;
            if (!res.exists()) {  // exists() is a firebase method;
                // create a chat in chats collection;
                await setDoc(doc(db, 'chats', combinedId), { messages: [] });

                // create user chats;
                await updateDoc(doc(db, 'userchats', currentUser.uid), {  // for the curreentUser;
                    [combinedId + ".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    },
                    [combinedId + ".date"]: serverTimestamp()
                });
                await updateDoc(doc(db, 'userchats', user.uid), {  // for the user;
                    [combinedId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL
                    },
                    [combinedId + ".date"]: serverTimestamp()
                });
            }
        } catch (error) {
            console.log(error, 'search error');
        }
        setUser(null);
        setUserName('');

    }
    return (
        <div>
            <div className="search-input">
                <TextField
                    className="search-field w-100"
                    label="search"
                    size='small'
                    name='password'
                    variant="filled"
                    onChange={e => setUserName(e.target.value)}
                    onKeyDown={handleKey}
                    value={userName}
                />
            </div>
            {
                user.displayName
                ?   <div className="userChat-content">
                        <div className="userChat" onClick={handleSelect}>
                            <img src={user.photoURL} alt="" className='userChat-avatar' />
                            <div className="userChatInfo">
                                <span className='f-rub'>{user.displayName}</span>
                            </div>
                        </div>
                    </div>
                :   null
            }

        </div>
    );
};

export default Search;