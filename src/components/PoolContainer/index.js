import React, { useState, useEffect } from 'react';
import PoolContext from './context';
import BootstrapInput from '../BootstrapInput/index';
import PoolSelection from '../PoolSelection/index';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import PoolEditor from '../PoolEditor/index';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';
import axios from '../../axios';
import constants from '../../constants';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        border: '3px solid #dedede',
        borderRadius: '5px'
    },
    section: {
        padding: '80px 0'
    },
    grid: {
        padding: theme.spacing(2)
    },
    alignForm: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        width: '100%'
    },
    subTitle: {
        margin: `${theme.spacing(2)}px 0`
    },
    formGroup: {
        margin: `${theme.spacing(2)}px 0`
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    menu: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        marginTop: '40px'
    },
    success: {
        backgroundColor: green[600],
        color: "#fff"
    }
}));

function difference(selected) {
    return (fighter) => {
        return selected.filter((selectedFighter) => {
            return fighter._id === selectedFighter._id;
        }).length === 0;
    }
}

export default function PoolContainer() {
    const classes = useStyles();
    const [fighters, setFighters] = useState([]);
    const [loadedFighters, setLoadedFighters] = useState([]);
    const [selectedFighters, setSelectedFighters] = useState([]);
    const [loadedSelectedFighters, setLoadedSelectedFighters] = useState([]);
    const [loading, setLoading] = useState([
        false,
        false,
        false
    ]);
    const [error, setError] = useState([
        { message: '', occurs: false }
    ]);
    const [poolName, setPoolName] = useState('');
    const [useDefaultPool, setUseDefaultPool] = useState(true);
    const [colors, setFightersColors] = useState([
        { name: 'purple', url: constants.PURPLE_URL, checked: true },
        { name: 'blue', url: constants.BLUE_URL, checked: true },
        { name: 'red', url: constants.RED_URL, checked: true },
        { name: 'green', url: constants.GREEN_URL, checked: true },
        { name: 'yellow', url: constants.YELLOW_URL, checked: true }
    ]);
    const [types, setTypes] = useState([
        { name: 'attack', url: constants.ATTACK_URL, checked: true },
        { name: 'defense', url: constants.DEFENSE_URL, checked: true },
        { name: 'tech', url: constants.TECH_URL, checked: true }
    ]);
    const [rarities, setRarities] = useState([
        { name: 'Gold', url: constants.GOLD_URL, checked: true },
        { name: 'Silver', url: constants.SILVER_URL, checked: true },
        { name: 'Bronze', url: constants.BRONZE_URL, checked: true }
    ]);
    const [otherChecks, setOtherChecks] = useState([
        { name: 'FES Fighter', checked: false },
        { name: 'All Star', checked: false }
    ]);
    const [success, setSuccess] = useState(false);
    const [updateMode, setUpdateMode] = useState(false);
    const [poolIndex, setPoolIndex] = useState(0);
    const [pools, setPools] = useState([]);

    const loadPools = async () => {
        try {
            const response = await axios.get(`${constants.BASE_URL}/defaultPool`, {
                headers: {
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTA1NGEyYWUzNjkyNDQ0NDA4NjJmMWMiLCJpYXQiOjE1Nzc4OTc3NzJ9.f-lOe5ER2sSUBzLez6rZHb0vEZcGMSV9jdUEY_-H0m0'
                }
            });
            if (response.data.defaultPools) {
                console.log(response.data.defaultPools);
                setPools(response.data.defaultPools);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handlePoolNameChange = (event) => {
        setPoolName(event.target.value);
    }

    const handleUseDefaultPoolChange = (event) => {
        setUseDefaultPool(event.target.checked);
    }

    const handleFightersColorChange = (event, index) => {
        let colorsCopy = colors;
        colorsCopy[index].checked = event.target.checked;
        setFightersColors([...colorsCopy]);

        setFighters([...searchByColor()]);
    }

    const handleFightersRaritiesChange = (event, index) => {
        let raritiesCopy = rarities;
        raritiesCopy[index].checked = event.target.checked;
        setRarities([...raritiesCopy]);

        setFighters([...searchByRarity()]);
    }

    const handleFightersTypeChange = (event, index) => {
        let typesCopy = types;
        typesCopy[index].checked = event.target.checked;
        setTypes([...typesCopy]);

        setFighters([...searchByType()]);
    }

    const handleOtherChecksChange = (event, index) => {
        let checks = otherChecks;
        otherChecks[index].checked = event.target.checked;
        setOtherChecks([...checks]);
        if (index === 0 && otherChecks[index].checked) {
            setFighters([...searchFES()]);
        } else if (index === 1 && otherChecks[index].checked) {
            setFighters([...searchAllStar()]);
        } else {
            setFighters([...loadedFighters]);
        }
    }

    const loadFighters = async () => {
        handleLoading(constants.SELECTED_FIGHTERS_INDEX, true);
        try {
            const response = await axios.get(`${constants.BASE_URL}/defaultPool/${constants.DEFAULT_POOL_ID}`);
            if (response.data.defaultPool.fighters) {
                handleLoading(constants.SELECTED_FIGHTERS_INDEX, false);
                return response.data.defaultPool.fighters;
            } else {
                handleError(constants.SELECTED_FIGHTERS_INDEX, 'Unable to load Fighters');
            }
            return [];
        } catch (error) {
            console.log(error);
        }
    }

    const resetFighters = () => {
        resetColors();
        resetTypes();
        resetRarities();
        resetOtherChecks();
        setFighters([...loadedFighters]);
        setSelectedFighters([...loadedSelectedFighters]);
    }

    const loadAllFighters = async (useDefaultPool) => {
        try {
            handleLoading(constants.FIGHTERS_INDEX, true);
            const response = await axios.get(`${constants.BASE_URL}/fighters`);
            if (response.data.fighters) {
                handleLoading(constants.FIGHTERS_INDEX, false);
                let fighters = response.data.fighters;
                if (fighters && useDefaultPool) {
                    const selected = await loadFighters();
                    fighters = fighters.filter(difference(selected));

                    setFighters([...fighters]);
                    setLoadedFighters([...fighters]);
                    setSelectedFighters([...selected]);
                    setLoadedSelectedFighters([...selected]);
                    return;
                }
                setFighters([...fighters]);
                setLoadedFighters([...fighters]);
                setSelectedFighters([]);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const searchByColor = () => {
        let fightersCopy = loadedFighters;
        const c = colors.filter(color => color.checked).map(res => res.name);
        let result = fightersCopy.filter((f) => {
            return c.includes(f.color)
        })

        return result;
    }

    const searchByType = () => {
        let fightersCopy = loadedFighters;
        const t = types.filter(type => type.checked).map(res => res.name);
        let result = fightersCopy.filter((f) => {
            return t.includes(f.type)
        })
        return result;
    }

    const searchByRarity = () => {
        let fightersCopy = loadedFighters;
        const t = rarities.filter(rarity => rarity.checked).map(res => res.name);
        let result = fightersCopy.filter((f) => {
            return t.includes(f.rarity)
        })

        return result;
    }

    const searchFES = () => {
        let fightersCopy = fighters;
        const c = otherChecks.filter(check => check.checked).map(res => res.name);
        if (c.length === 0) {
            return fightersCopy;
        }
        let fesResult = fightersCopy.filter(f => c.includes(f.isFes ? 'FES Fighter' : null));

        return fesResult;
    }

    const searchAllStar = () => {
        let fightersCopy = fighters;
        const c = otherChecks.filter(check => check.checked).map(res => res.name);
        if (c.length === 0) {
            return fightersCopy;
        }
        let asResult = fightersCopy.filter(f => c.includes(f.isAS ? 'All Star' : null));

        return asResult;
    }

    function move(index, from, to) {
        console.log('index: ' + index);
        console.log('from: ' + from);
        console.log('to: ' + to);

        if (from === to) {
            return;
        }

        if (from === 'fighters' && to === 'selected_fighters') {
            let f = fighters;
            let fighter = f[index];
            f.splice(index, 1);
            setFighters([...f]);

            f = selectedFighters;
            f.splice(0, 0, fighter);
            setSelectedFighters([...f]);

            return;
        }

        if (from === 'selected_fighters' && to === 'fighters') {
            let f = selectedFighters;
            let fighter = f[index];
            f.splice(index, 1);
            setSelectedFighters([...f]);

            f = fighters;
            f.splice(0, 0, fighter);
            setFighters([...f]);

            return;
        }
    }

    const resetColors = () => {
        const c = colors;
        c.forEach(color => color.checked = true);
        setFightersColors([...c]);
    }

    const resetTypes = () => {
        const t = types;
        t.forEach(type => type.checked = true);
        setTypes([...t]);
    }

    const resetRarities = () => {
        const r = rarities;
        r.forEach(rarity => rarity.checked = true);
        setRarities([...r]);
    }

    const resetOtherChecks = () => {
        const c = otherChecks;
        c.forEach(check => check.checked = false);
        setOtherChecks([...c]);
    }

    const deletePool = async () => {
        const id = pools[poolIndex]._id;
        try {
            const response = await axios.delete(`${constants.BASE_URL}/defaultPool/${id}`, {
                headers: {
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTA1NGEyYWUzNjkyNDQ0NDA4NjJmMWMiLCJpYXQiOjE1Nzc4OTc3NzJ9.f-lOe5ER2sSUBzLez6rZHb0vEZcGMSV9jdUEY_-H0m0'
                }
            });
            if (response.data.success) {
                loadPools();
                setPoolIndex(0);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const submitChanges = async () => {
        let poolObject = {
            name: poolName,
            fighters: [...selectedFighters]
        }
        handleLoading(constants.CREATE_POOL_SAVE_CHANGES_INDEX, true);
        try {
            let response = null;
            if (updateMode) {
                poolObject = {fighters: [...selectedFighters]};
                response = await axios.patch(`/defaultPool/${pools[poolIndex]._id}`, { ...poolObject }, {
                    headers: {
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTA1NGEyYWUzNjkyNDQ0NDA4NjJmMWMiLCJpYXQiOjE1Nzc4OTc3NzJ9.f-lOe5ER2sSUBzLez6rZHb0vEZcGMSV9jdUEY_-H0m0'
                    }
                });
                if (response.data.defaultPool) {
                    handleLoading(constants.CREATE_POOL_SAVE_CHANGES_INDEX, false);
                    setSuccess(true);
                    setTimeout(() => {
                        setSuccess(false);
                    }, 3000);
                }
            }
            if (!updateMode) {
                response = await axios.post('/defaultPool', { ...poolObject }, {
                    headers: {
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTA1NGEyYWUzNjkyNDQ0NDA4NjJmMWMiLCJpYXQiOjE1Nzc4OTc3NzJ9.f-lOe5ER2sSUBzLez6rZHb0vEZcGMSV9jdUEY_-H0m0'
                    }
                })
                if (response.data.defaultPool) {
                    handleLoading(constants.CREATE_POOL_SAVE_CHANGES_INDEX, false);
                    setSuccess(true);
                    setTimeout(() => {
                        setSuccess(false);
                    }, 3000)
                }
            }
        } catch (error) {
            handleLoading(constants.CREATE_POOL_SAVE_CHANGES_INDEX, false);
            console.log(error);
        }
    }

    const handleLoading = (index, flag) => {
        console.log(loading[index], flag);
        let loaders = loading;
        loaders[index] = flag;
        setLoading([...loaders]);
    }

    const handleUpdateChange = (event) => {
        setUpdateMode(event.target.checked);
    }

    const handleError = (index, message) => {
        let errors = error;
        if (message !== '') {
            errors[index].message = message;
            errors[index].occurs = true;
        } else {
            errors[index].occurs = false;
        }
        setError([...errors]);
    }

    const values = {
        fighters,
        selectedFighters,
        setSelectedFighters,
        setFighters,
        loadedFighters,
        loading,
        error,
        move,
        difference,
    };

    const resetFilters = () => {
        resetRarities();
        resetTypes();
        resetColors();
        resetOtherChecks();
    }

    const moveSelection = () => {
        let selected = selectedFighters;
        const selection = fighters;
        selected = selected.concat(selection);
        let diff = loadedFighters.filter(difference(selection));
        setFighters([...diff]);
        setLoadedFighters([...diff]);
        setSelectedFighters([...selected]);
        resetFilters();
    }

    useEffect(() => {
        loadAllFighters(useDefaultPool);
    }, [useDefaultPool]);

    useEffect(() => {
        loadPools();
    }, [updateMode]);

    let condition = selectedFighters.some(fighter => fighter.rarity === 'Bronze') &&
        selectedFighters.some(fighter => fighter.rarity === 'Silver') &&
        selectedFighters.some(fighter => fighter.rarity === 'Gold');
    const FilterFighters = () => {
        return <form action="" noValidate>
            <FormGroup>
                {
                    <FormControl style={{ marginTop: '10px' }}>
                        <FormControlLabel
                            control={
                                <Checkbox checked={useDefaultPool} onChange={(event) => handleUseDefaultPoolChange(event)} value="checkedA" />
                            }
                            label="Use Default Fighter Pool"
                        />
                    </FormControl>
                }
            </FormGroup>
            <FormGroup>
                {
                    otherChecks && otherChecks.map((check, index) => {
                        return <FormControl key={index}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={otherChecks[index].checked} onChange={(event) => handleOtherChecksChange(event, index)} />
                                }
                                label={check.name}
                            />
                        </FormControl>
                    })
                }
            </FormGroup>
            <FormGroup row className={classes.formGroup}>
                {
                    colors && colors.map((color, index) => {
                        return <FormControl key={index}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={colors[index].checked} onChange={(event) => handleFightersColorChange(event, index)} />
                                }
                                label={<img src={color.url} alt={color.name} style={{ width: '40px', height: '40px' }} />}
                            />
                        </FormControl>
                    })
                }
            </FormGroup>
            <FormGroup row className={classes.formGroup}>
                {
                    types && types.map((type, index) => {
                        return <FormControl key={index}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={types[index].checked} onChange={(event) => handleFightersTypeChange(event, index)} />
                                }
                                label={<img src={type.url} alt={type.name} style={{ width: '40px', height: '40px' }} />}
                            />
                        </FormControl>
                    })
                }
            </FormGroup>
            <FormGroup row className={classes.formGroup}>
                {
                    rarities && rarities.map((rarity, index) => {
                        return <FormControl key={index}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={rarities[index].checked} onChange={(event) => handleFightersRaritiesChange(event, index)} />
                                }
                                label={<img src={rarity.url} alt={rarity.name} style={{ width: '44px', height: '30px' }} />}
                            />
                        </FormControl>
                    })
                }
            </FormGroup>
            <FormControl>
                <Button onClick={() => resetFighters()} variant="outlined" color="secondary" size="large">Reset</Button>
                <Button style={{ marginTop: '20px' }} onClick={() => moveSelection()} variant="outlined" color="secondary" size="large">Move Selection</Button>
            </FormControl>
            <UpdateFighters />
        </form>
    }

    const UpdateFighters = () => {
        return <><FormGroup>
            {
                <FormControl>
                    <FormControlLabel
                        control={
                            <Checkbox checked={updateMode} onChange={(event) => handleUpdateChange(event)} value="checkedA" />
                        }
                        label="Update Existing Pool"
                    />
                </FormControl>
            }
        </FormGroup>
            {
                updateMode && pools && <PoolSelection deletePool={deletePool} pools={pools} poolIndex={poolIndex} handlePoolIndex={setPoolIndex}/>
            }
        </>
    }
    
    return <PoolContext.Provider value={{ ...values }}>
        <Container style={{ marginTop: '40px' }}>
            <Grid container>
                <Grid item md={5} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {
                            !updateMode && <FormGroup>
                                <FormControl>
                                    <Typography className={classes.title} variant="h5">Create Default Pool</Typography>
                                    <TextField style={{ margin: '15px 0' }} helperText="Must contain at least 6 characters" id="standard-basic" label="Pool Name" variant="outlined" onChange={(event) => handlePoolNameChange(event)} value={poolName} />
                                </FormControl>
                            </FormGroup>
                        }
                        <FilterFighters />
                    </div>
                </Grid>
                <PoolEditor />
                <Grid item xs={12}>
                    <FormControl style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '40px' }}>
                        {
                            selectedFighters &&
                            <Button className={success ? classes.success : null} disabled={
                                loading[constants.CREATE_POOL_SAVE_CHANGES_INDEX] || success || (
                                    updateMode ? selectedFighters.length === 0 || !condition :
                                        selectedFighters.length === 0 || !condition || poolName.length < 6
                                )
                            } onClick={() => submitChanges()} color="primary" variant="contained" size="large">{loading[constants.CREATE_POOL_SAVE_CHANGES_INDEX] ? 'Saving...' :
                                success ? 'OK' : 'Save Changes'}</Button>
                        }
                    </FormControl>
                </Grid>
            </Grid>
        </Container>
    </PoolContext.Provider >
}