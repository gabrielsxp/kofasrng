import React, { useState } from 'react';
import clsx from 'clsx';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    button: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.primary.contrastText
    },
    alignCenter: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    alignFilter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    title: {
        color: theme.palette.primary.main,
        paddingRight: '15px'
    },
    section: {
        padding: '80px 10px'
    }
}));

export default function Filter({ filters, callback }) {
    const classes = useStyles();

    const [filter, setFilter] = useState(filters[0]);

    const handleChange = (event) => {
        setFilter(event.target.value);
    }

    const inputFormat = (value) => {
        return value.trim().toLowerCase().replace(' ', '_');
    }

    return <div className={classes.alignFilter}>
        <FormControl className={classes.formControl}>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filter}
                onChange={(event) => handleChange(event)}
            >
                {
                    filters && filters.map((filter, index) => {
                        return <MenuItem value={filter} key={index}>{filter}</MenuItem>
                    })
                }
            </Select>
        </FormControl>
        <FormControl>
            <Button onClick={() => callback(inputFormat(filter))} className={clsx(classes.button, 'filter-button')}>Filter</Button>
        </FormControl>
    </div>
}