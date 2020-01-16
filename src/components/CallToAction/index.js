import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {useHistory} from 'react-router-dom';
import constants from '../../constants';

const useStyles = makeStyles(theme => createStyles({
    root: {
        zIndex: 0,
        width: '100%',
        height: '50vh'
    },
    content: {
        zIndex: 1,
        width: `100%`,
        height: `100%`,
        backgroundColor: 'rgba(51, 84, 132, 0.5)',
    },
    alignContent: {
        zIndex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    verticalAlign: {
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        padding: `0px ${theme.spacing(2)}px`
    },
    button: {
        marginTop: theme.spacing(2)
    },
    title: {
        color: theme.palette.primary.contrastText
    }
}));

function CallToAction({title, buttonTitle, img, link}) {
    const classes = useStyles();
    const history = useHistory();
    return (
        <div className={classes.root} style={{
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundOrigin: 'center',
            backgroundAttachment: 'fixed'
        }} >
            <div className={classes.content}>
                <div className={classes.alignContent}>
                    <div className={classes.verticalAlign}>
                        <Typography className={classes.title} variant="h4">{title}</Typography>
                        <Button onClick={() => history.push(link)} size="large" variant="contained" color="primary" className={classes.button}>{buttonTitle}</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
  
export default CallToAction;