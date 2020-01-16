import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import './style.css';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Logo from '../Logo/index';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import { useHistory } from 'react-router-dom';
import constants from '../../constants';
import logo from '../../images/logo.png';
import { logout, removeCurrentUser } from '../../services/Auth/index';
import { useSelector, useDispatch } from 'react-redux';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: theme.spacing(2),
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none'
        }
    },
    logo: {
        width: 120,
        height: 'auto',
        flexGrow: 1,
        flexBasis: 120
    },
    title: {
        flexGrow: 1,
    },
    appBarItem: {
        color: `#BDBDBD`,
        textDecoration: 'none',
        marginLeft: '5px',
        borderBottom: '3px solid #fff'
    },
    appBarItemMobile: {
        color: theme.palette.secondary.main,
        textDecoration: 'none',
        marginLeft: '5px'
    },
    activeAppBarItemMobile: {
        backgroundColor: "#303F9F"
    },
    activeAppBarItemMobileText: {
        color: "#fff"
    },
    itemContainer: {
        padding: '10px',
        borderBottom: `3px solid #303F9F`,
        marginLeft: '10px'
    },
    active: {
        borderBottom: '3px solid #fff',
    },
    activeText: {
        color: '#fff'
    },
    list: {
        width: 200
    },
    desktopSection: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex'
        }
    },
    mobileMenuItem: {
        color: theme.palette.primary
    },
    shrinkAppBar: {
        [theme.breakpoints.down('md')]: {
            marginLeft: '60px',
            width: `calc(100% - 60px)`
        },
        marginLeft: '240px',
        width: `calc(100% - 240px)`
    }
}));



const appBarLinks = [
    { title: 'Home', link: constants.HOME },
    { title: 'Banners', link: constants.BANNERS },
    { title: 'Stats', link: constants.STATS },
    { title: 'Tier Lists', link: constants.TIER_LISTS }
];

const AppBarItem = ({ linkTo, title, onClick }) => {
    let location = useLocation();
    let thisLocation = title.toLowerCase().replace(' ', '');
    
    console.log(thisLocation, location.pathname);

    const classes = useStyles();
    return <div onClick={onClick} key={title} className={clsx(classes.itemContainer, location.pathname.includes(thisLocation) ? classes.active : '')}>
        <Link to={linkTo ? linkTo : "#"} className={clsx(classes.appBarItem, location.pathname.includes(thisLocation) ? classes.activeText : null)}>
            <Typography>{title}</Typography>
        </Link>
    </div>
}

const DesktopSection = ({ user, signOut }) => {
    const classes = useStyles();

    return <div className={classes.desktopSection}>
        {
            appBarLinks ? appBarLinks.map((item, index) => {
                return <AppBarItem key={index} linkTo={item.link} title={item.title} />
            }) : null
        }
        {
            user !== null ? <>
                <AppBarItem linkTo={constants.ADMIN} title="Dashboard" />
                <AppBarItem onClick={() => signOut()} title="Sign Out" />
            </> :
                <>
                    <AppBarItem linkTo={`${constants.SIGN_IN}`} title={"Sign In"} />
                </>
        }
    </div>
}

export default function MainAppBar() {
    const classes = useStyles();
    let location = useLocation();
    let thisLocation = location.pathname;
    let history = useHistory();

    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    const toggleMenu = () => {
        setOpenMobileMenu(!openMobileMenu);
    }

    const closeMobileMenu = () => {
        setOpenMobileMenu(false);
    }

    const MobileItem = ({ linkTo, title, onClick }) => {
        let location = useLocation();
        var thisLocation = title.toLowerCase(title).replace(' ', '');
        console.log(location.pathname, thisLocation);

        return <Link onClick={onClick} to={linkTo ? linkTo : "#"} className={classes.appBarItemMobile}><ListItem button key={title} className={location.pathname === `/${thisLocation}` ? classes.activeAppBarItemMobile : null}>
            <ListItemText className={location.pathname === `/${thisLocation}` ? classes.activeAppBarItemMobileText : null}>
                {title}
            </ListItemText>
        </ListItem>
        </Link>
    }

    const SideList = ({ user, signOut }) => {
        return <div className={classes.list}>
            <List>
                {
                    appBarLinks ? appBarLinks.map((item, index) => {
                        return <MobileItem onClick={() => closeMobileMenu()} linkTo={item.link ? item.link : "#"} title={item.title} key={index} />
                    }) : null
                }
                {
                    user !== null ? <>
                        <MobileItem onClick={() => closeMobileMenu()} linkTo={constants.ADMIN} title="Dashboard" />
                        <MobileItem onClick={() => signOut()} title="Sign Out" />
                    </> :
                        <>
                            <MobileItem linkTo={`${constants.SIGN_IN}`} title={"Sign In"} />
                        </>
                }
            </List>
        </div>
    }

    const signOut = () => {
        logout();
        closeMobileMenu();
        removeCurrentUser();
        dispatch({ type: 'AUTHENTICATED_USER', user: null });
    }

    useEffect(() => {
        if (location.pathname === '/') {
            history.push(constants.HOME);
        }
    }, []);

    return (
        <div className={classes.root}>
            <AppBar position="static" className={clsx(thisLocation.includes(constants.ADMIN) && classes.shrinkAppBar)}>
                <Toolbar>
                    <div className={classes.logo}>
                        <Link to={constants.HOME}>
                            <Logo width={150} source={logo} />
                        </Link>
                    </div>
                    <DesktopSection user={user} signOut={signOut} />
                    <Drawer anchor="right" open={openMobileMenu} onClose={() => toggleMenu()}>
                        <SideList user={user} signOut={signOut} />
                    </Drawer>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => toggleMenu()}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </div>
    );
}
