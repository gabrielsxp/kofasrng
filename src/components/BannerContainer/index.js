import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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
import DatePicker from '../DatePicker/index';
import { getCurrentUser } from '../../services/Auth/index';
import PoolSelection from '../PoolSelection';
import CustomMessage from '../CustomMessage/index';
import { useSelector, useDispatch } from 'react-redux';

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
    },
    column: {
        flexDirection: 'row',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column'
        }
    }
}));

export default function BannerContainer() {
    const [loading, setLoading] = useState(false);
    const [loadPool, setLoadPools] = useState(false);
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [pools, setPools] = useState([]);
    const [banners, setBanners] = useState([]);
    const [updateIndex, setUpdateIndex] = useState(0);
    const [poolIndex, setPoolIndex] = useState(0);
    const [updateMode, setUpdateMode] = useState(false);
    const [hasFes, setHasFes] = useState(false);
    const [hasAS, setHasAS] = useState(false);
    const [fesFighters, setFesFighters] = useState([]);
    const [ASFighters, setASFighters] = useState([]);
    const [fesRates, setFesRates] = useState([]);
    const [ASRates, setASRates] = useState([]);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const globalRates = {
        value: [0, 19, 93, 99], max: 99, min: 0
    };
    const [rates, setRates] = useState({ ...globalRates });
    const [fesMaxRates, setFesMaxRates] = useState(0);
    const [ASMaxRates, setASMaxRates] = useState(0);
    const baseCosts = [{ name: 'Single Summon', value: 100 }, { name: 'Multi Summons', value: 900 }];
    const [costs, setCosts] = useState([...baseCosts]);
    const from = useSelector(state => state.fromDate);
    const to = useSelector(state => state.toDate);
    const dispatch = useDispatch();

    const loadBanners = async () => {
        try {
            const response = await axios.get(`${constants.BASE_URL}/banners/`);
            if (response.data.banners) {
                let banners = response.data.banners;
                setBanners([...banners]);
                if (updateMode) {
                    setFields(updateIndex);
                } else {
                    resetFields();
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const loadPools = async () => {
        try {
            setLoading(true);
            setLoadPools(true);
            const response = await axios.get(`${constants.BASE_URL}/defaultPool`);
            var pools = response.data.defaultPools;
            if (pools.length > 0) {
                setPools([...pools]);
                setLoadPools(false);
                const res = await axios.get(`${constants.BASE_URL}/defaultPool/${pools[poolIndex]._id}`);
                const fighters = res.data.defaultPool.fighters;
                const fesFighters = fighters.filter(fighter => fighter.isFes);
                const ASFighters = fighters.filter(fighter => fighter.isAS && !fighter.isFes);
                const hasFes = fesFighters.length > 0;
                const hasAS = ASFighters.length > 0;
                if (!updateMode) {
                    let dist = rates.value[rates.value.length - 1] - rates.value[rates.value.length - 2];
                    if (hasFes) {
                        let fesRates = fesFighters.map((_, index) => (dist * (index)) / (fesFighters.length));
                        setFesRates([...fesRates]);
                    }
                    if (hasAS) {
                        let ASRates = ASFighters.map((_, index) => (dist * (index)) / (ASFighters.length))
                        setASRates([...ASRates]);
                    }
                    setFesMaxRates(dist);
                    setASMaxRates(dist);
                }

                setFesFighters([...fesFighters]);
                setASFighters([...ASFighters]);
                setHasFes(hasFes);
                setHasAS(hasAS);

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

    const deleteBanner = async () => {
        try {
            const response = await axios.delete(`/banner/${banners[updateIndex]._id}`);
            if (response.data.success) {
                let b = loadBanners();
                setBanners([...b]);
                setUpdateIndex(0);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const setFields = (index) => {
        let banner = banners[index];
        let name = banner.name;
        let costs = [...baseCosts];
        costs[0].value = banner.singleCost;
        costs[1].value = banner.multiCost;

        let poolIndex = pools.findIndex((p) => p._id === banner.pool);
        let image = banner.image;
        let rates = { value: banner.rates, min: 0, max: 99 };
        let fesRates = banner.fesRates.map(f => f.rate);
        let asRates = banner.asRates.map(f => f.rate);
        let hasFes = fesRates.length > 0;
        let hasAS = fesRates.length > 0;
        let start = banner.start;
        let end = banner.end;

        setName(name);
        setCosts([...costs]);
        setPoolIndex(poolIndex !== -1 ? poolIndex : 0);
        setImage(image);
        setRates({ ...rates });
        dispatch({ type: 'BANNER_START_DATE', fromDate: start });
        dispatch({ type: 'BANNER_END_DATE', toDate: end });

        let ratesLength= banner.rates.length;
        let max = banner.rates[ratesLength-1] - banner.rates[ratesLength-2];
        if(hasFes){    
            setFesRates([...fesRates]);
            setFesMaxRates(max);
        }
        if(hasAS){
            setASRates([...asRates]);
            setASMaxRates(max);
        }
    }

    const resetFields = () => {
        setName('');
        setCosts([...baseCosts]);
        setPoolIndex(0);
        setImage('');
        setRates({ ...globalRates });
    }

    const handleClose = () => {
        setError(false);
    }

    const saveChanges = async () => {
        let fesFinalRates = fesFighters.map((fighter, index) => {
            let obj = {
                fighter: fighter._id, rate: fesRates[index]
            };
            return { ...obj };
        });
        let asFinalRates = ASFighters.map((fighter, index) => {
            let obj = {
                fighter: fighter._id, rate: ASRates[index]
            };
            return { ...obj };
        });
        const finalObject = {
            name,
            image,
            singleCost: costs[0].value,
            multiCost: costs[1].value,
            pool: pools[poolIndex],
            rates: rates.value,
            start: moment(from).toISOString(),
            end: moment(to).toISOString(),
            fesRates: [...fesFinalRates],
            asRates: [...asFinalRates]
        }
        if (updateMode) {
            try {
                const response = await axios.patch(`${constants.BASE_URL}/banner/${banners[updateIndex]._id}`, { ...finalObject })
                if (response.data.banner) {
                    setSuccess(true);
                    setUpdateMode(false);
                    setTimeout(() => {
                        setSuccess(false);
                    }, 3000);
                } else {
                    setError(response.data.error);
                }
            } catch (error) {
                setError('Unable to update the banner');
            }
        } else {
            try {
                const response = await axios.post(`${constants.BASE_URL}/banner`, { ...finalObject });
                if (response.data.banner) {
                    setSuccess(true);
                    setTimeout(() => {
                        setSuccess(false);
                    }, 3000);
                } else {
                    setError(response.data.error);
                }
            } catch (error) {
                setError('Unable to create banner right now');
            }
        }

        console.log(fesFinalRates, asFinalRates);
    }

    const handleFesRateSlide = (value) => {
        setFesRates(value);
    }

    const handleASRateSlide = (value) => {
        setASRates(value);
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

    const handleChangeUpdateSelection = (value) => {
        setUpdateIndex(value);
        if (updateMode) {
            setFields(value);
        } else {
            resetFields();
        }
    }

    const handleRateSlide = (value) => {
        setRates({ ...rates, value });
        if (value) {
            setFesMaxRates(value[value.length - 1] - value[value.length - 2]);
        }
    }

    const handleCostChange = (event, index) => {
        let c = [...costs];
        c[index].value = event.target.value;
        setCosts([...costs]);
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

    const handleChangeUpdateMode = (event) => {
        setUpdateMode(event.target.checked);
    }

    useEffect(() => {
        loadPools();
        setUser(getCurrentUser());
    }, [poolIndex]);

    useEffect(() => {
        loadBanners();
    }, [updateMode]);

    const classes = useStyles();
    return <>
        {
            error && <CustomMessage message={error} type="error" handleClose={handleClose} open={error ? true : false} />
        }
        {
            pools && pools.length > 0 ? <Container className={classes.section}>
                <Grid container>
                    <Grid item xs={12} md={6} className={classes.grid}>
                        <FormGroup>
                            <Typography className={classes.title} variant="h5">Banner Management</Typography>
                            {
                                banners && banners.length > 0 && <FormControl style={{ marginTop: '10px' }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={updateMode} onChange={(event) => handleChangeUpdateMode(event)} value="checkedA" />
                                        }
                                        label="Update Existing Banner ?"
                                    />
                                </FormControl>
                            }
                            <FormControl>
                                {

                                    banners && banners.length > 0 && updateMode && <PoolSelection deletePool={deleteBanner} pools={banners} poolIndex={updateIndex} handlePoolIndex={handleChangeUpdateSelection} />

                                }
                            </FormControl>
                            <TextField size="small" style={{ margin: '15px 0' }} helperText="Must contain at least 6 characters" id="standard-basic" label="Pool Name" variant="outlined" onChange={(event) => handleNameChange(event)} value={name} />
                            {
                                costs && costs.map((c, index) => {
                                    return <FormControl className={classes.space} key={index}>
                                        <TextField required type="number" size="small" style={{ margin: '15px 0' }} helperText={
                                            index === 0 ? 'Numeric value of the cost. Ex: 100' : 'Must be greater or equals the single summon cost'
                                        } id="standard-basic" label={`${c.name} Cost`} variant="outlined" onChange={(event) => handleCostChange(event, index)} value={costs[index].value} />
                                    </FormControl>
                                })
                            }
                            <FormControl className={classes.space}>
                                {
                                    user && user.role === 1 && <>
                                        <DatePicker type="from" className={classes.space} />
                                        <DatePicker type="to" />
                                    </>
                                }
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
                                <TextField required size="small" style={{ margin: '15px 0' }} id="image-anchor-field" label="Image Link" variant="outlined" onChange={(event) => handleImageChange(event)} value={image} />
                            </FormControl>
                            <FormControl>
                                <Typography variant="h6" style={{ marginBottom: '20px' }}>Set Fighter Rates</Typography>
                                <div style={{ width: '100%', display: 'flex', marginBottom: '50px', justifyContent: 'space-between', flexWrap: 'wrap' }}>
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
                                    <div style={{ width: '100%', display: 'flex', marginBottom: '50px', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                                        {
                                            fesFighters && fesFighters.length > 0 && fesFighters.map((fighter, index) => {
                                                return <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Tooltip title={fighter.name}><div className={classes.fighter} style={{
                                                        backgroundImage: `url(${constants.FIGHTER_URL + fighter.year + '/' + fighter.image})`,
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundSize: 'contain',
                                                        backgroundPosition: 'center',
                                                        marginRight: '20px',
                                                        marginBottom: '20px'
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
                                                    <Typography>{index === 0 ? fesRates[index] + "%" : (fesRates[index] - fesRates[index - 1]) + "%"}</Typography>
                                                </div>
                                            </FormControl>
                                        })
                                    }
                                </>
                            }
                            {
                                hasAS && <><FormControl style={{ marginTop: '10px' }}>
                                    <Typography variant="h6" style={{ marginBottom: '20px' }}>Set All Star Fighters Rates</Typography>
                                    <div style={{ width: '100%', display: 'flex', marginBottom: '50px', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                                        {
                                            ASFighters && ASFighters.length > 0 && ASFighters.map((fighter, index) => {
                                                return <div key={index} style={{ width: '100%', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                                    <Tooltip title={fighter.name}><div className={classes.fighter} style={{
                                                        backgroundImage: `url(${constants.FIGHTER_URL + fighter.year + '/' + fighter.image})`,
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundSize: 'contain',
                                                        backgroundPosition: 'center',
                                                        marginRight: '20px',
                                                        marginBottom: '20px'
                                                    }}></div></Tooltip>
                                                    {ASFighters.length > 1 && index !== ASFighters.length - 1 && <ArrowRight className={classes.arrowStepper} style={{ marginRight: '20px' }} />}
                                                </div>
                                            })
                                        }
                                    </div>
                                    {
                                        <Slider
                                            value={ASRates}
                                            onChange={(_, newValue) => handleASRateSlide(newValue)}
                                            aria-labelledby="range-slider"
                                            valueLabelDisplay="on"
                                            step={0.1}
                                            className={classes.slider}
                                            max={ASMaxRates}
                                            min={0}
                                            track={false}
                                        />
                                    }
                                </FormControl>
                                    {
                                        ASFighters && ASFighters.map((fighter, index) => {
                                            return <FormControl className={classes.ratesWrapper} key={index}>
                                                <div className={classes.centerize}>
                                                    <Tooltip title={fighter.name} ><div className={classes.fighter} style={{
                                                        backgroundImage: `url(${constants.FIGHTER_URL + fighter.year + '/' + fighter.image})`,
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundSize: 'contain',
                                                        backgroundPosition: 'center',
                                                        marginRight: '20px'
                                                    }}></div></Tooltip>
                                                    <Typography>{index === 0 ? ASRates[index].toFixed(2) + "%" : (ASRates[index] - ASRates[index - 1]).toFixed(2) + "%"}</Typography>
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
                                user && image !== '' && <img
                                    className={classes.image}
                                    src={user.username === 'admin' ? constants.BANNER_URL + image : image}
                                    alt={name}
                                />
                            }
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} className={classes.buttonWrapper}>
                        <Button
                            disabled={
                                success ||
                                rates.value[0] !== 0 ||
                                rates.value[rates.value.length - 1] !== 99 ||
                                name.length < 6 ||
                                (costs[0].value === '' && costs[1].value === '')
                            }
                            onClick={() => saveChanges()} style={{ marginRight: '20px' }} color="primary" variant="contained">{success ? 'OK' : 'Save Changes'}</Button>
                        <Button variant="outlined" color="secondary" onClick={() => resetInputs()}>Reset</Button>
                    </Grid>
                </Grid>
            </Container>
                : !loadPool && <Container style={{ padding: '80px 20px' }}>
                    <Typography variant="h5" style={{ marginBottom: '20px' }}>You do not have any pools yet</Typography>
                </Container>
        }
        {loadPool && <Loading />}
    </>
}