import React, { useEffect, useState } from 'react';
import Routes from './components/Routes/index';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import MultiBackend, { TouchTransition } from 'react-dnd-multi-backend';
import { getCurrentUser, setCurrentUser, getCookies } from './services/Auth';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useDispatch } from 'react-redux';
import Cookies from './components/Cookies/index';

const HTML5toTouch = {
  backends: [
    {
      backend: HTML5Backend
    },
    {
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      preview: true,
      transition: TouchTransition
    }
  ]
};

function App(props) {
  const dispatch = useDispatch();
  const [showCookies, setShowCookies] = useState(false);

  const checkCookies = () => {
    setTimeout(() => {
      const cookiesSetted = getCookies();
      if (!cookiesSetted) {
        setShowCookies(true);
      }
    }, 2000);
  }

  useEffect(() => {
    checkCookies();
    try {
      const user = getCurrentUser();
      dispatch({ type: 'AUTHENTICATED_USER', user });
    } catch (error) {
      setCurrentUser('user', null);
      dispatch({ type: 'AUTHENTICATED_USER', user: null });
    }
  }, []);

  return (
    <div className="App">
      <DndProvider backend={MultiBackend} options={HTML5toTouch}>
        <Routes />
        {showCookies && <Cookies up={showCookies ? true : false} />}
      </DndProvider>
      <CssBaseline />
    </div>
  );
}

export default App;
