import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import CustomMessage from '../CustomMessage/index';
import { FaUserCircle } from 'react-icons/fa';
import { FaKey } from 'react-icons/fa';
import { FaEnvelope } from 'react-icons/fa';
import { login, setCurrentUser } from '../../services/Auth';
import { withRouter } from 'react-router-dom';
import constants from '../../constants';
import axios from '../../axios';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles(theme => createStyles({
  align: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(3)
  },
  container: {
    maxWidth: '100%',
    minHeight: '100vh'
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(10)
  },
  item: {
    marginBottom: theme.spacing(2)
  },
  icon: {
    color: theme.palette.primary.main
  },
  link: {
    color: theme.palette.primary.dark,
    textDecoration: 'none'
  }
}));

function SignUp({ history }) {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [validUsername, setValidUsername] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const dispatch = useDispatch();

  const handleNameChange = (event) => {
    setName(event.target.value);
  }
  const handlePasswordConfirmChange = (event) => {
    setConfirmPassword(event.target.value);
  }

  const passwordCheck = (password, password2) => {
    return setPasswordsMatch(password === password2);
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleClose = () => {
    setError(false);
  }

  const handleError = (message) => {
    setError(message);
  }

  const checkUsername = async () => {
    try {
      const obj = { username: name.toLowerCase().replace(/\s/g, "_").replace(/-/g, "_") };
      const response = await axios.post(`${constants.BASE_URL}/check/user`, { ...obj });
      console.log(response);
      if (response.data.valid) {
        setValidUsername(true);
      } else {
        setValidUsername(false);
      }
    } catch (error) {
      handleError('Unable to check if the username is valid');
    }
  }

  const checkEmail = async () => {
    try {
      const response = await axios.post(`${constants.BASE_URL}/check/user`, { email });
      console.log(response);
      if (response.data.valid) {
        setValidEmail(true);
      } else {
        setValidEmail(false);
      }
    } catch (error) {
      handleError('Unable to check if the password is valid');
    }
  }

  async function signUpUser() {

    setError(null);

    const data = {
      username: name.toLowerCase().replace(/\s/g, "_").replace(/-/g, "_"),
      email,
      password
    };

    if (password === '' || email === '' || name === '' || confirmPassword === '') {
      handleError('Fill all the fields !');
      return;
    }

    if (password.length < 6) {
      handleError('Your password must contain at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${constants.BASE_URL}/signup`, { ...data });
      console.log(response);
      if (response.status === 201) {
        setLoading(false);
        login(response.data.token);
        setCurrentUser(response.data.user);
        dispatch({ type: 'AUTHENTICATED_USER', user: response.data.user });

        history.push(`${constants.ADMIN}`);
      } else {
        handleError(response.data.error);
        setLoading(false);
      }
    } catch (error) {
      handleError('Unable to create an account right now !');
      setLoading(false);
    }
  }

  return (
    <div className={clsx(classes.align, classes.container)}>
      {
        error && <CustomMessage handleClose={handleClose} open={error ? true : false} type="error" message={error} />
      }
      <Paper elevation={3} className={clsx(classes.wrapper)}>
        <Typography className={classes.item} variant="h6">Create an account</Typography>
        <FormControl>
          <InputLabel htmlFor="input-email">Name</InputLabel>
          <Input
            className={classes.item}
            id="input-name"
            type="text"
            value={name}
            error={!validUsername}
            onBlur={() => checkUsername()}
            startAdornment={
              <InputAdornment position="start">
                <FaUserCircle className={classes.icon} />
              </InputAdornment>
            }
            onChange={(e) => handleNameChange(e)}
          />

        </FormControl>

        <FormControl>
          <InputLabel htmlFor="input-email">Email</InputLabel>
          <Input
            className={classes.item}
            id="input-email"
            valule={email}
            type="email"
            error={!validEmail}
            onBlur={() => checkEmail()}
            startAdornment={
              <InputAdornment position="start">
                <FaEnvelope className={classes.icon} />
              </InputAdornment>
            }
            onChange={(e) => handleEmailChange(e)}
          />

        </FormControl>
        <FormControl>
          <InputLabel htmlFor="input-password">Password</InputLabel>
          <Input
            className={classes.item}
            type="password"
            value={password}
            id="input-password"
            startAdornment={
              <InputAdornment position="start">
                <FaKey className={classes.icon} />
              </InputAdornment>
            }
            onChange={(e) => handlePasswordChange(e)}
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="input-password">Confirm Password</InputLabel>
          <Input
            error={!passwordsMatch}
            onBlur={() => passwordCheck(password, confirmPassword)}
            value={confirmPassword}
            className={classes.item}
            type="password"
            id="input-confirm-password"
            startAdornment={
              <InputAdornment position="start">
                <FaKey className={classes.icon} />
              </InputAdornment>
            }
            onChange={(e) => handlePasswordConfirmChange(e)}
          />
        </FormControl>
        <Button onClick={() => signUpUser()} disabled={loading || !passwordsMatch || !validUsername} variant="contained" color="primary">Create</Button>
      </Paper>
    </div >
  );
}

export default withRouter(SignUp);