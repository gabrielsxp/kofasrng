import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { amber, green } from '@material-ui/core/colors';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IconButton from '@material-ui/core/IconButton';
import { FaTimesCircle } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa';
import { FaInfoCircle } from 'react-icons/fa';
import { FaExclamationTriangle } from 'react-icons/fa';

const customIcons = {
    error: FaTimesCircle,
    success: FaCheckCircle,
    info: FaInfoCircle,
    warning: FaExclamationTriangle
}

const useStyles = makeStyles(theme => createStyles({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.main,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20
    },
    spaceRight: {
        marginRight: theme.spacing(2)
    },
    message: {
        display: 'flex',
        alignItems: 'space-between',
    }
}));

function CustomMessage({ type, message, handleClose, open }) {
    const classes = useStyles();
    const Icon = customIcons[type] || null;
    console.log()
    return (
        <ClickAwayListener onClickAway={() => handleClose()}>
            <Snackbar
                open={open}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
            >
                <SnackbarContent
                    className={clsx({ [classes[type]]: type })}
                    aria-describedby="client-snackbar"
                    message={
                        <span id="client-snackbar" className={classes.message}>
                            {Icon && <Icon className={clsx(classes.icon, classes.spaceRight)} />}
                            {message}
                        </span>
                    }
                    action={[
                        <IconButton key="close" aria-label="close" color="inherit" onClick={handleClose}>
                            <FaTimes className={classes.icon} />
                        </IconButton>,
                    ]}
                />
            </Snackbar>
        </ClickAwayListener>
    );
}

CustomMessage.propTypes = {
    type: PropTypes.string,
    message: PropTypes.string,
    handleClose: PropTypes.func,
    open: PropTypes.bool
};

export default CustomMessage;