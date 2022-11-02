import React, { useContext } from 'react';
import './ChatBox.scss';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { HiUserAdd } from 'react-icons/hi';
import { BsFillCameraVideoFill } from 'react-icons/bs';
import Messeges from '../Messeges/Messeges';
import useAuth from '../../../Hook_Context/useAuth';
import { ChatContext } from '../../../Hook_Context/ChatContext';

const ChatBox = () => {
    const { data } = useContext(ChatContext);
    
    return (
        <div className='col-md-8'>
            <div className="chatbox-content position-relative">
                <div className="chat-info">
                    
                    <div className='user-name'>
                        {
                            data.user.displayName &&
                            <img src={data.user.photoURL} className='chatBox-img' alt="" />
                        }
                        <span className='f-rub chat-user'>{data.user.displayName}</span>
                    </div>
                    <div>
                        <BsFillCameraVideoFill className="chat-icons" />
                        <HiUserAdd className="chat-icons" />
                        <BiDotsHorizontalRounded className="chat-icons" />
                    </div>
                </div>
                <Messeges></Messeges>
                
            </div>
        </div>
    );
};  

export default ChatBox;