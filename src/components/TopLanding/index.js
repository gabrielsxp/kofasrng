import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import SummonerContainer from '../SummonerContainer/index';
import Loading from '../Loading/index';
import CustomMessage from '../CustomMessage/index';
import axios from '../../axios';
import constants from '../../constants';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    summons: {
        display: 'flex',
        flexWrap: 'wrap',
        margin: theme.spacing(2)
    },
    center: {
        display: 'flex',
        justifyContent: 'center'
    },
    section: {
        padding: '80px 0px'
    },
    title: {
        color: theme.palette.primary.main,
        padding: '5px'
    },
    summonWrapper: {
        marginBottom: theme.spacing(2)
    },
    banner: {
        color: theme.palette.secondary.main,
        textDecoration: 'underline'
    }
}));

export default function TopLanding() {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [tops, setTops] = useState(null);

    const getTops = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/top/summons?limit=${constants.NUMBER_OF_SUMMONS_ON_TOP}`);
            console.log(response);
            if (response.data.summons) {
                setTops([...response.data.summons]);
            } else {
                setError('Unable to get the best summons');
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError('Unable to get the best summons');
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
            tops && !loading && <Container className={classes.section}>
                <Grid container className={classes.center}>
                    <Grid item xs={12}>
                        <Typography variant="h6" className={classes.title}>Top Summons of Today</Typography>
                        <hr />
                        {
                            tops && tops.length === 0 && <>
                                <Typography style={{ marginTop: '20px' }} variant="h6">No summons were made today</Typography>
                            </>
                        }
                    </Grid>
                    {
                        tops && tops.map((summon, index) => {
                            return <Grid item xs={12} lg={5} className={classes.summons}>
                                <div className={classes.summonWrapper}>
                                    <SummonerContainer display fighters={summon.fighters} key={index} />
                                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                                        {
                                            summon.madeBy && <Typography>Pulled by {summon.madeBy.username}</Typography>
                                        }
                                        {
                                            summon.belongsTo && <Link to={`${constants.SUMMON}/${summon.belongsTo.slug}`}>
                                                <Typography className={classes.banner}>{summon.belongsTo.name}</Typography>
                                            </Link>
                                        }
                                    </div>
                                </div>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>
}
    </>
}