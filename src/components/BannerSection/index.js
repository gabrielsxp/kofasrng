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
import CustomMessage from '../CustomMessage/index';
import Loading from '../Loading/index';
import Typography from '@material-ui/core/Typography';
import axios from '../../axios';
import constants from '../../constants';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    select: {
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText
        }
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
        padding: '5px'
    },
    section: {
        padding: '80px 0px'
    }
}));

const filters = [
    'Last Week',
    'Last Month',
    'Last 3 Months',
    'Last 6 Months'
];

export default function BannerSection() {

    const [banners, setBanners] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState(0);

    const handleChange = (event) => {
        setFilter(event.target.value);
    }

    const loadBanners = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${constants.BASE_URL}/all/admin/banners`);
            if (response.data.banners) {
                setBanners([...response.data.banners]);
                setLoading(false);
            }
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }

    const handleClose = () => {
        setError(false);
    }

    useEffect(() => {
        loadBanners();
    }, []);

    const filterFighters = async () => {
        setBanners([]);
        setLoading(true);
        try {
            const response = await axios.get(`${constants.BASE_URL}/banners/filter/${filter}`);
            if (response.data.banners) {
                setBanners([...response.data.banners]);
                setLoading(false);
            }
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }

    const classes = useStyles();
    return <>
        {error && <CustomMessage type="error" message={error} handleClose={handleClose} open={error ? true : false} />}
        <Container className={classes.section}>
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
                                    return <MenuItem className={classes.select} value={index} key={index}>{filters[index]}</MenuItem>
                                })
                            }
                        </Select>
                    </FormControl>
                    <FormControl>
                        <Button disabled={loading} onClick={() => filterFighters()} className={clsx(classes.button, 'filter-button')}>Filter</Button>
                    </FormControl>
                </div>
            </div>
            <hr />
            <Grid container >
                {
                    loading && <Loading />
                }
                {
                    banners && !loading && banners.map((banner, index) => {
                        return <Grid key={index} item md={6} lg={4} xs={12}>
                            <Banner name={banner.name} image={banner.createdBy === 'admin' ? constants.BANNER_URL + banner.image : banner.image} slug={banner.slug} />
                        </Grid>
                    })
                }
                {
                    banners.length === 0 && !loading && <div>
                        <Typography>There is no banners to show</Typography>
                    </div>
                }
            </Grid>
        </Container>
    </>
}