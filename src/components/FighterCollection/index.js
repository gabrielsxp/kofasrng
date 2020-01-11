import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Loading from '../Loading/index';
import CustomMessage from '../CustomMessage/index';
import Typography from '@material-ui/core/Typography';
import FighterCard from '../FighterCard/index';
import { getCurrentUser } from '../../services/Auth/index';
import axios from '../../axios';

const useStyles = makeStyles(theme => ({
    title: {
        marginBottom: `${theme.spacing(2)}px`
    },
    section: {
        padding: `${theme.spacing(2)}px 0`,
        marginBottom: theme.spacing(2)
    },
    grid: {
        padding: '20px'
    }
}));

const filterOptions = [
    { value: '94' },
    { value: '95' },
    { value: '96' },
    { value: '97' },
    { value: '98' },
    { value: '99' },
    { value: '00' },
    { value: '01' },
    { value: '02' },
    { value: '03' },
    { value: 'XII' },
    { value: 'XIII' },
    { value: 'XIV' },
    { value: 'Fes' },
    { value: 'AS' },
    { value: 'All' },
]

export default function FighterCollection() {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [fighters, setFighters] = useState(null);
    const [allFighters, setAllFighters] = useState(null);
    const [selected, setSelected] = useState("All");
    const [user, setUser] = useState(null);

    const handleClose = () => {
        setError(false);
    }


    function difference(selected) {
        return (fighter) => {
            return selected.filter((selectedFighter) => {
                return fighter._id === selectedFighter._id;
            }).length === 0;
        }
    }


    const loadAllFighters = async (collectionId) => {
        setLoading(true);
        try {
            const response = await axios.get(`/fighters`);
            if (response.data.fighters) {
                const res = await axios.get(`/fighterCollection/${collectionId}`);
                if (res.data.fighterCollection.fighters) {
                    let collected = res.data.fighterCollection.fighters;
                    setLoading(false);
                    setFighters([...collected]);
                    const all = response.data.fighters;
                    const diff = all.filter(difference(collected));

                    for (let i = 0; i < collected.length; i++) {
                        collected[i] = { ...collected[i], collected: true };
                    }
                    for (let j = 0; j < diff.length; j++) {
                        diff[j] = { ...diff[j], collected: false };
                    }
                    collected = collected.concat(diff);

                    setFighters([...collected]);
                    setAllFighters([...collected]);
                }
            } else {
                setError(response.data.error);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            setError('Unable to load fighters');
            setLoading(false);
        }
    }

    const filterFighters = async (year) => {
        if (selected === 'All') {
            setFighters([...allFighters]);
            return;
        }
        setLoading(true);
        const filtered = await allFighters.filter(f => f.year === year);
        setLoading(false);

        setFighters([...filtered]);
    }

    useEffect(() => {
        const us = getCurrentUser();
        if (us) {
            setUser({ ...us });
            loadAllFighters(us.fighterCollection);
        }
    }, []);

    const handleChange = (event) => {
        setSelected(event.target.value);
        filterFighters(event.target.value);
    }

    const RadioFilter = () => {
        return <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Filter by Year</FormLabel>
            <RadioGroup aria-label="gender" name="gender1" value={selected} onChange={handleChange} style={{ display: 'inline-block' }}>
                {
                    filterOptions && filterOptions.map((filter, index) => {
                        return <FormControlLabel key={index} value={filter.value} control={<Radio />} label={filter.value} />
                    })
                }
            </RadioGroup>
        </FormControl>
    }

    return <>
        {
            error && <CustomMessage type="error" handleClose={handleClose} message={error} open={error ? true : false} />
        }
        {
            loading ? <Loading /> :
                <Container className={classes.section}>
                    <Grid container>
                        <Grid item xs={12} className={classes.grid}>
                            <Typography className={classes.title} variant="h5">Collected Fighters</Typography>
                            {
                                fighters && fighters.length > 0 ? <>
                                    {/* <RadioFilter /> */}
                                    <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', justifyContent: 'flex-start', border: '5px solid #dedede', borderRadius: '5px' }}>
                                        {
                                            user && fighters && fighters.map((fighter, index) => {
                                                return <FighterCard notCollected={!fighter.collected} display fighter={fighter} key={index} />
                                            })
                                        }
                                    </div>
                                </> : <Typography>You did not collect any fighters yet</Typography>
                            }
                        </Grid>
                    </Grid>
                </Container>
        }
    </>
}