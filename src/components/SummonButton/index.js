import React from 'react';
import './style.css';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import constants from '../../constants';

const useStyles = makeStyles(theme => ({
    button: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        width: '200px',
        height: '80px',
        borderRadius: '0 10px 0 10px',
        outline: 'none',
        cursor: 'pointer',
        color: "#fff",
        fontSize: '1.5em',
        boxSizing: 'border-box',
        margin: '10px',
        boxShadow: '5px 3px rgba(0,0,0,0.2)'
    },
    cost: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: '2px 10px',
        maxHeight: '20px',
        width: '125px',
        fontSize: '1rem'
    }
}));

export default function SummonButton({ type, cost, title, summon, disabled }) {
    const classes = useStyles();

    return <button disabled={disabled} onClick={() => summon(type)} className={clsx(
        classes.button,
        type === 'single' ? 'single' :
            type === 'multi' ? 'multi' :
                type === 'free' ? 'free' : 'multi')}>
        {title}
        <span>
            <span className={clsx(classes.cost, type === 'multi' ? 'multiCost' : type === 'single' ? 'singleCost' : 'freeCost')}>
                <img src={`${constants.OTHERS_URL}ruby.webp`} alt={constants.OTHERS_URL + 'ruby'}/>
                <p>x{cost}</p>
            </span>
        </span>
    </button>
}