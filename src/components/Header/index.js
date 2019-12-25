import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import SummonerContainer from '../SummonerContainer/index';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.secondary.main,
        minHeight: '60vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    center: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));


export default function Header() {
    const classes = useStyles();
    return <div className={classes.root}>
        <Grid container className={classes.center}>
            <Grid item xs={10} lg={5} >
                <SummonerContainer />
            </Grid>
        </Grid>
    </div>
}