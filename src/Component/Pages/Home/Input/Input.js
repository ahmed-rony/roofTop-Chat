import React, { useContext, useState } from 'react';
import { arrayUnion, doc, getFirestore, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { MdAttachFile, MdSend } from 'react-icons/md';
import { ChatContext } from '../../../Hook_Context/ChatContext';
import useAuth from '../../../Hook_Context/useAuth';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { TextField } from '@mui/material';

const Input = () => {
    const [text, setText] = useState('');
    const [img, setImg] = useState();
    // console.log(img.size);

    const [currentUser] = useAuth();
    const { data } = useContext(ChatContext);
    const db = getFirestore();
    
    const handleSend = async () => {
        
        if(img){
            const storage = getStorage();
            const storageRef = ref(storage, uuid());

            const uploadTask = uploadBytesResumable(storageRef, img);

            uploadTask.on(
                (error) => {
                    console.log(error);
                },
                () => {
                    // Handle successful uploads on complete
                    getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
                        await updateDoc(doc(db, 'chats', data.chatId), {
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: currentUser.uid,
                                date: Timestamp.now(),
                                img: downloadURL,
                            })
                        })
                    });
                }
            );
        }
        else {
            // eslint-disable-next-line no-lone-blocks
            {
                text &&
                await updateDoc(doc(db, 'chats', data.chatId), {
                    messages: arrayUnion({
                        id: uuid(),
                        text,
                        senderId: currentUser.uid,
                        date: Timestamp.now(),
                    })
                })
            }
        }

        await updateDoc(doc(db, 'userchats', currentUser.uid),{  // for currentUser
            [data.chatId + ".lastMessage"]:{
                text
            },
            [data.chatId + ".date"]: serverTimestamp()
        })
        await updateDoc(doc(db, 'userchats', data.user.uid),{  // for other user
            [data.chatId + ".lastMessage"]:{
                text
            },
            [data.chatId + ".date"]: serverTimestamp()
        })


        setText('');
        setImg(null);
    }
    return (
        <div className="input">
            <input type="text" placeholder='Aa' className='chat-input f-rub' onKeyDown={(e)=> e.code === 'Enter' && handleSend()} value={text} onChange={e => setText(e.target.value)} />
            <div className="send-option">
                <input type="file" name="file" id="file" style={{ display:'none' }} onChange={e => setImg(e.target.files[0])} />
                <label htmlFor='file' className='attachments' ><MdAttachFile /></label>
                
                <button className='send-btn' onClick={handleSend} ><MdSend /></button>
            </div>
        </div>
    );
};

export default Input;