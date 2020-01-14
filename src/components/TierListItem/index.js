import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import constants from '../../constants';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: '100px',
        border: `5px solid ${theme.palette.primary.main}`,
        borderRadius: '5px',
        marginBottom: theme.spacing(2)
    },
    linearFighters: {
        position: 'relative',
        display: 'flex',
        flexWrap: 'nowrap',
        width: '100%',
        padding: '5px',
        zIndex: 0,
        alignItems: 'center'
    },
    card: {
        position: 'relative',
        width: '80px',
        height: '80px',
        zIndex: props => `${10 - props.index}`,
        right: props => `${props.index * 30}px`,
        cursor: 'pointer',
        boxShadow: '7px 7px 5px 0px rgba(50, 50, 50, 0.3)',
        [theme.breakpoints.down('md')]:{
            right: props => `${props.index * 20}px`,
            boxShadow: 'none'
        },
        '&:hover': {
            zIndex: (props) => `${10 + props.index}`
        },
        '&:last-of-type': {
            boxShadow: 'none'
        }
    }
}));

const OverlayCard = (props) => {
    const classes = useStyles(props);
    return <Tooltip title={props.fighter.name + props.fighter.year}><div style={{
        backgroundImage: `url(${constants.FIGHTER_URL + props.fighter.year + '/' + props.fighter.image})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center'
    }} className={classes.card}></div></Tooltip>
}

export default function TierListItem({ fighters, belongsTo }) {
    const classes = useStyles();
    return <div className={classes.root}>
        {belongsTo && <Typography>Created by {belongsTo.username}</Typography>}
        <div className={classes.linearFighters}>
            {
                fighters && fighters.map((fighter, index) => {
                    return <OverlayCard key={index} fighter={fighter} index={index} />
                })
            }
        </div>
    </div>
}