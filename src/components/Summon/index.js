import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import SummonButton from '../SummonButton/index';
import SummonContainer from '../SummonerContainer/index';
import Grid from '@material-ui/core/Grid';
import CustomMessage from '../CustomMessage/index';
import axios from '../../axios';
import constants from '../../constants';
import { useLocation } from 'react-router';

const useStyles = makeStyles(theme => ({
    alignBanner: {
        display: 'flex',
        justifyContent: 'center'
    },
    section: {
        padding: '80px 0'
    },
    image: {
        margin: '15px 0',
        display: 'block',
        width: '100%',
        height: 'auto'
    },
    actionButtons: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: '15px 10px',
    }
}));

export default function Summon() {
    const classes = useStyles();
    const location = useLocation();
    const [banner, setBanner] = useState('');
    const [fighters, setFighters] = useState([]);
    const [display, setDisplay] = useState(true);
    const [error, setError] = useState(false);

    const getBanner = async () => {

        try {
            const paths = location.pathname.split('/');
            let path = '';
            if (paths.length > 2) {
                path = paths[paths.length - 1];
                console.log(path);
                const response = await axios.get(`/banners/slug/${path}`);
                if (response.data.banner) {
                    setBanner(response.data.banner);
                } else {
                    setError(response.data.error);
                }
            }
        } catch (error) {
            console.log(error);
            setError('');
        }
    }

    const handleClose = () => {
        setError(false);
    }

    const changeDisplay = () => {
        setTimeout(() => {
            setDisplay(true);
        }, constants.FLIP_TIME);
    }

    const preSummon = (type) => {
        setDisplay(false);
        setTimeout(() => {
            makeSummon(type)
        }, constants.PRE_SUMMON_TIME);
    }

    const makeSummon = async (type) => {
        try {
            const response = await axios.get(`/gacha/${type === 'single' ? 'fighter' : 'fighters'}/${banner._id}`);
            if (response.data.fighters) {
                setFighters(response.data.fighters);
                changeDisplay();
            } else {
                setError(response.data.error);
            }
        } catch (error) {
            //setError(error);
        }
    }

    useEffect(() => {
        getBanner();
    }, []);

    return <div>
        {error ? <CustomMessage open={error ? true : false} type="error" message={error} handleClose={handleClose} /> : null}
        <Container className={classes.section}>
            <Typography variant="h4">{banner.name} Summon</Typography>
            <hr />
            <Grid container className={classes.alignBanner}>
                <Grid xs={12} md={6} className={classes.alignBanner}>
                    <img className={classes.image} src={`${banner.createdBy === 'admin' ? constants.BANNER_URL + banner.image : banner.image}`} alt={banner.name} />
                </Grid>
            </ Grid>
            <Grid container className={classes.alignBanner}>
                <Grid item xs={10} lg={6}>
                    <SummonContainer display={display} fighters={fighters} flipped={true} />
                </Grid>
                <Grid xs={12}>
                    <div className={classes.actionButtons}>
                        <SummonButton disabled={!display} summon={preSummon} type="single" title="Summon x1" cost={banner.singleCost} />
                        <SummonButton disabled={!display} summon={preSummon} type="multi" title="Summon x10" cost={(banner.multiCost)} />
                    </div>
                </Grid>
            </Grid>
        </Container>
    </div>
}