import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { Link } from 'react-router-dom';
import constants from '../../constants';

const useStyles = makeStyles(theme => ({
    img: {
        borderRadius: '10px',
        padding: '5px',
        width: '100%',
        height: 'auto',
        boxSizing: 'border-box'
    }
}));

export default function Banner({ name, image, slug }) {
    const classes = useStyles();
    console.log(image);
    return <Tooltip title={name}><Link to={`${constants.SUMMON}/${slug}`}>
        <img src={image} alt={name} className={classes.img}></img>
    </Link></Tooltip>
}