import React from 'react';
import './style.css';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import constants from '../../contants';

const useStyles = makeStyles(theme => ({
    fighter: {
        [theme.breakpoints.down('sm')]: {
            width: '60px',
            height: '60px',
        },
        [theme.breakpoints.down('md')]: {
            width: '80px',
            height: '80px',
            flex: '1 0 15.3%'
        },
        flex: '1 0 17%',
        margin: '15px 5px',
        width: '110px',
        height: '110px',
        boxSizing: 'border-box',
        cursor: 'pointer'
    }
}));

export default function FighterCard({ fighter }) {
    const classes = useStyles();
    return fighter && <>
        <Tooltip title={fighter.title} aria-label={fighter.title}>
        <span className={clsx(classes.fighter, fighter.rarity === 'fes' ? 'fighter-box' : null)} style={{
        backgroundImage: `url(${constants.FIGHTER_URL + fighter.image})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        borderRadius: '5px'
    }}></span></Tooltip></>
}