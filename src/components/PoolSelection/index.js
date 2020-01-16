import React, { useState, useContext, useEffect } from 'react';
import clsx from 'clsx';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import BootstrapInput from '../BootstrapInput/index';
import './style.css';
import PoolContext from '../PoolContainer/context';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import red from '@material-ui/core/colors/red';
import axios from '../../axios';
import constants from '../../constants';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    select: {
        minWidth: '150px',
        marginRight: theme.spacing(2),
        marginBottom: '10px'
    },
    button: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            marginBottom: '10px'
        }
    },
    deleteButton: {
        backgroundColor: red[500],
        color: '#fff'
    },
    confirmDelete: {
        backgroundColor: red[700],
        color: '#fff'
    }
}));

export default function PoolSelection({ pools, poolIndex, handlePoolIndex, deletePool, loadFightersFlag }) {
    const classes = useStyles();
    const [enterDeleteMode, setEnterDeleteMode] = useState(false);

    const {
        setSelectedFighters,
        setFighters,
        loadedFighters,
        difference
    } = useContext(PoolContext);

    const handleEnterDeleteMode = (flag) => {
        setEnterDeleteMode(flag);
    }

    const controlDelete = () => {
        if (enterDeleteMode) {
            deletePool();
            handleEnterDeleteMode(false);
        } else {
            handleEnterDeleteMode(true);
        }
    }

    const loadFighters = async (id) => {
        try {
            const response = await axios.get(`${constants.BASE_URL}/defaultPool/${pools[id]._id}`);
            if (response.data.defaultPool) {
                let selection = [...response.data.defaultPool.fighters];
                let fightersSlice = loadedFighters.filter(difference(selection));
                setFighters([...fightersSlice]);
                setSelectedFighters([...selection]);
            }
        } catch (error) {
            console.log(error);
        }
    }


    const handleSelection = (event) => {
        handlePoolIndex(event.target.value);
        if(loadFightersFlag){
            loadFighters(event.target.value);
        }
    }

    useEffect(() => {
        if(loadFightersFlag){
            loadFighters(0);
        }
    }, []);

    return pools && <div className={classes.root}>
        <FormControl>
            {
                pools && <Select
                    labelId="pool-select-label"
                    id="pool-select-label"
                    input={<BootstrapInput />}
                    value={poolIndex}
                    onChange={(event) => handleSelection(event)}
                    className={classes.select}
                >
                    {
                        pools && pools.map((pool, index) => {
                            return <MenuItem key={index} value={index}>{pool.name}</MenuItem>
                        })
                    }
                </Select>
            }
        </FormControl>
        <FormControl>
            <ClickAwayListener onClickAway={() => handleEnterDeleteMode(false)}>
                <Button id="delete-pool-button" onClick={() => controlDelete()} className={
                    clsx(classes.button, classes.deleteButton, { [classes.confirmDelete]: enterDeleteMode })
                } size="large" variant="outlined">{enterDeleteMode ? 'Confirm' : 'Delete'}</Button>
            </ClickAwayListener>
        </FormControl>
    </div>
}