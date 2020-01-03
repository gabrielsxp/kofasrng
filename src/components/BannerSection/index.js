import React, { useEffect, useState } from 'react';
import Banner from '../Banner/index';
import Filter from '../Filter/index';
import './style.css';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import Typography from '@material-ui/core/Typography';
import axios from '../../axios';
import constants from '../../constants';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    button: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.primary.contrastText
    },
    alignCenter: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    alignFilter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    title: {
        color: theme.palette.primary.main,
        paddingRight: '15px'
    },
    section: {
        padding: '80px 10px'
    }
}));

const filters = [
    'This Month',
    'Last Month',
    'Last 3 Months',
    'Last 6 Months'
];

export default function BannerSection() {

    const [banners, setBanners] = useState([]);

    const loadBanners = async () => {
        try {
            const response = await axios.get(`${constants.BASE_URL}/banners`);
            if (response.data.banners) {
                setBanners(response.data.banners);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        loadBanners();
    }, []);

    const classes = useStyles();
    return <Container className={classes.section}>
        <div className={classes.alignCenter}>
            <Typography className={classes.title} variant="h6">Choose the Banner to Pull</Typography>
            <Filter filters={filters}/>
        </div>
        <hr />
        <Grid container>
            {
                banners && banners.map((banner, index) => {
                    return <Grid item md={6} lg={4} xs={12}>
                        <Banner key={index} name={banner.name} image={constants.BANNER_URL + banner.image} slug={banner.slug} />
                    </Grid>
                })
            }
        </Grid>
    </Container>
}