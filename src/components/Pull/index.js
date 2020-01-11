import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import CustomMessage from '../CustomMessage/index';
import SummonerContainer from '../SummonerContainer/index';
import Typography from '@material-ui/core/Typography';
import Loading from '../Loading/index';
import axios from '../../axios';
import constants from '../../constants';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import moment from 'moment';

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
        justifyContent: 'center'
    },
    title: {
        color: "#333"
    },
    banner: {
        color: theme.palette.secondary.main,
        textDecoration: 'underline'
    },
    section: {
        padding: '80px 0'
    }
}));

export default function Pull() {
    const classes = useStyles();
    const [summon, setSummon] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const location = useLocation();

    const loadSummon = async () => {
        setLoading(true);
        try {
            console.log(location.pathname);
            const id = location.pathname.split('/')[2];
            console.log(id);

            const response = await axios.get(`/summon/${id}`);
            console.log(response);
            if (response.data.summon) {
                setSummon({ ...response.data.summon });
            } else {
                setError('Unable to get this summon');
            }
            setLoading(false);
        } catch (error) {
            setError('Unable to get this summon');
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSummon();
    }, []);

    const handleClose = () => {
        setError(false);
    }

    return <>
        {
            error && <CustomMessage type="error" open={error ? true : false} handleClose={handleClose} message={error} />
        }
        {
            loading && <Loading />
        }
        {summon && !loading && <Container className={classes.section}>
            <Grid container className={classes.center}>
                <Grid item xs={10} lg={6} >
                    <SummonerContainer display flipped fighters={summon.fighters} />
                    <div className={classes.title} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                            {
                                summon.madeBy && <Typography>Pulled by {summon.madeBy.username} {moment(summon.createdAt).fromNow()}</Typography>
                            }
                            {
                                summon.belongsTo && <Link to={`${constants.SUMMON}/${summon.belongsTo.slug}`}>
                                    <Typography className={classes.banner}>{summon.belongsTo.name}</Typography>
                                </Link>
                            }
                        </div>
                    </div>
                </Grid>
            </Grid>
        </Container>
        }
    </>
}