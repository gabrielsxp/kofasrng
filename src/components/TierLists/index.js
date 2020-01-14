import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Loading from '../Loading/index';
import Button from '@material-ui/core/Button';
import TierListItem from '../TierListItem/index';
import CustomMessage from '../CustomMessage/index';
import {Link} from 'react-router-dom';
import constants from '../../constants';
import axios from '../../axios';

const useStyles = makeStyles(theme => ({
    root: {
        padding: '20px',
    },
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
        marginBottom: theme.spacing(2)
    },
    grid: {
        padding: '20px'
    },
    link: {
        textDecoration: 'none'
    }
}));

export default function TierList() {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [lists, setLists] = useState(null);

    const loadLists = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/tierlists');
            if (response.data.tierLists) {
                let lists = response.data.tierLists;
                setLists([...lists]);
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
        loadLists();
    }, []);

    return <>
        {error && <CustomMessage message={error} type="error" handleClose={handleClose} open={error ? true : false} />}
        <Container className={classes.root}>
            <Grid container className={classes.section}>
                <Grid item xs={12}>
                    <Typography className={classes.title} variant="h5">Last Tier Lists Created Today</Typography>
                </Grid>
                {
                    loading && <Loading />
                }
                {
                    lists && lists.length === 0 && <Typography variant="h6">There is no tier lists to show right now</Typography>
                }
                {
                    lists && !loading && lists.map((list, index) => {
                        return <><Grid item xs={12} md={9} key={index}>
                            <TierListItem fighters={list.fighters} belongsTo={list.belongsTo} index={0} />
                        </Grid>
                            <Grid item xs={12} md={3} className={classes.buttons}>
                                <Link className={classes.link} to={constants.TIER_LIST_LAYOUT + list._id}>
                                    <Button variant="contained" color="primary">Use this Layout</Button>
                                </Link>    
                                <Link className={classes.link} to={constants.TIER_LIST + list._id}>
                                    <Button className={classes.downButton} variant="contained" color="secondary">See More</Button>
                                </Link>
                            </Grid>
                        </>
                    })
                }
            </Grid>
        </Container>
    </>
}