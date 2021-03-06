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
import { login, setCurrentUser } from '../../services/Auth';
import { Link, useHistory } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import { FaKey } from 'react-icons/fa';
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

export default function SignIn() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleClose() {
    setError(false);
  }

  const checkEmail = () => {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (regex.test(email)) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
      setError('Invalid Email format')
    }
  }

  const signInUser = async () => {

    setError(null);

    const data = {
      email,
      password
    };

    if (password === '' || email === '') {
      setError('Fill all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${constants.BASE_URL}/signin`, { ...data });
      console.log(response);
      if (response.status === 200) {
        login(response.data.token);
        setCurrentUser(response.data.user);
        dispatch({ type: 'AUTHENTICATED_USER', user: response.data.user });
        history.push(constants.ADMIN);
      } else {
        console.log(response.data.error);
        setError(response.data.error);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error);
      setLoading(false);
    }
  }

  return <>
    {
      error && <CustomMessage handleClose={handleClose} open={error ? true : false} type="error" message={error} />
    }
    <div className={clsx(classes.align, classes.container)}>
      <Paper elevation={3} className={clsx(classes.wrapper)}>
        <Typography className={classes.item} variant="h6">Access Dashboard</Typography>
        <FormControl>
          <InputLabel htmlFor="input-email">Email</InputLabel>
          <Input
            className={classes.item}
            onBlur={() => checkEmail()}
            id="input-email"
            type="email"
            error={!validEmail}
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
            id="input-password"
            startAdornment={
              <InputAdornment position="start">
                <FaKey className={classes.icon} />
              </InputAdornment>
            }
            onChange={(e) => handlePasswordChange(e)}
          />
        </FormControl>
        <Link to={constants.recuperarSenha} className={clsx(classes.item, classes.link)}>Forgot password ?</Link>
        <Button onClick={() => signInUser()} disabled={loading || !validEmail || password.length < 6} variant="contained" color="primary">Access</Button>
        <Button style={{ marginTop: '15px' }} onClick={() => history.push(constants.SIGN_UP)} disabled={loading} color="primary">Create Account</Button>
      </Paper>
    </div>
  </>
}



