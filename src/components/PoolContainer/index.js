import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useDrop } from 'react-dnd';
import PoolContext from './context';
import CustomMessage from '../CustomMessage/index';
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
import FilterFighters from '../FilterFighters/index';
import constants from '../../constants';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        border: '3px solid #dedede',
        borderRadius: '5px'
    },
    section: {
        padding: `${theme.spacing(2)}px 0`,
        marginBottom: theme.spacing(2)
    },
    grid: {
        padding: '20px'
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
    },
    hovered: {
        backgroundColor: "#dedede",
        border: '5px dashed #333'
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
    const [loading, setLoading] = useState([
        false,
        false,
        false
    ]);
    const [error, setError] = useState(false);
    const [poolName, setPoolName] = useState('');
    const [useDefaultPool, setUseDefaultPool] = useState(true);
    
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
            const response = await axios.get(`${constants.BASE_URL}/defaultPool`);
            if (response.data.defaultPools) {
                console.log(response.data.defaultPools);
                setPools(response.data.defaultPools);
            } else {
                setError(`Unable to load the pools`);
            }
        } catch (error) {
            setError(`Unable to load the pools`);
        }
    }

    const handlePoolNameChange = (event) => {
        setPoolName(event.target.value);
    }

    const handleUseDefaultPoolChange = (event) => {
        setUseDefaultPool(event.target.checked);
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
                setError('Unable to load the fighters');
            }
            return [];
        } catch (error) {
            setError(`Unable to load the fighters`);
        }
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
                    return;
                }
                setFighters([...fighters]);
                setLoadedFighters([...fighters]);
                setSelectedFighters([]);
            } else {
                setError(`Unable to the fighters`);
            }
        } catch (error) {
            setError(`Unable to the fighters`);
        }
    }

    const searchFES = () => {
        let fightersCopy = fighters;
        const c = otherChecks.filter(check => check.checked).map(res => res.name);
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

    const deletePool = async () => {
        const id = pools[poolIndex]._id;
        try {
            const response = await axios.delete(`${constants.BASE_URL}/defaultPool/${id}`);
            if (response.data.success) {
                loadPools();
                setPoolIndex(0);
            } else {
                setError(`Unable to delete the pool`);
            }
        } catch (error) {
            setError(`Unable to delete the pool`);
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
                poolObject = { fighters: [...selectedFighters] };
                response = await axios.patch(`/defaultPool/${pools[poolIndex]._id}`, { ...poolObject });
                if (response.data.defaultPool) {
                    handleLoading(constants.CREATE_POOL_SAVE_CHANGES_INDEX, false);
                    setSuccess('Pool Updated');
                    setTimeout(() => {
                        setSuccess(false);
                    }, 3000);
                }
            } else {
                response = await axios.post('/defaultPool', { ...poolObject })
                console.log(response);
                if (response.data.defaultPool) {
                    handleLoading(constants.CREATE_POOL_SAVE_CHANGES_INDEX, false);
                    setSuccess('Pool Created');
                    setTimeout(() => {
                        setSuccess(false);
                    }, 3000)
                }
            }
        } catch (error) {
            handleLoading(constants.CREATE_POOL_SAVE_CHANGES_INDEX, false);
            setError(`Unable to ${updateMode ? 'update' : 'save'} the pool`);
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

    useEffect(() => {
        loadAllFighters(useDefaultPool);
    }, [useDefaultPool]);

    useEffect(() => {
        loadPools();
    }, [updateMode]);

    const handleClose = () => {
        setError(false);
    }

    const handleCloseSuccess = () => {
        setSuccess(false);
    }


    const [{ hovered }, dropRef] = useDrop({
        accept: 'CARD',
        drop(item, monitor) {
            if (item.from !== 'fighters') {
                let allSelected = [...selectedFighters];
                let removedFighter = allSelected.splice(item.index, 1);
                let allFighters = [...fighters];
                allFighters.splice(0, 0, removedFighter[0]);
                setFighters([...allFighters]);
                setSelectedFighters(...[allSelected]);
            }
        },
        collect: monitor => {
            return {
                hovered: monitor.isOver()
            }
        }
    });

    let condition = selectedFighters.some(fighter => fighter.rarity === 'Bronze') &&
        selectedFighters.some(fighter => fighter.rarity === 'Silver') &&
        selectedFighters.some(fighter => fighter.rarity === 'Gold');

    return <PoolContext.Provider value={{ ...values }}>
        {
            error && <CustomMessage handleClose={handleClose} open={error ? true : false} type="error" message={error} />
        }
        {
            success && <CustomMessage handleClose={handleCloseSuccess} open={success ? true : false} type="success" message={success} />
        }
        <Container ref={dropRef} className={clsx({ [classes.hovered]: hovered }, classes.section)}>
            <Grid container>
                <Grid item md={5} className={classes.grid}>
                    <div>
                        {
                            !updateMode && <FormGroup>
                                <FormControl>
                                    <Typography variant="h5">Create Default Pool</Typography>
                                    <TextField style={{ margin: '15px 0' }} helperText="Must contain at least 6 characters" id="standard-basic" label="Pool Name" variant="outlined" onChange={(event) => handlePoolNameChange(event)} value={poolName} />
                                </FormControl>
                            </FormGroup>
                        }
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