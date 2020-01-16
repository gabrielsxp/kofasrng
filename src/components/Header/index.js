import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CustomMessage from '../CustomMessage/index';
import SummonerContainer from '../SummonerContainer/index';
import Typography from '@material-ui/core/Typography';
import Loading from '../Loading/index';
import axios from '../../axios';
import constants from '../../constants';
import ShareComponent from '../ShareComponent/index';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.secondary.main,
        minHeight: '60vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '60px 0px',
    },
    center: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: theme.palette.primary.contrastText
    },
    banner: {
        color: theme.palette.primary.contrastText,
        textDecoration: 'underline'
    },
    item1: {
        order: 1,
        [theme.breakpoints.down('md')]: {
            order: 2
        }
    },
    item2: {
        order: 2,
        width: '100%',
        [theme.breakpoints.down('md')]: {
            order: 1
        }
    }
}));

export default function Header() {
    const [fighters, setFighters] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [summon, setSummon] = useState(null);
    const [banner, setBanner] = useState(null);

    const handleClose = () => {
        setError(false);
    }

    const getLuckiestSummon = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${constants.BASE_URL}/luckiest/summon`);
            console.log(response);
            if (response.data.summon) {
                setSummon(response.data.summon._id);
                let fighters = response.data.summon.fighters;
                if (response.data.summon.madeBy) {
                    let user = response.data.summon.madeBy.username;
                    setUser(user);
                }
                if (response.data.summon.belongsTo) {
                    let banner = {
                        name: response.data.summon.belongsTo.name,
                        slug: response.data.summon.belongsTo.slug
                    };
                    setBanner(banner);
                }
                setFighters([...fighters]);
            } else {
                setFighters(null);
            }
            setLoading(false);
        } catch (error) {
            setError(error);
            Loading(false);
        }
    }

    useEffect(() => {
        getLuckiestSummon();
    }, []);

    const classes = useStyles();
    return <>
        {
            error && <CustomMessage message={error} handleClose={handleClose} open={error ? true : false} type="error" />
        }
        {
            loading && <Loading />
        }
        {
            !loading && <div className={classes.root} >
                <Typography className={classes.title} variant="h5">Luckiest Summon of today</Typography>
                <Typography style={{ color: "#fff", padding: '20px', textAlign: 'center' }}>* Updates every 10 minutes and only includes Pulls from Banners of the section below</Typography>
                <Grid container className={classes.center}>
                    {
                        fighters !== null && fighters.length > 0 && <Grid item xs={10} lg={6}>
                            {summon && <ShareComponent hasUser={user !== null} summon={summon} />}
                            <SummonerContainer display flipped fighters={fighters} />
                            <Grid container>
                                <Grid item xs={12}>
                                    <div className={classes.title} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                                            {
                                                user && <Typography>Pulled by {user}</Typography>
                                            }
                                            {
                                                banner && <Link to={`${constants.SUMMON}/${banner.slug}`}>
                                                    <Typography className={classes.banner}>{banner.name}</Typography>
                                                </Link>
                                            }
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    }
                    {
                        fighters !== null && fighters.length === 0 && <Typography className={classes.title}>No pull were made today</Typography>
                    }
                    {
                        fighters === null && <Typography className={classes.title}>No pull were made today</Typography>
                    }
                </Grid>
            </div>
        }
    </>
}