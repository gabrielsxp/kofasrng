import React, { useEffect, useState } from 'react';
import Banner from '../Banner/index';
import clsx from 'clsx';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import './style.css';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import CustomMessage from '../CustomMessage/index';
import Loading from '../Loading/index';
import Footer from '../Footer/index';
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
        color: theme.palette.primary.contrastText,
        marginLeft: theme.spacing(2),
        marginTop: '3px'
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
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column'
        }
    },
    title: {
        color: theme.palette.primary.main,
        paddingRight: '15px'
    },
    section: {
        padding: '80px 0px',
        minHeight: '100vh'
    },
    form: {
        [theme.breakpoints.down('xs')]: {
            width: '100%',
            display: 'inline-block',
            marginTop: theme.spacing(2)
        },
        display: 'inline'
    }
}));

export default function BannerSection() {

    const [banners, setBanners] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');

    const loadBanners = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${constants.BASE_URL}/banners/fans`);
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
            const response = await axios.post(`${constants.BASE_URL}/banners/fans/filter`, { name });
            if (response.data.banners) {
                setBanners([...response.data.banners]);
                setLoading(false);
            }
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }

    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    const classes = useStyles();
    return <>
        {error && <CustomMessage type="error" message={error} handleClose={handleClose} open={error ? true : false} />}
        <Container className={classes.section}>
            <div className={classes.alignCenter}>
                <Typography className={classes.title} variant="h6">Choose the Banner to Pull</Typography>
                <div className={classes.alignFilter}>
                    <FormControl className={classes.formControl}>

                    </FormControl>
                    <FormControl className={classes.form}>
                        <TextField
                            id="outlined-textfield"
                            defaultValue="Banner Name, User name"
                            variant="outlined"
                            placeholder="Banner Title"
                            onChange={event => handleNameChange(event)}
                            value={name}
                            size="small"
                        />
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
        <Footer />
    </>
}