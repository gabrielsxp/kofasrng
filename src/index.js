import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createMuiTheme } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import {createStore} from 'redux';
import { ThemeProvider } from '@material-ui/styles';
import reducer from './store/reducer';

const store = createStore(reducer);

const theme = createMuiTheme({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: '400',
  palette: {
    primary: {
      main: '#303F9F'
    },
    secondary: {
      main: '#3F51B5'
    }
  }
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
  , document.getElementById('root')
);
