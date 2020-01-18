import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Grid from '@material-ui/core/Grid';
import FighterCard from '../FighterCard/index';
import Container from '@material-ui/core/Container';
import Loading from '../Loading/index';
import CustomMessage from '../CustomMessage/index';
import Typography from '@material-ui/core/Typography';
import { getCurrentUser } from '../../services/Auth/index';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import constants from '../../constants';
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
    },
    fightersWrapper: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    iconYear: {
        width: '100px',
        height: 'auto'
    }
}));

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

const years = [
    { year: '94', image: `${constants.YEARS}/KOF94_logo.webp` },
    { year: '95', image: `${constants.YEARS}/KOF95_logo.webp` },
    { year: '96', image: `${constants.YEARS}/KOF96_logo.webp` },
    { year: '97', image: `${constants.YEARS}/KOF97_logo.webp` },
    { year: '98', image: `${constants.YEARS}/KOF98_logo.webp` },
    { year: '99', image: `${constants.YEARS}/KOF99_logo.webp` },
    { year: '00', image: `${constants.YEARS}/KOF00_logo.webp` },
    { year: '01', image: `${constants.YEARS}/KOF01_logo.webp` },
    { year: '02', image: `${constants.YEARS}/KOF02UM_logo.webp` },
    { year: '03', image: `${constants.YEARS}/KOF03_logo.webp` },
    { year: 'XII', image: `${constants.YEARS}/KOF12_logo.webp` },
    { year: 'XIII', image: `${constants.YEARS}/KOFXIII_logo.webp` },
    { year: 'XIV', image: `${constants.YEARS}/KOFXIV_logo.webp` },
    { year: 'AS', image: `${constants.YEARS}/KOFAS_logo.webp` },
];

export default function FighterCollection() {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [fighters, setFighters] = useState(null);
    const [user, setUser] = useState(null);
    const [value, setValue] = useState(0);

    const handleClose = () => {
        setError(false);
    }

    const GenericIcon = ({ image, year }) => {
        return <img className={classes.iconYear} src={image} alt={year} />
    }

    const handleChangeValue = (event, newValue) => {
        setValue(newValue);
    };

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

                    let fightersState = [];
                    for (let year in years) {
                        let fightersByYear = [];
                        if (years[year].year !== 'AS') {
                            fightersByYear = collected.filter(f => f.year === years[year].year).sort(f => f.isFES);
                        } else {
                            fightersByYear = collected.filter(f => f.isAS).sort(f => f.isFES);
                        }
                        let fightersObject = {
                            year: years[year].year,
                            fighters: fightersByYear
                        };
                        fightersState = fightersState.concat(fightersObject);
                    }

                    setFighters([...fightersState]);
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

    useEffect(() => {
        const us = getCurrentUser();
        if (us) {
            setUser({ ...us });
            loadAllFighters(us.fighterCollection);
        }
    }, []);

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <Typography
                component="div"
                role="tabpanel"
                hidden={value !== index}
                id={`scrollable-force-tabpanel-${index}`}
                aria-labelledby={`scrollable-force-tab-${index}`}
                {...other}
            >
                {value === index && <Box p={3}>{children}</Box>}
            </Typography>
        );
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
                                    <AppBar position="static" color="default">
                                        <Tabs
                                            value={value}
                                            onChange={handleChangeValue}
                                            indicatorColor="primary"
                                            textColor="primary"
                                            variant="scrollable"
                                            scrollButtons="auto"
                                            aria-label="scrollable auto"
                                        >
                                            {
                                                years && years.map((year, index) => {
                                                    return <Tab
                                                        key={index}
                                                        icon={<GenericIcon image={year.image} year={year.year} />}
                                                        {...a11yProps(index)}
                                                    />
                                                })
                                            }
                                        </Tabs>
                                    </AppBar>
                                    {
                                        fighters && years.map((year, index) => {
                                            return <TabPanel key={index} value={value} index={index}>
                                                <Grid container>
                                                    {
                                                        loading && <Loading />
                                                    }
                                                    {
                                                        fighters[index] && fighters[index].fighters && !loading && fighters[index].fighters.map((fighter, id) => {
                                                            return <Grid item xs={6} md={4} lg={2}>
                                                                <FighterCard notCollected={!fighter.collected} display key={id} fighter={fighter} index={id} from={`fighters-${index}`} />
                                                            </Grid>
                                                        })
                                                    }
                                                </Grid>
                                            </TabPanel>
                                        })
                                    }
                                </> : <Typography>You did not collect any fighters yet</Typography>
                            }
                        </Grid>
                    </Grid>
                </Container>
        }
    </>
}