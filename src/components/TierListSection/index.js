import React, { useContext } from 'react';
import TierListContext from '../TierListMaker/context';
import DraggableFighter from '../DraggableFighter/index';
import clsx from 'clsx';
import { useDrop } from 'react-dnd';
import { makeStyles } from '@material-ui/core/styles';
import constants from '../../constants';

const images = ['SSS.webp', 'SS.webp', 'S.webp', 'A.webp', 'B.webp', 'C.webp'];

const useStyles = makeStyles(theme => ({
    list: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        width: '95%',
        boxSizing: 'border-box',
        border: `5px solid ${theme.palette.primary.main}`,
        minHeight: '100px',
        borderRadius: '5px',
        marginBottom: theme.spacing(2),
        [theme.breakpoints.down('md')]: {
            maxHeight: '150px',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            minWidth: '100%'
        },
        '&::before': {
            content: '""',
            backgroundImage: props => {return `url(${constants.OTHERS_URL + images[props.index]})`},
            backgroundSize: 'auto',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            marginLeft: '11px',
            width: '100px',
            height: '100px',
            color: '#fff',
            fontSize: '2rem'
        }
    },
    hovered: {
        border: `5px dashed ${theme.palette.primary.main}`,
        backgroundColor: "#dedede"
    }
}));

export default function TierListSection(props) {
    const classes = useStyles(props);
    const { move } = useContext(TierListContext);

    const [{ hovered }, dropRef] = useDrop({
        accept: 'CARD',
        drop(item, monitor) {
            console.log(item);
            move(item.index, item.from, props.type);
        },
        collect: monitor => {
            return {
                hovered: monitor.isOver()
            }
        }
    });

    return <div ref={dropRef} fighters={props.fighters} className={clsx(classes.list, { [classes.hovered]: hovered })}>
        {
            props.fighters && props.fighters.map((fighter, index) => {
                return <DraggableFighter key={index} fighter={fighter} index={index} from={props.type} />
            })
        }
    </div>
}