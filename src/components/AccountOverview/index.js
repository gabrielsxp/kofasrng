import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CustomMessage from '../CustomMessage/index';
import Loading from '../Loading/index';
import Chart from '../Chart/index';
import BarChart from '../BarChart/index';
import BootstrapInput from '../BootstrapInput/index';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Select from '@material-ui/core/Select';
import axios from '../../axios';

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
    select: {
        marginRight: theme.spacing(2)
    },
    menuItem: {
        '&:hover': {
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.main
        }
    },
    selectWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        marginTop: theme.spacing(2)
    },
    group: {
        marginTop: theme.spacing(2)
    },
    groupWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
    }
}));

const selectOptions = [
    { name: 'Today', value: 1 },
    { name: 'Last 7 Days', value: 7 },
    { name: 'Last 14 Days', value: 14 },
    { name: 'Last 21 Days', value: 21 },
    { name: 'Last 30 Days', value: 30 }
];

const selectFightersOptions = [
    { name: 'Today', value: 1 },
    { name: 'Yesterday', value: 2 },
    { name: 'Last 3 Days', value: 3 },
    { name: 'Last 5 Days', value: 5 },
    { name: 'Last 7 Days', value: 7 }
];

export default function AccountOverview() {
    const classes = useStyles();

    const [stats, setStats] = useState(null);
    const [fighters, setFighters] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    const [loadingFighters, setLoadingFighters] = useState(null);
    const [options, setOptions] = useState(1);
    const [fightersOptions, setFightersOptions] = useState(2);

    const loadStats = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/stats/rubies/?days=${selectOptions[options].value}`);
            if (response.data.rubies) {
                setLoading(false);
                setStats([...response.data.rubies]);
            } else {
                setError(response.data.error);
                setLoading(false);
            }
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }
    
    const loadFighterStats = async () => {
        setLoadingFighters(true);
        try {
            const response = await axios.get(`/stats/fighters/?days=${selectFightersOptions[fightersOptions].value}`);
            if (response.data.fighters) {
                setLoadingFighters(false);
                setFighters([...response.data.fighters]);
            } else {
                setError(response.data.error);
                setLoadingFighters(false);
            }
        } catch (error) {
            setError(error);
            setLoadingFighters(false);
        }
    }

    const handleChangeSelection = (event) => {
        setOptions(event.target.value);
    }

    const handleChangeFightersSelection = (event) => {
        setFightersOptions(event.target.value);
    }

    const handleClose = () => {
        setError(false);
    }

    useEffect(() => {
        loadStats();
        loadFighterStats();
    }, []);

    return <>
        {error && <CustomMessage type="error" message={error} handleClose={handleClose} open={error ? true : false} />}
        <Container className={classes.section}>
            <Grid container>
                <Grid xs={12} className={classes.grid}>
                    <FormGroup>
                        <Typography className={classes.title} variant="h5">Account Overview</Typography>
                    </FormGroup>
                    <FormGroup className={classes.group}>
                        <div className={classes.groupWrapper}>
                            <Typography className={classes.title} variant="h6">Total of Rubies Spent</Typography>
                            <div className={classes.selectWrapper}>
                                <Select
                                    labelId="pool-select-label-id"
                                    id="pool-select-label"
                                    input={<BootstrapInput />}
                                    value={options}
                                    onChange={(event) => handleChangeSelection(event)}
                                    className={classes.select}
                                >
                                    {
                                        selectOptions && selectOptions.map((option, index) => {
                                            return <MenuItem className={classes.menuItem} key={index} value={index}>{option.name}</MenuItem>
                                        })
                                    }
                                </Select>
                                <Button onClick={() => loadStats()} className={classes.button} disabled={loading} variant="contained" color="primary">{`${loading ? 'Filtering' : 'Filter'}`}</Button>
                            </div>
                        </div>
                    </FormGroup>
                </Grid>
                <Grid item xs={12}>
                    {loading && <Loading />}
                    {stats && !loading && <Chart data={stats} />}
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12} className={classes.grid}>
                    <div className={classes.groupWrapper}>
                        <Typography variant="h6">Number of Fighters Collected</Typography>
                        <div className={classes.selectWrapper}>
                            <Select
                                labelId="pool-select-label-id-2"
                                id="pool-select-label-2"
                                input={<BootstrapInput />}
                                value={fightersOptions}
                                onChange={(event) => handleChangeFightersSelection(event)}
                                className={classes.select}
                            >
                                {
                                    selectFightersOptions && selectFightersOptions.map((option, index) => {
                                        return <MenuItem className={classes.menuItem} key={index} value={index}>{option.name}</MenuItem>
                                    })
                                }
                            </Select>
                            <Button onClick={() => loadFighterStats()} className={classes.button} disabled={loadingFighters} variant="contained" color="primary">{`${loadingFighters ? 'Filtering' : 'Filter'}`}</Button>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    {loadingFighters && <Loading />}
                    {fighters && !loadingFighters && <BarChart data={fighters} />}
                </Grid>
            </Grid>
        </Container>
    </>
}