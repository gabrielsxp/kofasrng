import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FaHeart } from 'react-icons/fa';
import IconButton from '@material-ui/core/IconButton';
import CustomMessage from '../CustomMessage/index';
import Tooltip from '@material-ui/core/Tooltip';
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    WhatsappShareButton,
    WhatsappIcon,
} from "react-share";
import constants from '../../constants';
import axios from '../../axios';

const useStyles = makeStyles(theme => ({
    shrink: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        [theme.breakpoints.down('sm')]: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column'
        }
    }
}));

export default function ShareComponent({ summon, hasUser, dark }) {
    const classes = useStyles();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const saveFavourite = async () => {
        setSuccess(false);
        try {
            await axios.post(`/favourites/${summon}`);
            setSuccess('Summon added to favourites');
        } catch (error) {
            setError(error);
        }
    }

    const handleCloseError = () => {
        setError(false);
    }

    const handleCloseSuccess = () => {
        setSuccess(false);
    }

    return <>
        {
            error && <CustomMessage open={error ? true : false} message={error} handleClose={handleCloseError} type="error"></CustomMessage>
        }
        {
            success && <CustomMessage open={success ? true : false} message={success} handleClose={handleCloseSuccess} type="success"></CustomMessage>
        }
        <div className={classes.shrink} style={{ color: `${dark ? '#333' : '#fff'}`, width: '100%' }}>
            <div style={{ width: '100%', marginTop: '10px', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '15px' }}>Share this summon: </span><FacebookShareButton
                    url={constants.SHARE_BASE_URL + summon}
                    quote={`Look at this summon`}
                    style={{ marginRight: '15px' }}
                >
                    <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton
                    url={constants.SHARE_BASE_URL + summon}
                    quote={`Look at this summon`}
                    style={{ marginRight: '15px' }}
                >
                    <TwitterIcon size={32} round />
                </TwitterShareButton>
                <WhatsappShareButton
                    url={constants.SHARE_BASE_URL + summon}
                    quote={`Look at this summon`}
                    style={{ marginRight: '10px' }}
                >
                    <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                {
                    hasUser && <Tooltip title="Save to favorites"><IconButton onClick={() => saveFavourite()} aria-label="save favorite" color="primary">
                        <FaHeart style={{ color: '#ffa099', width: '25px', height: '25px', marginBottom: '5px' }} />
                    </IconButton></Tooltip>
                }
            </div>
        </div>
    </>
}