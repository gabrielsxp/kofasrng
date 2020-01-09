import React, { useState } from 'react';
import DashboardContext from './context';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import DashboardSidebar from '../DashboardSidebar/index';
import Loadable from 'react-loadable';
import Loading from '../Loading/index';

const PoolContainer = Loadable({
    loader: () => import('../PoolContainer/index'),
    loading: Loading
});

const BannerContainer = Loadable({
    loader: () => import('../BannerContainer/index'),
    loading: Loading
});

const AccountOverview = Loadable({
    loader: () => import('../AccountOverview/index'),
    loading: Loading
});

const ChangePassword = Loadable({
    loader: () => import('../ChangePassword/index'),
    loading: Loading
})

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        marginLeft: '210px',
        [theme.breakpoints.down('sm')]: {
            marginLeft: '60px',
            width: 'calc(100% - 60px)'
        },
        width: 'calc(100% - 210px)'
    },
}));

export default function Dashboard() {
    const classes = useStyles();
    const [currentItem, setCurrentItem] = useState(0);
    const values = { currentItem, setCurrentItem };

    return <DashboardContext.Provider value={{ ...values }}>
        <Container className={classes.root} >
            {
                currentItem === 0 ? <AccountOverview /> :
                    currentItem === 1 ? <BannerContainer /> :
                        currentItem === 2 ? <PoolContainer /> :
                            currentItem === 3 ? <ChangePassword /> :
                                null
            }
        </Container>
        <DashboardSidebar />
    </DashboardContext.Provider>
}