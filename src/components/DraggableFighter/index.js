import React from 'react';
import clsx from 'clsx';
import { useDrag } from 'react-dnd';
import { makeStyles } from '@material-ui/core/styles';
import constants from '../../constants';

const useStyles = makeStyles(theme => ({
    fighter: {
        display: 'inline-block',
        listStyle: 'none',
        minWidth: '80px',
        width: '80px',
        height: '80px',
        cursor: 'grab',
        boxSizing: 'border-box',
        margin: theme.spacing(2),
        zIndex: 0
    },
    grabbingFighter: {
        border: '3px dashed #333',
        borderRadius: '15px',
        cursor: 'grabbing',
        opacity: '0.5'
    }
}));



export default function DraggableFighter({ fighter, index, from }) {
    const classes = useStyles();
    const [{ isDragging }, dragRef] = useDrag({
        item: { type: 'CARD', index, from },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    });
    return fighter && <li
        className={clsx(classes.fighter, { [classes.grabbingFighter]: isDragging })}
        ref={dragRef}
        style={{
            backgroundImage: `url(${constants.FIGHTER_URL + fighter.year + '/' + fighter.image})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundPosition: 'center'
        }}>
    </li>
}