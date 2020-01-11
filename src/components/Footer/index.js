import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Logo from '../../images/logo.png';
import constants from '../../constants';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    footer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '25vh',
        padding: '20px',
        textAlign: 'center',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        flexDirection: 'column'
    },
    image: {
        width: '150px',
        height: 'auto',
        marginTop: theme.spacing(2)
    }
}));


export default function Footer() {
    const classes = useStyles();
    return <div className={classes.footer}>
        <Typography>{new Date().getFullYear} King of Fighters All Star Gacha. Disclaimer: We are NOT affiliated with this game, this is a fan site dedicated to the game.</Typography>
        <img className={classes.image} src={Logo} alt="kofas gacha" />
        <Link style={{color: '#fff', marginTop: '20px'}} to={constants.PRIVACY}>Privacy Policy</Link>
    </div>
}