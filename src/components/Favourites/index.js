import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import SummonerContainer from '../SummonerContainer/index';
import Loading from '../Loading/index';
import CustomMessage from '../CustomMessage/index';
import axios from '../../axios';
import constants from '../../constants';
import ShareComponent from '../ShareComponent/index';
import { FaTimes } from 'react-icons/fa';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    summons: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    center: {
        display: 'flex',
        justifyContent: 'center'
    },
    summonWrapper: {
        marginBottom: theme.spacing(2)
    },
    banner: {
        color: theme.palette.secondary.main,
        textDecoration: 'underline'
    },
    title: {
        marginBottom: `${theme.spacing(2)}px`
    },
    section: {
        padding: `${theme.spacing(2)}px 0`,
        marginBottom: theme.spacing(2)
    },
    grid: {
        padding: '20px'
    }
}));

export default function Favourites() {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [tops, setTops] = useState(null);

    const getTops = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/favourites');
            if (response.data.favourites) {
                setTops([...response.data.favourites.summons]);
            } else {
                setError('Unable to get the best summons');
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError('Unable to get the best summons');
        }
    }

    const handleRemove = async (index) => {
        setLoading(true);
        try {
            const response = await axios.delete(`/favourites/${tops[index]._id}`);
            console.log(response);
            if (response.data.summons) {
                setTops([...response.data.summons]);
            } else {
                setError(response.data.error);
            }
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }

    const handleClose = () => {
        setError(false);
    }

    useEffect(() => {
        getTops();
    }, []);

    return <>
        {
            error && <CustomMessage open={error ? true : false} handleClose={handleClose} type="error" message={error} />
        }
        {
            loading && <Loading />
        }
        {
            !loading && <Container className={classes.section}>
                <Grid container>
                    <Grid item xs={12} className={classes.grid}>
                        <Typography variant="h5" className={classes.title}>Favourites Summons</Typography>
                        {
                            tops && tops.length === 0 && <Typography variant="h6">You do not saved any Summon yet</Typography>
                        }
                        <Grid container className={classes.center}>
                            <Grid item xs={10} lg={6}>
                                {
                                    tops && tops.map((summon, index) => {
                                        return <div className={classes.summonWrapper}>
                                            <ShareComponent dark summon={summon._id} />
                                            <SummonerContainer display flipped fighters={summon.fighters} key={index} />
                                            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                                                {
                                                    summon.madeBy && <Typography>Pulled by {summon.madeBy.username} {moment(summon.createdAt).fromNow()}</Typography>
                                                }
                                                {
                                                    summon.belongsTo && <Link to={`${constants.SUMMON}/${summon.belongsTo.slug}`}>
                                                        <Typography className={classes.banner}>{summon.belongsTo.name}</Typography>
                                                    </Link>
                                                }
                                                {
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                                                        <Tooltip title="Remove this Favorite">
                                                            <IconButton onClick={() => handleRemove(index)} style={{ marginLeft: '10px' }}>
                                                                <FaTimes />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    })
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        }
    </>
}