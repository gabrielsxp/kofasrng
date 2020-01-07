import React, { useContext } from 'react';
import PoolContext from '../PoolContainer/context';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import DraggableFighter from '../DraggableFighter/index';
import DropFighterList from '../DropFighterList/index';
import Loading from '../Loading/index';
import constants from '../../constants';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        border: '3px solid #dedede',
        borderRadius: '5px'
    },
    section: {
        padding: '80px 0'
    },
    alignForm: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        width: '100%'
    },
    subTitle: {
        margin: `${theme.spacing(2)}px 0`,
        textAlign: 'right',
        [theme.breakpoints.down('md')]:{
            textAlign: 'left'
        }
    },
    formGroup: {
        margin: `${theme.spacing(2)}px 0`
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    }
}));

export default function PoolEditor() {
    const classes = useStyles();
    const {
        loading,
        fighters,
        selectedFighters
    } = useContext(PoolContext);

    return <>
        <Grid item xs={12} md={7} style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" className={classes.subTitle}>
                    All Fighters
                </Typography>
                {
                    loading[constants.FIGHTERS_INDEX] ? <Loading /> : <DropFighterList alignEnd={true} type="fighters">
                        {
                            fighters && fighters.map((fighter, index) => {
                                return <DraggableFighter index={index} from="fighters" fighter={fighter} key={index} />
                            })
                        }
                    </DropFighterList>
                }
            </div>
        </Grid>
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <FormControl>
                {/* <Button style={{ marginLeft: '10px' }} onClick={() => setLoadedFighters([...loadedSelectedFighters])} variant="contained" color="secondary" size="large">Reset</Button> */}
            </FormControl>
            {
                loading[constants.SELECTED_FIGHTERS_INDEX] ? <Loading /> : <DropFighterList type="selected_fighters">
                    {
                        selectedFighters && selectedFighters.map((fighter, index) => {
                            return <DraggableFighter index={index} from="selected_fighters" fighter={fighter} key={index} />
                        })
                    }
                </DropFighterList>
            }
        </Grid>
    </>
}