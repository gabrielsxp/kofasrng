import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/Auth/index';
import { useDrop } from 'react-dnd';
import clsx from 'clsx';
import DraggableFighter from '../DraggableFighter/index';
import TierListContext from './context';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import axios from '../../axios';
import TierListSection from '../TierListSection/index';
import ShareComponent from '../ShareComponent/index';
import Loading from '../Loading/index';
import CustomMessage from '../CustomMessage/index';
import red from '@material-ui/core/colors/red';
import { FaTimes } from 'react-icons/fa';
import { MdClearAll } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';
import { useLocation } from 'react-router';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import constants from '../../constants';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        overflowX: 'hidden'
    },
    fightersContainer: {
        backgroundColor: "#dedede"
    },
    fightersWrapper: {
        width: '100vh',
        maxHeight: '100vh',
        maxWidth: '100%',
        overflowY: 'scroll',
        padding: '20px',
        [theme.breakpoints.down('md')]: {
            padding: '0',
            display: 'flex',
            flexWrap: 'nowrap',
            alignItems: 'center',
            overflowX: 'scroll',
            height: '150px',
            overflowY: 'hidden',
            minWidth: '100vw',
        }
    },
    item1: {
        order: 1,
        [theme.breakpoints.down('md')]: {
            order: 2
        }
    },
    item2: {
        order: 2,
        [theme.breakpoints.down('md')]: {
            order: 1
        }
    },
    tierContainer: {
        backgroundColor: '#fff',
        minHeight: '100vh',
        padding: '50px',
        [theme.breakpoints.down('md')]: {
            display: 'flex',
            justifyContent: 'center',
            padding: '20px 10px',
            height: 'calc(100vh - 150px)'
        }
    },
    alignList: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
    },
    deleteIcon: {
        color: red[500]
    },
    clearIcon: {
        color: theme.palette.secondary.main
    },
    plusIcon: {
        color: theme.palette.primary.contrastText,
    },
    plusIconDisabled: {
        color: "#dedede"
    },
    iconButton: {
        backgroundColor: theme.palette.primary.main,
        padding: '5px',
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
        }
    },
    hovered: {
        backgroundColor: "rgba(48, 63, 159, 0.5)"
    },
    innerListSection: {
        padding: '20px',
        maxHeight: '70vh',
        overflowY: 'auto',
        [theme.breakpoints.down('md')]: {
            maxHeight: 'calc(100vh - 150px)'
        }
    },
    alignAction: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column'
        }
    },
    button: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        [theme.breakpoints.down('sm')]: {
            marginTop: '20px'
        },
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
        }
    },
    disabledButton: {
        backgroundColor: "#dedede!important"
    },
    iconYear: {
        width: '80px',
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

var yearsByIndex = [];
for (let year in years) {
    yearsByIndex[years[year].year] = parseInt(year);
}

export default function TierListMaker() {

    const classes = useStyles();
    const [fighters, setFighters] = useState([]);
    const [loadingFighters, setLoadingFighters] = useState(false);
    const [check, setCheck] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [user, setUser] = useState(null);
    const [share, setShare] = useState(false);
    const [tierList, setTierList] = useState(null);
    const [error, setError] = useState(false);
    const [value, setValue] = useState(0);

    const location = useLocation();

    const defaultTemplate = [
        { fighters: [] },
        { fighters: [] },
        { fighters: [] }];
    const [lists, setLists] = useState([...defaultTemplate]);
    const baseList = { fighters: [] };

    const makeCheck = () => {
        const check = lists.some(list => list.fighters.length > 0);
        setCheck(check);
    }

    const GenericIcon = ({ image, year }) => {
        return <img className={classes.iconYear} src={image} alt={year} />
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const move = (index, from, to) => {
        console.log(index, from, to);
        if (from.match(to)) {
            return;
        }
        if (from.includes('fighters')) {
            const yearIndex = from.split('-')[1];
            let year = fighters[yearIndex];
            const fightersCopy = [...fighters];
            const listsCopy = [...lists];
            const toIndex = to.split("_")[1];
            let list = lists[toIndex];

            const fighter = year.fighters.splice(index, 1);
            list.fighters = list.fighters.concat(fighter);
            listsCopy.splice(toIndex, 1, list);
            fightersCopy.splice(yearIndex, 1, year);

            setFighters([...fightersCopy]);
            setLists([...listsCopy]);
        } else {
            if (to.includes('fighters')) {
                const yearIndex = to.split('-')[1];
                let year = fighters[yearIndex];
                const fightersCopy = [...fighters];
                const listIndex = from.split("_")[1];
                const list = lists[listIndex];

                const fighter = list.fighters.splice(index, 1);
                year.fighters = [...fighter, ...year.fighters];
                const listsCopy = [...lists];
                listsCopy.splice(listIndex, 1, list);
                fightersCopy.splice(yearIndex, 1, year);

                setLists([...listsCopy]);
                setFighters([...fightersCopy]);

                makeCheck();
                return;
            }
            const listsCopy = [...lists];

            const originIndex = from.split("_")[1];
            const originList = lists[originIndex];
            const destinyIndex = to.split("_")[1];
            const destinyList = lists[destinyIndex];

            const fighter = originList.fighters.splice(index, 1);
            destinyList.fighters = destinyList.fighters.concat(fighter);

            listsCopy.splice(originIndex, 1, originList);
            listsCopy.splice(destinyIndex, 1, destinyList);

            setLists([...listsCopy]);
        }

        makeCheck();
    }

    const clearList = (index) => {
        let listsCopy = [...lists];
        let listFighters = [...listsCopy[index].fighters];
        if (listFighters.length === 0) {
            return;
        }
        var allYears = [...fighters];
        for (let i in listFighters) {
            const fighter = listFighters[i];
            const yearIndex = yearsByIndex[fighter.year];
            let year = fighters[yearIndex];
            let fightersYear = year.fighters;
            year.fighters = [fighter, ...fightersYear];
            allYears.splice(yearIndex, 1, year);
        }
        let listExcerpt = listsCopy[index];
        listExcerpt.fighters = [];
        listsCopy.splice(index, 1, listExcerpt);
        setFighters([...allYears]);
        setLists([...listsCopy]);
        makeCheck();
    }

    function difference(selected) {
        return (fighter) => {
            return selected.filter((selectedFighter) => {
                return fighter._id === selectedFighter._id;
            }).length === 0;
        }
    }

    const loadTemplate = async (fighters, templateId) => {
        try {
            const response = await axios.get(`/tierlist/${templateId}`);
            const chooseFighters = fighters;
            if (response.data.tierList) {
                const loadedTierList = response.data.tierList;
                let includedFighters = loadedTierList.lists.reduce((f, list) => {
                    f = f.concat(list.fighters);
                    return f;
                }, []);
                let filteredFighters = chooseFighters.filter(difference(includedFighters));
                setLists([...response.data.tierList.lists]);
                return filteredFighters;
            } else {
                throw response.data.error;
            }
        } catch (error) {
            throw error;
        }
    }

    const loadFighters = async () => {
        const templatePath = location.pathname.split('/');
        let loadingTemplate = templatePath.includes('template');
        var templateId = templatePath.slice(-1)[0];
        setLoadingFighters(true);
        try {
            const response = await axios.get('/fighters');
            if (response.data.fighters) {
                var fighters = response.data.fighters;
                var allFighters = fighters;
                let fightersState = [];
                for (let year in years) {
                    let fightersByYear = [];
                    if (years[year].year !== 'AS') {
                        fightersByYear = fighters.filter(f => f.year === years[year].year).sort(f => f.isFES);
                    } else {
                        fightersByYear = fighters.filter(f => f.isAS).sort(f => f.isFES);
                    }
                    let fightersObject = {
                        year: years[year].year,
                        fighters: fightersByYear
                    };
                    fightersState = fightersState.concat(fightersObject);
                }
                if (loadingTemplate && templateId) {
                    const filteredFighters = await loadTemplate(allFighters, templateId);
                    let templateFighters = [];
                    for (let year in years) {
                        let fightersByYear = [];
                        if (years[year].year !== 'AS') {
                            fightersByYear = filteredFighters.filter(f => f.year === years[year].year).sort(f => f.isFES);
                        } else {
                            fightersByYear = filteredFighters.filter(f => f.isAS).sort(f => f.isFES);
                        }
                        let fightersObject = {
                            year: years[year].year,
                            fighters: fightersByYear
                        };
                        templateFighters = templateFighters.concat(fightersObject);
                    }
                    setFighters([...templateFighters]);
                } else {
                    setFighters([...fightersState]);
                }
            } else {
                setError(response.data.error);
            }
            setLoadingFighters(false);
        } catch (error) {
            console.log();
            setError(error);
            setLoadingFighters(false);
        }
    }

    const saveChanges = async () => {
        setLoading(true);
        setSuccess(false);
        setShare(false);
        try {
            const response = await axios.post('/tierlist', { lists, belongsTo: user ? user._id : null });
            if (response.data.tierList) {
                setSuccess('Tier List Created');
                setShare(true);
                setTierList(response.data.tierList);
            } else {
                setError(error);
            }
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }

    const handleCloseError = () => {
        setError(false);
    }

    const handleCloseSuccess = () => {
        setSuccess(false);
    }

    useEffect(() => {
        const us = getCurrentUser();
        if (us) {
            setUser(us);
        }
        loadFighters();
    }, []);

    const values = {
        move
    };

    const addItemList = () => {
        let l = [...lists];
        l.push(baseList);
        setLists([...l]);
    }

    const removeItemList = (index) => {
        let l = [...lists];
        clearList(index);
        l.splice(index, 1);
        setLists([...l]);
    }

    const [{ hovered }, dropRef] = useDrop({
        accept: 'CARD',
        drop(item, monitor) {
            const yearIndex = yearsByIndex[item.year];
            move(item.index, item.from, `fighters-${yearIndex}`);
        },
        collect: monitor => {
            return {
                hovered: monitor.isOver()
            }
        }
    });

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
            error && <CustomMessage open={error ? true : false} message={error} handleClose={handleCloseError} type="error" />
        }
        {
            success && <CustomMessage open={success ? true : false} message={success} handleClose={handleCloseSuccess} type="success" />
        }
        <TierListContext.Provider value={{ ...values }}>
            <Container style={{ padding: '0' }} maxWidth="xl" className={classes.root}>
                <Grid container>
                    <Grid ref={dropRef} type="fighters" item xs={12} md={4}
                        className={clsx(classes.fightersContainer, classes.item1, { [classes.hovered]: hovered })}>
                        <AppBar position="static" color="default">
                            <Tabs
                                value={value}
                                onChange={handleChange}
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
                                    <div className={classes.fightersWrapper}>
                                        {
                                            loadingFighters && <Loading />
                                        }
                                        {
                                            fighters[index] && fighters[index].fighters && !loadingFighters && fighters[index].fighters.map((fighter, id) => {
                                                return <DraggableFighter key={id} fighter={fighter} index={id} from={`fighters-${index}`} />
                                            })
                                        }
                                    </div>
                                </TabPanel>
                            })
                        }
                    </Grid>
                    <Grid item xs={12} md={8} className={clsx(classes.tierContainer, classes.item2)}>
                        <div style={{ width: '100%' }}>
                            {
                                loadingFighters && <Loading />
                            }
                            {
                                !loadingFighters && lists && <Grid container>
                                    <Grid item xs={12} style={{ marginBottom: '20px' }}>
                                        <Typography variant="h5">Tier List Maker</Typography>
                                        <hr />
                                        <div className={classes.alignAction}>
                                            <Button variant="contained" color="primary" onClick={() => addItemList()}
                                                disabled={lists.length >= 6}>
                                                Add a list <FaPlus style={{ marginLeft: '20px' }} />
                                            </Button>
                                            <Button
                                                disabled={!check || loading}
                                                className={clsx(classes.button, { [classes.disabledButton]: (!check || loading) })}
                                                onClick={() => saveChanges()}
                                            >Save Changes</Button>
                                        </div>
                                        {
                                            share && tierList && <div style={{ margin: '20px 0'}}>
                                                <ShareComponent tierlist={tierList._id} dark />
                                            </div>
                                        }
                                    </Grid>
                                    <Grid item xs={12} className={classes.innerListSection}>
                                        {
                                            lists && lists.length === 0 && <Typography variant="h6">There is no categories to show</Typography>
                                        }
                                        {
                                            lists && lists.map((list, index) => {
                                                return <Grid key={index} container>
                                                    <Grid item xs={10} md={11}>
                                                        <TierListSection fighters={list.fighters} type={`list_${index}`} index={index} />
                                                    </Grid>
                                                    <Grid item xs={2} md={1} className={classes.alignList}>
                                                        <IconButton onClick={() => removeItemList(index)}>
                                                            <FaTimes className={classes.deleteIcon} />
                                                        </IconButton>
                                                        <IconButton onClick={() => clearList(index)}>
                                                            <MdClearAll className={classes.clearIcon} />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            })
                                        }
                                    </Grid>
                                </Grid>
                            }
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </TierListContext.Provider>
    </>
}
