import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import BootstrapInput from '../BootstrapInput/index';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import ArrowRight from '@material-ui/icons/ArrowRightAltRounded';
import Tooltip from '@material-ui/core/Tooltip';
import Loading from '../Loading/index';
import axios from '../../axios';
import constants from '../../constants';
import { Link } from 'react-router-dom';

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
    },
    space: {
        marginBottom: '20px'
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alilgnItems: 'center'
    },
    centerize: {
        display: 'flex',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: 'auto',
        boxSizing: 'border-box'
    },
    slider: {
        width: '90%',
        marginBottom: '20px',
        padding: '20px',
        boxSizing: 'border-box'
    },
    buttonWrapper: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: '20px'
    },
    stepper: {
        marginRight: '20px',
        width: '44px',
        height: '30px',
        marginBottom: '20px'
    },
    arrowStepper: {
        width: '40px',
        height: '40px',
        marginRight: '20px',
        color: theme.palette.primary.main
    },
    fighter: {
        width: '80px',
        height: '80px'
    },
    ratesWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: '20px'
    }
}));

export default function BannerContainer() {
    const [loading, setLoading] = useState(false);
    const [loadPool, setLoadPools] = useState(false);
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [pools, setPools] = useState([]);
    const [poolIndex, setPoolIndex] = useState(0);
    const [hasFes, setHasFes] = useState(false);
    const [fesFighters, setFesFighters] = useState([]);
    const [fesRates, setFesRates] = useState([]);
    const globalRates = {
        value: [0, 19, 93, 99], max: 99, min: 0
    };
    const [rates, setRates] = useState({ ...globalRates });
    const [fesMaxRates, setFesMaxRates] = useState(0);

    const loadPools = async () => {
        try {
            setLoading(true);
            setLoadPools(true);
            const response = await axios.get(`${constants.BASE_URL}/defaultPool`, {
                headers: {
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTA1NGEyYWUzNjkyNDQ0NDA4NjJmMWMiLCJpYXQiOjE1Nzc4OTc3NzJ9.f-lOe5ER2sSUBzLez6rZHb0vEZcGMSV9jdUEY_-H0m0'
                }
            });
            let pools = response.data.defaultPools;
            if (pools) {
                setPools([...pools]);
                setLoadPools(false);
                const res = await axios.get(`${constants.BASE_URL}/defaultPool/${pools[poolIndex]._id}`, {
                    headers: {
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTA1NGEyYWUzNjkyNDQ0NDA4NjJmMWMiLCJpYXQiOjE1Nzc4OTc3NzJ9.f-lOe5ER2sSUBzLez6rZHb0vEZcGMSV9jdUEY_-H0m0'
                    }
                });
                const fighters = res.data.defaultPool.fighters;
                const fesFighters = fighters.filter(fighter => fighter.isFes);
                const hasFes = fesFighters.length > 0;
                let dist = rates.value[rates.value.length - 1] - rates.value[rates.value.length - 2];
                if (hasFes) {
                    let fesRates = fesFighters.map((_, index) => (dist * (index)) / (fesFighters.length));
                    setFesRates([...fesRates]);
                }

                setFesFighters([...fesFighters]);
                setHasFes(hasFes);
                setFesMaxRates(rates.value[rates.value.length - 1] - rates.value[rates.value.length - 2]);
                setLoading(false);
            } else {
                setLoading(false);
                setLoadPools(false);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            setLoadPools(false);
        }
    }

    const handleFesRateSlide = (value) => {
        setFesRates(value);
    }

    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    const handleImageChange = (event) => {
        setImage(event.target.value);
    }

    const handleChangeSelection = (event) => {
        setPoolIndex(event.target.value);
    }

    const handleRateSlide = (value) => {
        setRates({ ...rates, value });
        if (value) {
            setFesMaxRates(value[value.length - 1] - value[value.length - 2]);
        }
    }

    const resetInputs = () => {
        let dist = globalRates.value[globalRates.value.length - 1] - globalRates.value[globalRates.value.length - 2];
        setRates({ ...globalRates });
        if (hasFes) {
            let fesRates = fesFighters.map((fighter, index) => (dist * (index)) / (fesFighters.length));
            setFesRates([...fesRates]);
            setFesMaxRates(dist);
        }
        setName('');
        setImage('');
    }

    useEffect(() => {
        loadPools();
    }, [poolIndex]);

    const classes = useStyles();
    return <>
        {
            pools && pools.length > 0 ? <Container className={classes.section}>
                <Grid container>
                    <Grid item xs={12} md={6} className={classes.grid}>
                        <FormGroup>
                            <FormControl className={classes.space}>
                                <Typography className={classes.title} variant="h5">Create Banner</Typography>
                                <TextField size="small" style={{ margin: '15px 0' }} helperText="Must contain at least 6 characters" id="standard-basic" label="Pool Name" variant="outlined" onChange={(event) => handleNameChange(event)} value={name} />
                            </FormControl>
                            <FormControl className={classes.space}>
                                {
                                    pools && <>
                                        <InputLabel htmlFor="pool-select-label-id">Pool of the Banner</InputLabel>
                                        <Select
                                            labelId="pool-select-label-id"
                                            id="pool-select-label"
                                            input={<BootstrapInput />}
                                            value={poolIndex}
                                            onChange={(event) => handleChangeSelection(event)}
                                            className={classes.select}
                                        >
                                            {
                                                pools && pools.map((pool, index) => {
                                                    return <MenuItem key={index} value={index}>{pool.name}</MenuItem>
                                                })
                                            }
                                        </Select></>
                                }
                            </FormControl>
                            <FormControl className={classes.space}>
                                <TextField size="small" style={{ margin: '15px 0' }} id="image-anchor-field" label="Image Link" variant="outlined" onChange={(event) => handleImageChange(event)} value={image} />
                            </FormControl>
                            <FormControl>
                                <Typography variant="h6" style={{ marginBottom: '20px' }}>Set Fighter Rates</Typography>
                                <div style={{ width: '100%', display: 'flex', marginBottom: '50px', justifyContent: 'space-between' }}>
                                    <img className={classes.stepper} src={`${constants.BRONZE_URL}`} alt="Bronze" />
                                    <ArrowRight className={classes.arrowStepper} />
                                    <img className={classes.stepper} src={`${constants.SILVER_URL}`} alt="Silver" />
                                    <ArrowRight className={classes.arrowStepper} />
                                    <img className={classes.stepper} src={`${constants.GOLD_URL}`} alt="Gold" />
                                </div>
                                <Slider
                                    value={rates.value}
                                    onChange={(_, newValue) => handleRateSlide(newValue)}
                                    aria-labelledby="range-slider"
                                    valueLabelDisplay="on"
                                    step={1}
                                    className={classes.slider}
                                    max={rates.max}
                                    min={rates.min}
                                />
                                <FormControl>
                                    {
                                        rates && <>
                                            <FormControl className={classes.ratesWrapper}>
                                                <div className={classes.centerize}>
                                                    <img className={classes.stepper} src={`${constants.BRONZE_URL}`} alt="Bronze" />
                                                    <Typography>{(rates.value[1] - rates.value[0]) + '%'}</Typography>
                                                </div>
                                                <div className={classes.centerize}>
                                                    <img className={classes.stepper} src={`${constants.SILVER_URL}`} alt="Bronze" />
                                                    <Typography>{(rates.value[2] - rates.value[1]) + '%'}</Typography>
                                                </div>
                                                <div className={classes.centerize}>
                                                    <img className={classes.stepper} src={`${constants.GOLD_URL}`} alt="Bronze" />
                                                    <Typography>{(rates.value[3] - rates.value[2]) + '%'}</Typography>
                                                </div>
                                            </FormControl>
                                        </>
                                    }
                                </FormControl>
                            </FormControl>
                            {
                                loading && <Loading />
                            }
                            {
                                hasFes && <><FormControl style={{ marginTop: '10px' }}>
                                    <Typography variant="h6" style={{ marginBottom: '20px' }}>Set FES Fighters Rates</Typography>
                                    <div style={{ width: '100%', display: 'flex', marginBottom: '50px', justifyContent: 'flex-start' }}>
                                        {
                                            fesFighters && fesFighters.length > 0 && fesFighters.map((fighter, index) => {
                                                return <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Tooltip title={fighter.name}><div className={classes.fighter} style={{
                                                        backgroundImage: `url(${constants.FIGHTER_URL + fighter.year + '/' + fighter.image})`,
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundSize: 'contain',
                                                        backgroundPosition: 'center',
                                                        marginRight: '20px'
                                                    }}></div></Tooltip>
                                                    {fesFighters.length > 1 && index !== fesFighters.length - 1 && <ArrowRight className={classes.arrowStepper} style={{ marginRight: '20px' }} />}
                                                </div>
                                            })
                                        }
                                    </div>
                                    {
                                        <Slider
                                            value={fesRates}
                                            onChange={(_, newValue) => handleFesRateSlide(newValue)}
                                            aria-labelledby="range-slider"
                                            valueLabelDisplay="on"
                                            step={0.1}
                                            className={classes.slider}
                                            max={fesMaxRates}
                                            min={0}
                                            track={false}
                                        />
                                    }
                                </FormControl>
                                    {
                                        fesFighters && fesFighters.map((fighter, index) => {
                                            return <FormControl className={classes.ratesWrapper} key={index}>
                                                <div className={classes.centerize}>
                                                    <Tooltip title={fighter.name} ><div className={classes.fighter} style={{
                                                        backgroundImage: `url(${constants.FIGHTER_URL + fighter.year + '/' + fighter.image})`,
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundSize: 'contain',
                                                        backgroundPosition: 'center',
                                                        marginRight: '20px'
                                                    }}></div></Tooltip>
                                                    <Typography>{index === 0 ? fesRates[index].toFixed(2) + "%" : (fesRates[index] - fesRates[index - 1]).toFixed(2) + "%"}</Typography>
                                                </div>
                                            </FormControl>
                                        })
                                    }
                                </>
                            }
                        </FormGroup>
                    </Grid>
                    <Grid item md={6} xs={12} className={classes.grid}>
                        <FormControl>
                            <Typography style={{ textAlign: 'center' }} className={classes.title} variant="h5">Image Preview</Typography>
                            {
                                image !== '' && <img className={classes.image} src={image} alt={name} />
                            }
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} className={classes.buttonWrapper}>
                        <Button style={{ marginRight: '20px' }} disabled={rates.value[0] !== 0 || rates.value[rates.value.length - 1] !== 99} color="primary" variant="contained">Save Changes</Button>
                        <Button variant="outlined" color="secondary" onClick={() => resetInputs()}>Reset</Button>
                    </Grid>
                </Grid>
            </Container>
                : !loadPool && <Container style={{ padding: '80px 0' }}>
                    <Typography variant="h5" style={{ marginBottom: '20px' }}>You do not have any pools yet</Typography>
                    <Link to={constants.CREATE_POOL} style={{textDecoration: 'none'}}><Button variant="contained" color="primary">Create Pool</Button></Link>
                </Container>
        }
        {loadPool && <Loading />}
    </>
}