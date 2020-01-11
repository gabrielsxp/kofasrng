import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import SummonButton from '../SummonButton/index';
import SummonContainer from '../SummonerContainer/index';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CustomMessage from '../CustomMessage/index';
import BarChart from '../BarChart/index';
import Loading from '../Loading/index';
import Footer from '../Footer/index';
import axios from '../../axios';
import ShareComponent from '../ShareComponent/index';
import constants from '../../constants';
import { useLocation } from 'react-router';
import { getCurrentUser } from '../../services/Auth/index';

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
    },
    title: {
        padding: '20px'
    },
    container: {
        borderRadius: '5px'
    }
}));

const TOTAL_RUBIES_INDEX = 0;
const TOTAL_BRONZE_INDEX = 1;
const TOTAL_SILVER_INDEX = 2;
const TOTAL_GOLD_INDEX = 3;
const TOTAL_FES_INDEX = 4;
const TOTAL_AS_INDEX = 5;

export default function Summon() {
    const classes = useStyles();
    const location = useLocation();
    const [banner, setBanner] = useState('');
    const [fighters, setFighters] = useState([]);
    const [summon, setSummon] = useState(null);
    const [display, setDisplay] = useState(true);
    const [error, setError] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadRelatory, setLoadRelatory] = useState(false);
    const [totalRubies, setTotalRubies] = useState(null);
    const [fightersRelatory, setFightersRelatory] = useState(null);
    const [stats, setStats] = useState([
        { name: 'Total Rubies Spent: ', value: 0 },
        { name: 'Total Bronze Fighters Collected: ', value: 0 },
        { name: 'Total Silver Fighters Collected: ', value: 0 },
        { name: 'Total Gold Fighters Collected: ', value: 0 },
        { name: 'Total FES Fighters Collected: ', value: 0 },
        { name: 'Total AS Fighters Collected: ', value: 0 },
    ]);

    const getBanner = async () => {
        setLoading(true);
        try {
            const paths = location.pathname.split('/');
            let path = '';
            if (paths.length > 2) {
                path = paths[paths.length - 1];
                const response = await axios.get(`/banners/slug/${path}`);
                if (response.data.banner) {
                    setBanner(response.data.banner);
                    setLoading(false);
                } else {
                    setError(response.data.error);
                    setLoading(false);
                }
            }
        } catch (error) {
            setError(error);
            setLoading(false);
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

    const countOfFighters = (fighters) => {
        var bronze = 0;
        var silver = 0;
        var gold = 0;
        var fes = 0;
        var AS = 0;

        bronze = fighters.reduce((total, fighter) => {
            if (fighter.rarity === 'Bronze') {
                total++;
            }
            return total;
        }, 0);

        silver = fighters.reduce((total, fighter) => {
            if (fighter.rarity === 'Silver') {
                total++;
            }
            return total;
        }, 0);

        gold = fighters.reduce((total, fighter) => {
            if (fighter.rarity === 'Gold') {
                total++;
            }
            return total;
        }, 0);

        fes = fighters.reduce((total, fighter) => {
            if (fighter.isFes) {
                total++;
            }
            return total;
        }, 0);

        AS = fighters.reduce((total, fighter) => {
            if (fighter.isAS) {
                total++;
            }
            return total;
        }, 0);

        return { bronze, silver, gold, fes, as: AS };
    }

    const makeSummon = async (type) => {
        try {
            const response = await axios.get(`/gacha${user ? '/signed/' : '/'}${type === 'single' ? 'fighter' : 'fighters'}/${banner._id}`);
            if (response.data.fighters) {
                setFighters(response.data.fighters);
                setSummon(response.data.summon);
                changeDisplay();
                if (type === 'multi') {
                    let s = [...stats];
                    let { bronze, silver, gold, fes, as } = countOfFighters(response.data.fighters);
                    s[TOTAL_RUBIES_INDEX].value += 900;
                    s[TOTAL_BRONZE_INDEX].value += bronze;
                    s[TOTAL_SILVER_INDEX].value += silver;
                    s[TOTAL_GOLD_INDEX].value += gold;
                    s[TOTAL_FES_INDEX].value += fes;
                    s[TOTAL_AS_INDEX].value += as;
                    setStats([...s]);
                }
                if (type === 'single') {
                    let s = [...stats];
                    let { bronze, silver, gold, fes, as } = countOfFighters(response.data.fighters);
                    s[TOTAL_RUBIES_INDEX].value += 100;
                    s[TOTAL_BRONZE_INDEX].value += bronze;
                    s[TOTAL_SILVER_INDEX].value += silver;
                    s[TOTAL_GOLD_INDEX].value += gold;
                    s[TOTAL_FES_INDEX].value += fes;
                    s[TOTAL_AS_INDEX].value += as;
                    setStats([...s]);
                }
            } else {
                setError(response.data.error);
            }
        } catch (error) {
            setError(error);
        }
    }

    const getRelatory = async () => {
        try {
            const response = await axios.get(`/stats/rubies?days=1&user=${user.username}&banner=${banner._id}`);
            setLoadRelatory(true);
            if (response.data.rubies) {
                let [today] = response.data.rubies;
                setTotalRubies(today.rubies);
                let fResponse = await axios.get(`/stats/fighters?days=1&user=${user.username}&banner=${banner._id}`);
                if (fResponse.data.fighters) {
                    setFightersRelatory([...fResponse.data.fighters]);
                    setLoadRelatory(false);
                } else {
                    setError('Unable to get the fighters relatory');
                    setLoadRelatory(false);
                }
            } else {
                setError('Unable to get today stats');
                setLoadRelatory(false);
            }
        } catch (error) {
            setError(error);
            setLoadRelatory(false);
        }

    }

    useEffect(() => {
        getBanner();
        let us = getCurrentUser();
        if (us) {
            setUser({ ...us });
        }
        console.log(us);
    }, []);

    return <div>
        {
            error && <CustomMessage open={error ? true : false} type="error" message={error} handleClose={handleClose} />
        }
        {
            loading && !banner && <Loading />
        }
        {
            !loading && banner && <Container className={classes.section}>
                <Typography className={classes.title} variant="h4">{banner.name} Summon</Typography>
                <hr />
                <Grid container className={classes.alignBanner}>
                    <Grid xs={12} md={6} className={classes.alignBanner}>
                        <img className={classes.image} src={`${banner.createdBy === 'admin' ? constants.BANNER_URL + banner.image : banner.image}`} alt={banner.name} />
                    </Grid>
                </ Grid>
                <Grid xs={12}>
                    <div className={classes.actionButtons}>
                        <SummonButton disabled={!display} summon={preSummon} type="single" title="Summon x1" cost={banner.singleCost} />
                        <SummonButton disabled={!display} summon={preSummon} type="multi" title="Summon x10" cost={(banner.multiCost)} />
                    </div>
                </Grid>
                <Grid container className={classes.alignBanner}>
                    <Grid item xs={10} lg={6}>
                        {
                            fighters && fighters.length > 0 && <>
                                <SummonContainer display={display} fighters={fighters} flipped={true} />
                                {summon && <ShareComponent dark hasUser={user !== null} summon={summon} />}
                            </>
                        }
                    </Grid>
                    <Grid xs={12} md={6} style={{ margin: '20px' }}>
                        <Typography variant="h6">Your stats</Typography>
                        <div className={classes.container} style={{ borderRadius: '5px 5px 5px 0px', padding: '20px', border: '5px solid #dedede', display: 'flex', flexDirection: 'column' }}>
                            {
                                stats && stats.map((stat, index) => {
                                    return <Typography key={index}>{`${stat.name + stat.value}`}</Typography>
                                })
                            }
                        </div>
                        {
                            user && <Button disabled={loadRelatory} color="primary" variant="contained" onClick={getRelatory} style={{ marginBottom: '20px' }}>{loadRelatory ? 'Generating Relatory' : 'Generate Relatory'}</Button>
                        }
                        {
                            user && totalRubies && fightersRelatory && !loading && <div className={classes.container} style={{ marginTop: '20px', padding: '20px', border: '5px solid #dedede' }}>
                                {
                                    loadRelatory && <Loading />
                                }
                                {
                                    user && totalRubies && !loadRelatory && <Typography variant="h6">Total rubies spent: {totalRubies}</Typography>
                                }
                                {
                                    user && fightersRelatory && !loadRelatory && <BarChart data={fightersRelatory} />
                                }
                            </div>
                        }
                    </Grid>
                </Grid>
            </Container>
        }
        <Footer />
    </div>
}