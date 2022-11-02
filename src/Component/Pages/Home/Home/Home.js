import React from 'react';
import './Home.scss';
import Sidebar from '../Sidebar/Sidebar';
import ChatBox from '../ChatBox/ChatBox';

const Home = () => {
    return (
        <div className='container home-content'>
            <div className='row gx-0'>
                <Sidebar></Sidebar>
                <ChatBox></ChatBox>
            </div>
        </div>
    );
};

export default Home;