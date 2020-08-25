import React, { useContext } from 'react';
import Login from './Login';
import { UserContext } from '../App';
import Home from './Home';

function Main() {
    const userContext = useContext(UserContext);
    return (
        <div id='main'>
            {
                userContext.user ? <Home /> : <Login />
            }
        </div>
    )
}

export default Main
