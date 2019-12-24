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

const fighters = [
    { title: 'Geese Howard XIV', image: 'GeeseXIV_thum.webp', version: 'XIV', rarity: 'fes' },
    { title: 'Chris 97', image: 'Chris97_thum.webp', version: '97', rarity: 'gold' },
    { title: 'Chris 97', image: 'Chris97_thum.webp', version: '97', rarity: 'gold' },
    { title: 'Chris 97', image: 'Chris97_thum.webp', version: '97', rarity: 'gold' },
    { title: 'Chris 97', image: 'Chris97_thum.webp', version: '97', rarity: 'gold' },
    { title: 'Chris 97', image: 'Chris97_thum.webp', version: '97', rarity: 'gold' },
    { title: 'Chris 97', image: 'Chris97_thum.webp', version: '97', rarity: 'gold' },
    { title: 'Chris 97', image: 'Chris97_thum.webp', version: '97', rarity: 'fes' },
    { title: 'Chris 97', image: 'Chris97_thum.webp', version: '97', rarity: 'gold' },
    { title: 'Chris 97', image: 'Chris97_thum.webp', version: '97', rarity: 'gold' },
];

export default function SummonerContainer() {
    const classes = useStyles();
    return <div>
        <Container className="summoner-container">
            <div className={classes.wrapContainer}>
                {
                    fighters && fighters.length > 0 && fighters.map((fighter, index) => {
                        return <FighterCard key={index} fighter={fighter} />
                    })
                }
            </div>
        </Container>
    </div>
}