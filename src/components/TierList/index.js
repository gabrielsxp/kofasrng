import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TierListSection from '../TierListSection/index';
import { useLocation } from 'react-router';
import CustomMessage from '../CustomMessage';
import Footer from '../Footer/index';
import Loading from '../Loading/index';
import ShareComponent from '../ShareComponent/index';
import axios from '../../axios';

const useStyles = makeStyles(theme => ({
    buttons: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        height: '100%',
        paddingLeft: theme.spacing(2),
        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(2),
            flexDirection: 'row',
            justifyContent: 'space-between'
        }
    },
    downButton: {
        marginTop: theme.spacing(3),
        [theme.breakpoints.down('md')]: {
            margin: '0'
        }
    },
    title: {
        marginBottom: '20px'
    },
    section: {
        padding: `${theme.spacing(2)}px 0`,
        marginBottom: theme.spacing(2),
        minHeight: '100vh'
    },
    grid: {
        padding: '20px'
    },
    link: {
        textDecoration: 'none'
    },
    center: {
        display: 'flex',
        justifyContent: 'center'
    }
}));

export default function TierList() {
    const classes = useStyles();
    const [tierList, setTierList] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const location = useLocation();

    const loadTierList = async () => {
        setLoading(true);
        const id = location.pathname.split("/").slice(-1)[0];
        console.log(id);
        try {
            const response = await axios.get(`/tierlist/${id}`);
            if (response.data.tierList) {
                setTierList({ ...response.data.tierList });
            } else {
                setError(response.data.error);
            }
            setLoading(false);
        } catch (error) {
            setError('Unable to get the tier list right now');
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTierList();
    }, []);

    const handleClose = () => {
        setError(false);
    }

    return <>
        {
            error && <CustomMessage message={error} type="error" handleClose={handleClose} open={error ? true : false} />
        }
        {
            loading && <Loading />
        }

        <Container className={classes.section}>
            {tierList && !loading && <Grid container>
                <Grid item xs={12} className={classes.grid}>
                    <Typography variant="h5" className={classes.title}>Tier List</Typography>
                    { 
                        tierList.belongsTo && 
                        tierList.createdAt &&  
                        <Typography>Created by {tierList.belongsTo.username} {moment(tierList.createdAt).fromNow()}</Typography> 
                    }
                    <hr />
                    <Grid container className={classes.center}>
                        <Grid item xs={12} md={10}>
                            <ShareComponent tierlist={tierList._id} dark />
                            {
                                tierList.lists && tierList.lists.map((list, index) => {
                                    return <TierListSection disableDrop index={index} fighters={list.fighters} />
                                })
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            }
        </Container>
        <Footer />
    </>
}