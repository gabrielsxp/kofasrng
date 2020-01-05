import React, { useEffect, useState } from 'react';
import Banner from '../Banner/index';
import clsx from 'clsx';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
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

    const [filter, setFilter] = useState(0);

    const handleChange = (event) => {
        setFilter(event.target.value);
    }

    const loadBanners = async () => {
        try {
            const response = await axios.get(`${constants.BASE_URL}/all/banners`);
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

    const filterFighters = async () => {
        try {
            const response = await axios.get(`${constants.BASE_URL}/banners?date=${filter}`);
            console.log(response);
        } catch(error){
            console.log(error);
        }
    }

    const classes = useStyles();
    return <Container className={classes.section}>
        <div className={classes.alignCenter}>
            <Typography className={classes.title} variant="h6">Choose the Banner to Pull</Typography>
            <div className={classes.alignFilter}>
                <FormControl className={classes.formControl}>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={filter}
                        onChange={(event) => handleChange(event)}
                    >
                        {
                            filters && filters.map((filter, index) => {
                                return <MenuItem value={index} key={index}>{filters[index]}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
                <FormControl>
                    <Button onClick={() => filterFighters()} className={clsx(classes.button, 'filter-button')}>Filter</Button>
                </FormControl>
            </div>
        </div>
        <hr />
        <Grid container>
            {
                banners && banners.map((banner, index) => {
                    return <Grid key={index} item md={6} lg={4} xs={12}>
                        <Banner name={banner.name} image={banner.createdBy === 'admin' ? constants.BANNER_URL + banner.image : banner.image} slug={banner.slug} />
                    </Grid>
                })
            }
            {
                banners.length === 0 && <div>
                    <Typography>There is no banners to show</Typography>
                </div>
            }
        </Grid>
    </Container>
}