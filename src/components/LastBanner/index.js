import React from 'react';
import Container from '@material-ui/core/Container';
import './style.css';
import { makeStyles } from '@material-ui/core/styles';
import constants from '../../contants';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(() => ({
    image: {
        width: '80%',
        height: 'auto'
    },
    imageContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}));

const lastBanner = { title: 'Pretty Banner', image: 'pretty.jpg', slug: 'pretty' };

export default function LastBanner() {
    const classes = useStyles();

    return <div>
        <Container className="last-banner">
            <Link to={constants.SUMMON + lastBanner.slug}>
                <div className={classes.imageContainer}>
                    <img className={classes.image}
                        src={`${constants.BANNER_URL + lastBanner.image}`}
                        alt={lastBanner.title} />
                </div>
            </Link>
        </Container>
    </div>
}