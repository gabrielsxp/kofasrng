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
import { FaEnvelope } from 'react-icons/fa';
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

function RecoveryPassword({ history }) {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  async function recoveryPassword() {

    setError(null);

    const data = {
      email
    };

    if (email === '') {
      setError('Fill all the fields');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/recovery', { ...data });
      console.log(response);
      if (response.data.success) {
        setSuccess('New password sent to your email');
        window.setTimeout(() => {
          history.push(constants.SIGN_IN);
        }, 3000);
      } else {
        setError(response.data.error);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError('Unable to send an email right now ! Try again later !');
      setLoading(false);
    }
  }

  return (
    <div className={clsx(classes.align, classes.container)}>
      {
        error && <CustomMessage handleClose={() => setError(false)} open={error ? true : false} type="error" message={error} />
      }
      {
        success && <CustomMessage handleClose={() => setSuccess(false)} message={success} open={success ? true : false} type="success" />
      }
      <Paper elevation={3} className={clsx(classes.wrapper)}>
        <Typography className={classes.item} variant="h6">Recovery Password</Typography>
        <FormControl>
          <InputLabel htmlFor="input-email">Email</InputLabel>
          <Input
            className={classes.item}
            id="input-email"
            type="email"
            startAdornment={
              <InputAdornment position="start">
                <FaEnvelope className={classes.icon} />
              </InputAdornment>
            }
            onChange={(e) => handleEmailChange(e)}
          />

        </FormControl>
        <Button onClick={() => recoveryPassword()} disabled={loading} variant="contained" color="primary">Send</Button>
      </Paper>
    </div >
  );
}

export default withRouter(RecoveryPassword);