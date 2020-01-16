import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/Auth/index';
import DashboardContext from './context';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import DashboardSidebar from '../DashboardSidebar/index';
import Loadable from 'react-loadable';
import Loading from '../Loading/index';

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
});

const Favourites = Loadable({
    loader: () => import('../Favourites/index'),
    loading: Loading
})

const FighterCollection = Loadable({
    loader: () => import('../FighterCollection/index'),
    loading: Loading
});

const TierLists = Loadable({
    loader: () => import('../TierLists/index'),
    loading: Loading
});

export default function Dashboard() {
    const classes = useStyles();
    const [currentItem, setCurrentItem] = useState(0);
    const [user, setUser] = useState(null);
    const values = { currentItem, setCurrentItem };

    useEffect(() => {
        const us = getCurrentUser();
        if (us) {
            setUser({ ...us });
        }
    }, []);

    return <DashboardContext.Provider value={{ ...values }}>
        <Container className={classes.root} >
            {
                currentItem === 0 ? <AccountOverview /> :
                    currentItem === 1 ? <FighterCollection /> :
                        currentItem === 2 ? <Favourites /> :
                            currentItem === 3 ? <TierLists fromUser={user ? user._id : null} /> :
                                currentItem === 4 ? <BannerContainer /> :
                                    currentItem === 5 ? <PoolContainer /> :
                                        currentItem === 6 ? <ChangePassword /> :
                                            null
            }
        </Container>
        <DashboardSidebar />
    </DashboardContext.Provider>
}