import React, { useState } from 'react';
import clsx from 'clsx';
import { setCookies } from '../../services/Auth/index';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import constants from '../../constants';

const useStyles = makeStyles(theme => ({
    root: {
        position: 'fixed',
        bottom: '-200px',
        padding: '20px',
        backgroundColor: '#fff',
        boxShadow: '8px 2px 3px rgba(0,0,0,0.5)',
        color: '#333',
        display: 'flex',
        justifyContent: 'space-between',
        borderTop: `5px solid ${theme.palette.primary.main}`
    },
    up: {
        animation: `$up 1.5s ${theme.transitions.easing.easeIn}`,
        animationFillMode: 'forwards'
    },
    down: {
        animation: `$down 1.5s ${theme.transitions.easing.easeOut}`,
        animationFillMode: 'forwards'
    },
    "@keyframes up": {
        "0%": {
            transform: 'translateY(200px)'
        },
        "100%": {
            transform: 'translateY(-200px)'
        }
    },
    "@keyframes down": {
        "0%": {
            transform: 'translateY(-200px)'
        },
        "100%": {
            transform: 'translateY(200px)'
        }
    },
    button: {
        backgroundColor: '#f89f19',
        minWidth: '100px'
    },
    link: {
        color: '#f89f19'
    }
}));

export default function Cookies({ up }) {
    const classes = useStyles({ props: { up } });
    const [show, setShow] = useState(up);

    const changeCookies = () => {
        setCookies();
        setShow(false);
    }

    return <div className={clsx(classes.root, { [classes.up]: show }, { [classes.down]: !show })}>
        <Typography>
            We use cookies to understand how you use our site and to improve your experience.
            This includes personalizing content and advertising.
            By continuing to use our site, you accept our use of cookies,
            revised {<a className={classes.link} href={constants.PRIVACY}>Privacy Policy</a>}
            &nbsp;and <a className={classes.link} href={constants.TERMS}>Terms of Use</a>.
        </Typography>
        <Button onClick={() => changeCookies()} className={classes.button}>I Accept</Button>
    </div>
}