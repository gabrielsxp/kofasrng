import React, { useContext } from 'react';
import clsx from 'clsx';
import PoolContext from '../PoolContainer/context';
import { useDrop } from 'react-dnd';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    fighterList: {
        width: '100%',
        border: '3px solid #dedede',
        borderRadius: '5px',
        overflow: 'hidden',
        overflowY: 'scroll',
        boxSizing: 'borderBox',
        minHeight: '100px',
        maxHeight: '300px',
        [theme.breakpoints.down('md')]: {
            maxHeight: '200px',
        },
        padding: theme.spacing(2)
    },
    alignEnd: {
        marginLeft: '0px'
    },
    selected: {
        minHeight: '737px',
        maxHeight: '737px'
    },
    hovered: {
        border: `3px solid ${theme.palette.secondary.light}`
    }
}));


export default function DropFighterList(props) {
    const classes = useStyles();

    const { move } = useContext(PoolContext);

    const [{ hovered }, dropRef] = useDrop({
        accept: 'CARD',
        drop(item, monitor) {
            move(item.index, item.from, props.type);
        },
        collect: monitor => {
            return {
                hovered: monitor.isOver()
            }
        }
    });
    return <ul className={
            clsx(
                classes.fighterList, 
                {[classes.alignEnd]: props.alignEnd},
                {[classes.hovered]: hovered }, 
                {[classes.selected]: props.type === 'selected_fighters'})} ref={dropRef}>
        {props.children}
    </ul>
}