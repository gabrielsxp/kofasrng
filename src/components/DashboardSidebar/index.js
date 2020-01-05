import React, { useContext } from 'react';
import { getCurrentUser } from '../../services/Auth/index';
import DashboardContext from '../Dashboard/context';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { FaUsers } from 'react-icons/fa';
import { FaKey } from 'react-icons/fa';
import { GiCutDiamond } from 'react-icons/gi';

const drawerWidth = 240;
const smDrawerWidth = 60;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
    listItem: {
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText
        }
    },
    drawer: {
        [theme.breakpoints.down('md')]: {
            width: smDrawerWidth
        },
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        [theme.breakpoints.down('md')]: {
            width: smDrawerWidth,
            overflow: 'hidden'
        },
        width: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
    icon: {
        width: '1.25rem',
        height: '1.25rem'
    },
    selected: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText
    },
    selectedIcon: {
        color: theme.palette.primary.contrastText
    },
    visible: {
        display: 'block',
        [theme.breakpoints.down('md')]: {
            display: 'none'
        },
    }
}));

const items = [
    { name: 'Create Banner', icon: GiCutDiamond },
    { name: 'Create Default Pool', icon: FaUsers }
];

export default function DashboardSidebar() {
    const classes = useStyles();
    const user = getCurrentUser();

    const {
        currentItem,
        setCurrentItem
    } = useContext(DashboardContext);
    console.log('Current Item: ' + currentItem);

    return <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
            paper: classes.drawerPaper,
        }}
        anchor="left"
    >
        <div className={classes.toolbar} />
        <p className={classes.visible} style={{ padding: '0px 20px' }}>Hello, {user.username}</p>
        <Divider />
        <List>
            {items && items.map((item, index) => (
                <ListItem onClick={() => setCurrentItem(index)} button key={index} className={clsx({ [classes.selected]: currentItem === index }, classes.listItem)}>
                    <ListItemIcon>{<item.icon className={clsx(classes.icon, { [classes.selectedIcon]: index === currentItem })} />}</ListItemIcon>
                    <ListItemText primary={item.name} />
                </ListItem>
            ))}
            <Divider />
            <ListItem button onClick={() => setCurrentItem(items.length)} className={clsx({ [classes.selected]: currentItem === items.length }, classes.listItem)}>
                <ListItemIcon className={clsx(classes.icon, { [classes.selectedIcon]: items.length === currentItem })}>{<FaKey />}</ListItemIcon>
                <ListItemText primary="Change Password" />
            </ListItem>
        </List>
    </Drawer>
}