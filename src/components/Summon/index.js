import React, { useEffect, useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import SummonButton from '../SummonButton/index';
import SummonContainer from '../SummonerContainer/index';
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';
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
import IconButton from '@material-ui/core/IconButton';
import { FaTimes } from 'react-icons/fa';

const useStyles = makeStyles(theme => ({
    alignBanner: {
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'column'
    },
    section: {
        padding: '80px 0',
        minHeight: '100vh'
    },
    image: {
        margin: '15px 0',
        display: 'block',
        width: '100%',
        height: 'auto',
        border: `5px solid ${theme.palette.secondary.main}`,
        borderRadius: '5px'
    },
    actionButtons: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: '15px 10px',
    },
    title: {
        padding: '0px'
    },
    container: {
        borderRadius: '5px 5px 5px 0px',
        padding: '20px',
        border: '5px solid #dedede',
        display: 'flex',
        flexDirection: 'column',
        marginTop: '15px'
    },
    justify: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    ratesButton: {
        backgroundColor: green[500],
        color: theme.palette.primary.contrastText,
        '&:hover': {
            backgroundColor: green[700]
        }
    },
    rateDescribe: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px'
    },
    ratesDescribeVertical: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: '20px'
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
    const [openRates, setOpenRates] = useState(false);
    const [stats, setStats] = useState([
        { name: 'Total Rubies Spent: ', value: 0 },
        { name: 'Total Bronze Fighters Collected: ', value: 0 },
        { name: 'Total Silver Fighters Collected: ', value: 0 },
        { name: 'Total Gold Fighters Collected: ', value: 0 },
        { name: 'Total FES Fighters Collected: ', value: 0 },
        { name: 'Total AS Fighters Collected: ', value: 0 },
    ]);
    const [rates, setRates] = useState(null);

    const getFightersRates = async (bannerId, rates) => {
        try {
            const response = await axios.get(`/fighters/banner/${bannerId}`);
            if (response.data.fighters) {
                setRates({
                    ...response.data.fighters,
                    ...rates
                });
            }
        } catch (error) {
            setError(error);
        }
    }

    const getBanner = async () => {
        setLoading(true);
        try {
            const paths = location.pathname.split('/');
            let path = '';
            if (paths.length > 2) {
                path = paths[paths.length - 1];
                const response = await axios.get(`/banners/described/${path}`);
                if (response.data.banner) {
                    await getFightersRates(response.data.banner._id, response.data.rates, response.data.numberOfFighters);
                    setBanner({
                        ...response.data.banner,
                        total: { ...response.data.numberOfFighters }
                    });
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

    const handleOpenRates = () => {
        setOpenRates(!openRates);
    }

    const getRelatory = async () => {
        try {
            const response = await axios.get(`/stats/rubies?days=1&user=${user._id}&banner=${banner._id}`);
            setLoadRelatory(true);
            if (response.data.rubies) {
                console.log(response.data.rubies);
                let [today] = response.data.rubies;
                setTotalRubies(today.rubies);
                let fResponse = await axios.get(`/stats/fighters?days=1&user=${user._id}&banner=${banner._id}`);
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
        window.scrollTo(0, 0);
        getBanner();
        let us = getCurrentUser();
        if (us) {
            setUser({ ...us });
        }
    }, []);

    const Rates = () => {
        return <Drawer anchor="left" open={openRates} onClose={handleOpenRates}>
            <>
                {
                    loading && <Loading />
                }
                {
                    banner && rates && <div style={{ width: '100%', boxSizing: 'border-box', padding: '20px', overflowY: 'auto' }}>
                        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h5">Rates</Typography>
                            <IconButton onClick={() => handleOpenRates()}>
                                <FaTimes />
                            </IconButton>
                        </div>
                        <hr />
                        <div className={classes.rateDescribe}>
                            <img src={`${constants.BRONZE_URL}`} alt="Bronze" />
                            <div style={{ marginLeft: '20px' }}>
                                <Typography>{`Total Bronze fighters: ${banner.total.bronze}`}</Typography>
                                <Typography >{`Total Probability ${banner.rates[1] - banner.rates[0]}%`}</Typography>
                                {
                                    rates.bronze && <Typography>{`Each bronze fighter has ${rates.bronze.toFixed(3)}%`}</Typography>
                                }
                            </div>
                        </div>
                        <div className={classes.rateDescribe}>
                            <img src={`${constants.SILVER_URL}`} alt="Silver" />
                            <div style={{ marginLeft: '20px' }}>
                                <Typography>{`Total Silver fighters: ${banner.total.silver}`}</Typography>
                                <Typography >{`Total Probability ${banner.rates[2] - banner.rates[1]}%`}</Typography>
                                {
                                    rates.silver && <Typography>{`Each Silver fighter has ${rates.silver.toFixed(3)}%`}</Typography>
                                }
                            </div>
                        </div>
                        <div className={classes.rateDescribe}>
                            <img src={`${constants.BRONZE_URL}`} alt="Gold" />
                            <div style={{ marginLeft: '20px' }}>
                                <Typography>{`Total Gold fighters: ${banner.total.gold}`}</Typography>
                                <Typography >{`Total Probability ${banner.rates[3] - banner.rates[2]}%`}</Typography>
                                {
                                    rates.gold && <Typography>{`Each Gold fighter has ${rates.gold.toFixed(3)}%`}</Typography>
                                }
                            </div>
                        </div>
                        {rates.fes.length > 0 && <Typography variant="h6">FES Fighters</Typography>}
                        <hr />
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {
                                rates.fes && rates.fes.map((rate, index) => {
                                    return <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div className={classes.rateDescribe}>
                                            <Tooltip title={rate.name}><div style={{
                                                backgroundImage: `url(${constants.FIGHTER_URL + rate.year + '/' + rate.image})`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundSize: 'contain',
                                                backgroundPosition: 'center',
                                                marginRight: '20px',
                                                marginBottom: '20px',
                                                width: '80px',
                                                height: '80px'
                                            }}></div></Tooltip>
                                            {
                                                index === 0 && <Typography
                                                    style={{ marginRight: '20px' }}>
                                                    {`Has ${banner.fesRates[index].rate.toFixed(3)}% of chance`}
                                                </Typography>
                                            }
                                            {
                                                index > 0 && <Typography
                                                    style={{ marginRight: '20px' }}>
                                                    {`Has ${(banner.fesRates[index].rate - banner.fesRates[index - 1].rate).toFixed(3)}% of chance`}
                                                </Typography>
                                            }
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                        {rates.as.length > 0 && <Typography variant="h6">ALL Star Fighters</Typography>}
                        <hr />
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {
                                rates.as && rates.as.map((rate, index) => {
                                    return <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div className={classes.rateDescribe}>
                                            <Tooltip title={rate.name}><div style={{
                                                backgroundImage: `url(${constants.FIGHTER_URL + rate.year + '/' + rate.image})`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundSize: 'contain',
                                                backgroundPosition: 'center',
                                                marginRight: '20px',
                                                marginBottom: '20px',
                                                width: '80px',
                                                height: '80px'
                                            }}></div></Tooltip>
                                            {
                                                index === 0 && <Typography
                                                    style={{ marginRight: '20px' }}>
                                                    {`Has ${banner.asRates[index].rate.toFixed(3)}% of chance`}
                                                </Typography>
                                            }
                                            {
                                                index > 0 && <Typography
                                                    style={{ marginRight: '20px' }}>
                                                    {`Has ${(banner.asRates[index].rate - banner.asRates[index - 1].rate).toFixed(3)}% of chance`}
                                                </Typography>
                                            }
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                }
            </>
        </Drawer>
    }

    return <>
        {
            error && <CustomMessage open={error ? true : false} type="error" message={error} handleClose={handleClose} />
        }
        {
            loading && !banner && <Loading />
        }
        <Container className={classes.section}>
            {
                banner && !loading && <>
                    {rates && <Rates />}
                    <div style={{ width: '100%', padding: '20px' }}>
                        <Typography className={classes.title} variant="h4">{banner.name} Summon</Typography>
                        <div className={classes.justify}>
                            <ShareComponent banner={banner.slug} dark />
                            {loading && <Loading />}
                            {rates && <Button onClick={() => handleOpenRates()} className={classes.ratesButton}>Rates</Button>}
                        </div>
                        <hr />
                    </div>
                    <Grid container>
                        <Grid item xs={12} md={6} className={classes.alignBanner}>
                            <img className={classes.image} src={`${banner.createdBy === 'admin' ? constants.BANNER_URL + banner.image : banner.image}`} alt={banner.name} />
                            {
                                fighters && fighters.length > 0 && <>
                                    <SummonContainer display={display} fighters={fighters} flipped={true} />
                                    {summon && <ShareComponent dark hasUser={user !== null} summon={summon} />}
                                </>
                            }
                            <div className={classes.actionButtons}>
                                <SummonButton disabled={!display} summon={preSummon} type="single" title="Summon x1" cost={banner.singleCost} />
                                <SummonButton disabled={!display} summon={preSummon} type="multi" title="Summon x10" cost={(banner.multiCost)} />
                            </div>
                        </Grid>
                        <Grid item xs={12} md={5} style={{ marginLeft: '20px' }}>
                            <div className={classes.container}>
                                {
                                    stats && stats.map((stat, index) => {
                                        return <Typography key={index}>{`${stat.name + stat.value}`}</Typography>
                                    })
                                }
                                {
                                    user && <Button
                                        disabled={loadRelatory}
                                        color="primary"
                                        variant="contained"
                                        onClick={getRelatory}
                                        style={{ margin: '20px 0' }}>
                                        {loadRelatory ? 'Generating Relatory' : 'Generate Relatory'}
                                    </Button>
                                }
                            </div>
                        </Grid>
                    </ Grid>
                    <Grid container>
                        <Grid item xs={12}>
                            {
                                loadRelatory && <Loading />
                            }
                            {
                                !loadRelatory && <div>
                                    {
                                        user && totalRubies && fightersRelatory && !loading && <div className={classes.container} style={{ minHeight: '50vh' }}>
                                            {
                                                user && totalRubies && !loadRelatory && <Typography variant="h6" style={{ textAlign: 'center', marginBottom: '20px' }}>Total rubies spent: {totalRubies}</Typography>
                                            }
                                            {
                                                user && fightersRelatory && !loadRelatory && <BarChart data={fightersRelatory} />
                                            }
                                        </div>
                                    }
                                </div>
                            }
                        </Grid>
                    </Grid>
                </>
            }
        </Container>
        <Footer />
    </>
}