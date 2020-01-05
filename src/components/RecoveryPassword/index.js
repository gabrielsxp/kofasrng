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
import { FaKey } from 'react-icons/fa';
import { login, setCurrentUser } from '../../services/Auth';
import { withRouter, Link } from 'react-router-dom';
import constants from '../../constants';
import { useDispatch } from 'react-redux';
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
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handleError(message) {
    setError(message);
  }

  async function recoveryPassword() {

    setError(null);

    const data = {
      email
    };

    if (email === '') {
      handleError('Preencha todos os campos !');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/index.php/user?recovery=true', { ...data });
      if (response.data.success) {
        console.log(response.data);
        setLoading(false);
        setSuccess('Nova senha enviada para o email');
        window.setTimeout(() => {
          history.push(constants.autenticar);
        }, 3000);
      } else {
        handleError('Não foi possível alterar a senha');
      }
    } catch (error) {
      handleError('Não foi possível alterar a senha');
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
        <Typography className={classes.item} variant="h6">Recuperar Senha</Typography>
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
        <Button onClick={() => recoveryPassword()} disabled={loading} variant="contained" color="primary">Enviar</Button>
      </Paper>
    </div >
  );
}

export default withRouter(RecoveryPassword);