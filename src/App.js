import React, { useEffect, useState, useReducer } from 'react';
import './App.css';
import axios from 'axios';
import Main from './components/Main';
import { initialState, reducer } from './context/userContext';
import { languageReducer, languageState } from './context/languageContext';



export const UserContext = React.createContext();
export const LangContext = React.createContext();

function App() {
  const [user, userDispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(true);
  const [lang, langDispatch] = useReducer(languageReducer, languageState);


  useEffect(() => {
    console.log('requested session');
    const fetchUser = async () => {
      await axios.get(`${process.env.REACT_APP_API_URL}/user/validate`, { withCredentials: true })
        .then(response => setUser(response.data).then(setLoading(false)))
        .catch(() => {
          console.log('no sessions available');
          setLoading(false)
        });
    }
    fetchUser();
  }, []);

  const setUser = data => {
    userDispatch(data);
    return Promise.resolve();
  }

  if (!loading)
    return (
      <UserContext.Provider value={{ user: user, dispatch: userDispatch }}>
        <LangContext.Provider value={{ lang: lang, dispatch: langDispatch }}>
          <div className="App">
            <Main />
          </div>
        </LangContext.Provider>
      </UserContext.Provider>
    );
  else return null;
}

export default App;
