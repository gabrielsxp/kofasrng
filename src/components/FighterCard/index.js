import React from 'react';
import './style.css';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import constants from '../../constants';

const useStyles = makeStyles(theme => ({
    fighter: {
        [theme.breakpoints.down('sm')]: {
            flex: '1 0 14%',
            width: '50px',
            height: '50px',
            margin: '10px 5px'
        },
        [theme.breakpoints.down('md')]: {
            width: '80px',
            height: '80px',
            flex: '1 0 16%'
        },
        flex: '1 0 17%',
        margin: '15px 5px',
        width: '80px',
        height: '80px',
        boxSizing: 'border-box',
        cursor: 'pointer'
    }
}));

export default function FighterCard({ fighter, display, flipped  }) {
    const classes = useStyles();

    return fighter && <>
        <Tooltip title={`${fighter.name} ${fighter.year}`} aria-label={fighter.name}>
        <div className={clsx(
            classes.fighter,
            'fighter-card',
            flipped ? (fighter.rarity === 'Gold' && fighter.isFes ? 'fighter-box-fes' : 
            fighter.rarity === 'Gold' && !fighter.isFes ? 'fighter-box-gold' : null) : null)}>
        <div className={display ? 'content flip' : 'content'}>
            <div className="back" style={{
        backgroundImage: `url(${constants.FIGHTER_URL + fighter.year + '/' + fighter.image})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center'
    }}></div>
            <div className="front" style={{
        backgroundImage: `url(${constants.FIGHTER_URL}summon/${
            fighter.rarity === 'Bronze' ? 'blue.webp' : 
            fighter.rarity === 'Silver' ? 'yellow.webp' : 
            fighter.rarity === 'Gold' && !fighter.isFes ? 'red.webp' : 'purple.webp'})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        borderRadius: '15px!important'
    }}></div>
        </div>
    </div></Tooltip></>
}