import React, { useState, useEffect } from 'react';
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
import Loading from '../Loading/index';
import CustomMessage from '../CustomMessage/index';
import red from '@material-ui/core/colors/red';
import { FaTimes } from 'react-icons/fa';
import { MdClearAll } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';
import { useLocation } from 'react-router';

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
    }
}));

export default function TierListMaker() {

    const classes = useStyles();
    const [fighters, setFighters] = useState(null);
    const [loadingFighters, setLoadingFighters] = useState(false);
    const [check, setCheck] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

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

    const move = (index, from, to) => {
        console.log(index, from, to);
        if (from === to) {
            return;
        }
        if (from === 'fighters') {
            const fightersCopy = [...fighters];
            const listsCopy = [...lists];
            const toIndex = to.split("_")[1];
            let list = lists[toIndex];

            const fighter = fightersCopy.splice(index, 1);
            list.fighters = list.fighters.concat(fighter);
            listsCopy.splice(toIndex, 1, list);

            setFighters([...fightersCopy]);
            setLists([...listsCopy]);
        } else {
            if (to === 'fighters') {
                const listIndex = from.split("_")[1];
                const list = lists[listIndex];

                const fighter = list.fighters.splice(index, 1);
                const fightersCopy = [...fighter, ...fighters];
                const listsCopy = [...lists];
                listsCopy.splice(listIndex, 1, list);

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
        let fightersCopy = [...listFighters, ...fighters];
        listsCopy[index].fighters = [];
        setFighters([...fightersCopy]);
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
            if (response.data.tierList) {
                const loadedTierList = response.data.tierList;
                let includedFighters = loadedTierList.lists.reduce((fighters, list) => {
                    fighters = fighters.concat(list.fighters);
                    return fighters;
                }, []);
                let filteredFighters = fighters.filter(difference(includedFighters));
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
                if (loadingTemplate && templateId) {
                    const filteredFighters = await loadTemplate(fighters, templateId);
                    setFighters([...filteredFighters]);
                } else {
                    setFighters([...fighters]);
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
        try {
            const response = await axios.post('/tierlist', { lists });
            if (response.data.tierList) {
                setSuccess('Tier List Created');
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
        console.log('loaded');
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
            move(item.index, item.from, 'fighters')
        },
        collect: monitor => {
            return {
                hovered: monitor.isOver()
            }
        }
    });

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
                    <Grid type="fighters" ref={dropRef} item xs={12} md={4}
                        className={clsx(classes.fightersContainer, classes.item1, { [classes.hovered]: hovered })}>
                        <div className={classes.fightersWrapper}>
                            {
                                loadingFighters && <Loading />
                            }
                            {
                                fighters && !loadingFighters && fighters.map((fighter, index) => {
                                    return <DraggableFighter key={index} fighter={fighter} index={index} from="fighters" />
                                })
                            }
                        </div>
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
                                            <IconButton className={classes.iconButton}
                                                size="small"
                                                onClick={() => addItemList()}
                                                disabled={lists.length >= 6}
                                            >
                                                <FaPlus
                                                    className={clsx(classes.plusIcon, { [classes.plusIconDisabled]: lists.length >= 6 })}
                                                />
                                            </IconButton>
                                            <Button
                                                disabled={!check || loading}
                                                className={clsx(classes.button, { [classes.disabledButton]: (!check || loading) })}
                                                onClick={() => saveChanges()}
                                            >Save Changes</Button>
                                        </div>
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
