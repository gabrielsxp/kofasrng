import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Loading from '../Loading/index';
import Footer from '../Footer/index';
import CustomMessage from '../CustomMessage/index';
import axios from '../../axios';

const useStyles = makeStyles(theme => ({
    title: {
        margin: `${theme.spacing(2)} 0`
    },
    section: {
        padding: `${theme.spacing(2)}px 0`,
        marginBottom: theme.spacing(2)
    },
    grid: {
        padding: '20px'
    }
}));

export default function Stats() {
    const classes = useStyles();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleClose = () => {
        setError(false);
    }

    const loadStats = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/global/stats');
            if(response.data.stats){
                setStats({...response.data.stats});
            }
            setLoading(false);
        } catch(error){
            setError(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        loadStats();
    }, []);

    return <>
        {
            error && <CustomMessage type="error" message={error} handleClose={handleClose} open={error ? true : false} />
        }
        {
            loading && <Loading />
        }
        {
            stats && !loading && <Container className={classes.section}>
                <Grid container>
                    <Grid item xs={12} className={classes.grid}>
                        <Typography variant="h5" className={classes.title}>Global Statistics</Typography>
                        <hr />
                        <Typography>Total Rubies Spent: {stats.totalRubies}</Typography>
                        <hr/>
                        <Typography>Total Rubies Spent Today: {stats.totalRubiesToday}</Typography>
                        <Typography>Total Gold Fighters Collected Today: {stats.totalGoldToday}</Typography>
                        <Typography>Total Silver Fighters Collected Today: {stats.totalSilverToday}</Typography>
                        <Typography>Total Bronze Fighters Collected Today: {stats.totalBronzeToday}</Typography>
                        <Typography>Total AS Fighters Collected Today: {stats.totalASToday}</Typography>
                        <Typography>Total FES Fighters Collected Today: {stats.totalFesToday}</Typography>
                        <hr/>
                        <Typography>Total Rubies Spent Yesterday: {stats.totalRubiesYesterday}</Typography>
                        <Typography>Total Gold Fighters Collected Yesterday: {stats.totalGoldYesterday}</Typography>
                        <Typography>Total Silver Fighters Collected Yesterday: {stats.totalSilverYesterday}</Typography>
                        <Typography>Total Bronze Fighters Collected Yesterday: {stats.totalBronzeYesterday}</Typography>
                        <Typography>Total AS Fighters Collected Yesterday: {stats.totalASYesterday}</Typography>
                        <Typography>Total FES Fighters Collected Yesterday: {stats.totalFesYesterday}</Typography>
                    </Grid>
                </Grid>
            </Container>
        }
        <Footer />
    </>
}