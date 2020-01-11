import React, { useState, useContext } from 'react';
import PoolContext from '../PoolContainer/context';
import { makeStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import CustomMessage from '../CustomMessage/index';
import FormControl from '@material-ui/core/FormControl';
import constants from '../../constants';
import axios from '../../axios';

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
    }
}));

function difference(selected) {
    return (fighter) => {
        return selected.filter((selectedFighter) => {
            return fighter._id === selectedFighter._id;
        }).length === 0;
    }
}


export default function FilterFighters() {
    const classes = useStyles();
    const [colors, setColors] = useState([
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
    const [error, setError] = useState(false);
    const {selectedFighters, setFighters} = useContext(PoolContext);

    const filterFighters = async () => {
        const colorsQuery = colors.filter(color => color.checked)
            .map(c => c.name)
            .join(',');
        const typesQuery = types.filter(type => type.checked)
            .map(t => t.name)
            .join(',');
        const raritiesQuery = rarities.filter(rarity => rarity.checked)
            .map(r => r.name)
            .join(',');
        let cQuery = `${colorsQuery !== '' ? 'color=' + colorsQuery : ''}`;
        let tQuery = `${typesQuery !== '' ? '&type=' + typesQuery : ''}`;
        let rQuery = `${raritiesQuery !== '' ? '&rarity=' + raritiesQuery : ''}`;

        const query = `?${cQuery + tQuery + rQuery}`;

        try {
            const response = await axios.get(`/fighters/filter${query}`);
            console.log(response);
            if (response.data.fighters) {
                let f = response.data.fighters;
                f = f.filter(difference(selectedFighters));
                setFighters([...f]);
            } else {
                setError('Unable to query');
            }
        } catch (error) {
            setError('Unable to query');
        }
    }

    const handleFightersColorChange = (event, index) => {
        console.log(index, event.target.checked);
        const c = colors;
        c[index].checked = event.target.checked;
        setColors([...c]);
        filterFighters();
    }

    const handleFightersTypeChange = (event, index) => {
        const t = types;
        t[index].checked = event.target.checked;
        setTypes([...t]);
        filterFighters();
    }

    const handleFightersRaritiesChange = (event, index) => {
        const r = rarities;
        r[index].checked = event.target.checked;
        setRarities([...r]);
        filterFighters();
    }

    const handleClose = () => {
        setError(false);
    }

    return <>
        {error && <CustomMessage type="error" message={error} handleClose={handleClose} open={error ? true : false} />}
        <form action="" noValidate>
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
        </form>
    </>
}