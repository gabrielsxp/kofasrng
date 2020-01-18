import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FaHeart } from 'react-icons/fa';
import IconButton from '@material-ui/core/IconButton';
import CustomMessage from '../CustomMessage/index';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Tooltip from '@material-ui/core/Tooltip';
import InputAdornment from '@material-ui/core/InputAdornment';
import { FaLink } from 'react-icons/fa';
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
    },
    outline: {
        border: 'none',
        color: props =>  props.dark ? 'rgba(0,0,0,0.48)' : "#fff",
        '& button': {
            color: props => props.dark ? 'rgba(0,0,0,0.48)' : "#fff"
        }
    }
}));

function copyClipboard(type) {
    /* Get the text field */
    const id = type === 'summon' ? 
        "outlined-share-link-summon" : type === 'tierlist' ? 
        "outlined-share-link-tierlist" : type === 'banner' ? 
        "outlined-share-link-banner" : null;
    var copyText = document.getElementById(id);
  
    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  
    /* Copy the text inside the text field */
    document.execCommand("copy");
  }

export default function ShareComponent({ summon, tierlist, banner, hasUser, dark }) {
    const classes = useStyles({dark});
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
                {
                    summon && <><span style={{ marginRight: '15px' }}>Share this summon: </span> <FacebookShareButton
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
                    </>
                }
                {
                    tierlist && <><span style={{ marginRight: '15px' }}>Share this Tier List: </span> <FacebookShareButton
                        url={constants.SHARE_BASE_TIER_URL + tierlist}
                        quote={`Look at this Tier List`}
                        style={{ marginRight: '15px' }}
                    >
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                        <TwitterShareButton
                            url={constants.SHARE_BASE_TIER_URL + tierlist}
                            quote={`Look at this Tier List`}
                            style={{ marginRight: '15px' }}
                        >
                            <TwitterIcon size={32} round />
                        </TwitterShareButton>
                        <WhatsappShareButton
                            url={constants.SHARE_BASE_TIER_URL + tierlist}
                            quote={`Look at this Tier List`}
                            style={{ marginRight: '10px' }}
                        >
                            <WhatsappIcon size={32} round />
                        </WhatsappShareButton>
                    </>
                }
                {
                    banner && <><span style={{ marginRight: '15px' }}>Share this Banner </span> <FacebookShareButton
                        url={constants.SHARE_BASE_BANNER_URL + banner}
                        quote={`Look at this Tier List`}
                        style={{ marginRight: '15px' }}
                    >
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                        <TwitterShareButton
                            url={constants.SHARE_BASE_BANNER_URL + banner}
                            quote={`Look at this Tier List`}
                            style={{ marginRight: '15px' }}
                        >
                            <TwitterIcon size={32} round />
                        </TwitterShareButton>
                        <WhatsappShareButton
                            url={constants.SHARE_BASE_BANNER_URL + banner}
                            quote={`Look at this Tier List`}
                            style={{ marginRight: '10px' }}
                        >
                            <WhatsappIcon size={32} round />
                        </WhatsappShareButton>
                    </>
                }
                {
                    tierlist && <OutlinedInput
                        id="outlined-share-link-tierlist"
                        type="text"
                        style={{marginBottom: '10px'}}
                        className={classes.outline}
                        value={`${constants.SHARE_BASE_TIER_URL + tierlist}`}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="copy to clipboard"
                                    edge="end"
                                    onClick={() => copyClipboard("tierlist")}
                                >
                                    <FaLink />
                                </IconButton>
                            </InputAdornment>
                        }
                    ></OutlinedInput>
                }
                {
                    summon && <OutlinedInput
                        id="outlined-share-link-summon"
                        type="text"
                        style={{marginBottom: '10px'}}
                        className={classes.outline}
                        value={`${constants.SHARE_BASE_URL + summon}`}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="copy to clipboard"
                                    edge="end"
                                    onClick={() => copyClipboard("summon")}
                                >
                                    <FaLink />
                                </IconButton>
                            </InputAdornment>
                        }
                    ></OutlinedInput>
                }
                {
                    banner && <OutlinedInput
                        id="outlined-share-link-banner"
                        type="text"
                        style={{marginBottom: '10px'}}
                        className={classes.outline}
                        value={`${constants.SHARE_BASE_BANNER_URL + summon}`}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="copy to clipboard"
                                    edge="end"
                                    onClick={() => copyClipboard("banner")}
                                >
                                    <FaLink />
                                </IconButton>
                            </InputAdornment>
                        }
                    ></OutlinedInput>
                }
            </div>
        </div>
    </>
}