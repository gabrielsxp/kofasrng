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
import { FaKey } from 'react-icons/fa';
import { withRouter } from 'react-router-dom';
import constants from '../../constants';
import axios from '../../axios';

const useStyles = makeStyles(theme => createStyles({
  align: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(3)
  },
  container: {
    width: '100%',
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

function ChangePassword({ history }) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleConfirmPasswordChange(event){
    setConfirmPassword(event.target.value);
  }

  function handleNewPasswordChange(event){
      setNewPassword(event.target.value);
  }

  function handleClose() {
    setError(false);
  }

  function handleError(message) {
    setError(message);
  }

  function handleSuccess(message){
      setSuccess(message);
  }

  async function changePasswords() {

    setError(null);

    const data = {
      password,
      newPassword
    };

    if (password === '' || confirmPassword === '' || newPassword === '') {
      handleError('Fill all the fields !');
      return;
    }

    if(newPassword.length < 6){
        handleError('Your password must contain at least 6 characters');
        return;
    }

    if(newPassword !== confirmPassword){
        handleError('Passwords does not match');
        return;
    }

    setLoading(true);

    try {
      const response = await axios.patch(`${constants.BASE_URL}/user/password`, { ...data });
      if (response.data.success) {
        setLoading(false);
        handleSuccess("Password changed !");
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        handleError(response.data.error);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      handleError('Authentication error');
      setLoading(false);
    }
  }

  return (
    <div className={clsx(classes.align, classes.container)}>
      {
        error && <CustomMessage handleClose={() => handleClose(false)} open={error ? true : false} type="error" message={error} />
      }
      {
        success && <CustomMessage handleClose={() => handleSuccess(false)} open={success ? true : false} type="success" message={success} />
      }
      <Paper elevation={3} className={clsx(classes.wrapper)}>
        <Typography className={classes.item} variant="h6">Change Password</Typography>
        <FormControl>
          <InputLabel htmlFor="input-password">Current Password</InputLabel>
          <Input
            className={classes.item}
            type="password"
            id="input-password"
            value={password}
            startAdornment={
              <InputAdornment position="start">
                <FaKey className={classes.icon} />
              </InputAdornment>
            }
            onChange={(e) => handlePasswordChange(e)}
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="input-confirm-password">New Password</InputLabel>
          <Input
            className={classes.item}
            type="password"
            id="input-new-password"
            value={newPassword}
            placeholder="Min of 6 characters"
            startAdornment={
              <InputAdornment position="start">
                <FaKey className={classes.icon} />
              </InputAdornment>
            }
            onChange={(e) => handleNewPasswordChange(e)}
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="input-confirm-new=password">Confirm New Password</InputLabel>
          <Input
            className={classes.item}
            type="password"
            id="input-confirm-new-password"
            value={confirmPassword}
            startAdornment={
              <InputAdornment position="start">
                <FaKey className={classes.icon} />
              </InputAdornment>
            }
            onChange={(e) => handleConfirmPasswordChange(e)}
          />
        </FormControl>
        <Button onClick={() => changePasswords()} disabled={password.length < 6 || confirmPassword.length === 0 || newPassword.length === 0 || newPassword !== confirmPassword || loading} variant="contained" color="primary">Change</Button>
      </Paper>
    </div >
  );
}

export default withRouter(ChangePassword);