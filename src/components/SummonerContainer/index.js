import React from 'react';
import './style.css';
import Container from '@material-ui/core/Container';
import FighterCard from '../FighterCard/index';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    wrapContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        position: 'relative',
        zIndex: 0,
        margin: '7px 5px',
        boxSizing: 'border-box'
    }
}));

export default function SummonerContainer({fighters, display, flipped}) {
    const classes = useStyles();
    return <div>
        <Container className="summoner-container">
            <div className={classes.wrapContainer}>
                {
                    fighters && fighters.length > 0 && fighters.map((fighter, index) => {
                        return <FighterCard display={display} key={index} fighter={fighter} flipped={flipped} />
                    })
                }
            </div>
        </Container>
    </div>
}