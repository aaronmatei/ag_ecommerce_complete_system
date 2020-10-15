import React from "react";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { fade, makeStyles, useTheme } from "@material-ui/core/styles";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    InputBase,
    Badge,
    MenuItem,
    Menu,
    ListItem,
    Drawer,
    CssBaseline,
    Divider,
    ListItemIcon,
    ListItemText,
    MenuList,
    Collapse,
    Slide,
    useScrollTrigger
} from "@material-ui/core";

import MenuIcon from "@material-ui/icons/Menu"

import {
    Search,
    AccountCircle,
    Mail,
    Notifications,
    More,
    ChevronLeft,
    ChevronRight,
    Inbox,
    DashboardRounded,
    GroupAddSharp,
    PermContactCalendarRounded,
    MonetizationOnSharp,
    AttachMoneyRounded,
    AssignmentRounded,
    PollRounded,
    ShoppingBasketRounded,
    ShoppingCartRounded,
    ExpandMore,
    ExpandLess,
    PersonRounded,
    BusinessCenterRounded,
    WcRounded,
    LocalMallRounded,
    SupervisedUserCircleRounded,
    AccountBox,
} from "@material-ui/icons";

import clsx from "clsx";
import { blueGrey, blue, green } from '@material-ui/core/colors';
import { isAuth, signout, authenticate } from '../pages/auth/helpers';





const drawerWidth = 240;
const drawerbg = blueGrey[900];
const appbarbg = blue[700];

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    grow: {
        flexGrow: 1,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: "none",
        [theme.breakpoints.up("sm")]: {
            display: "block",
        },
    },
    search: {
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        "&:hover": {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing(3),
            width: "auto",
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    inputRoot: {
        color: "inherit",
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
    sectionDesktop: {
        display: "none",
        [theme.breakpoints.up("md")]: {
            display: "flex",
        },
    },
    sectionMobile: {
        display: "flex",
        [theme.breakpoints.up("md")]: {
            display: "none",
        },
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: "hidden",
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

export default function Layout(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [openCollapse, setOpenCollapse] = React.useState(false);
    const [openCollapseEcommerce, setOpenCollapseEcommerce] = React.useState(
        false
    );

    //drawer
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);

    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };


    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };
    const handleClick = () => {
        setOpenCollapse(!openCollapse);
    };
    const handleClickEcommerce = () => {
        setOpenCollapseEcommerce(!openCollapseEcommerce);
    };




    //drawer
    const renderDrawer = (
        <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
            })}
            classes={{
                paper: clsx({
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                }),
            }}
        >
            <div className={classes.toolbar}>
                <Typography variant="h6" noWrap>
                    BayTron
        </Typography>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === "rtl" ? (
                        <ChevronRight />
                    ) : (
                            <ChevronLeft />
                        )}
                </IconButton>
            </div>
            <Divider />

            <MenuList
                className={classes.menuItem}
                style={{ background: `${drawerbg}` }}
            >
                <MenuItem
                    selected={selectedIndex === 0}
                    onClick={(event) => handleListItemClick(event, 0)}
                >
                    <ListItemIcon>
                        <DashboardRounded className={classes.menuItem} />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </MenuItem>
                <MenuItem
                    selected={selectedIndex === 1}
                    onClick={(event) => handleListItemClick(event, 1)}
                    component={Link}
                    to="/users"
                >
                    <ListItemIcon>
                        <GroupAddSharp className={classes.menuItem} />
                    </ListItemIcon>
                    <ListItemText primary="User Management" onClick={handleClick} />
                    {openCollapse ? (
                        <ExpandLess className={classes.expandIcon} />
                    ) : (
                            <ExpandMore className={classes.expandIcon} />
                        )}
                </MenuItem>
                <Collapse
                    in={openCollapse}
                    timeout="auto"
                    unmountOnExit
                    style={{ background: blueGrey[800] }}
                >
                    <MenuList component="div" disablePadding>
                        <MenuItem component={Link} to="/users" className={classes.nested}>
                            <ListItemIcon>
                                <PersonRounded className={classes.menuItem} />
                            </ListItemIcon>
                            <ListItemText primary="Manage users" />
                        </MenuItem>
                        <MenuItem component={Link} to="/" className={classes.nested}>
                            <ListItemIcon>
                                <BusinessCenterRounded className={classes.menuItem} />
                            </ListItemIcon>
                            <ListItemText primary="Roles" />
                        </MenuItem>
                        <MenuItem component={Link} to="/" className={classes.nested}>
                            <ListItemIcon>
                                <WcRounded className={classes.menuItem} />
                            </ListItemIcon>
                            <ListItemText primary="Sales Agents" />
                        </MenuItem>
                    </MenuList>
                </Collapse>
                <MenuItem
                    selected={selectedIndex === 2}
                    onClick={(event) => handleListItemClick(event, 2)}
                >
                    <ListItemIcon>
                        <PermContactCalendarRounded className={classes.menuItem} />
                    </ListItemIcon>
                    <ListItemText primary="Contacts" />
                </MenuItem>
                <MenuItem
                    selected={selectedIndex === 3}
                    onClick={(event) => handleListItemClick(event, 3)}
                >
                    <ListItemIcon>
                        <MonetizationOnSharp className={classes.menuItem} />
                    </ListItemIcon>
                    <ListItemText primary="Purchases" />
                </MenuItem>
                <MenuItem
                    selected={selectedIndex === 4}
                    onClick={(event) => handleListItemClick(event, 4)}
                >
                    <ListItemIcon>
                        <AttachMoneyRounded className={classes.menuItem} />
                    </ListItemIcon>
                    <ListItemText primary="Sales" />
                </MenuItem>
                <MenuItem
                    component={Link}
                    to="/suppliers"
                    selected={selectedIndex === 5}
                    onClick={(event) => handleListItemClick(event, 5)}
                >
                    <ListItemIcon>
                        <SupervisedUserCircleRounded className={classes.menuItem} />
                    </ListItemIcon>
                    <ListItemText primary="Suppliers" />
                </MenuItem>
                <MenuItem
                    selected={selectedIndex === 6}
                    onClick={(event) => handleListItemClick(event, 6)}
                    component={Link}
                    to="/apps/ecommerce/products"
                >
                    <ListItemIcon>
                        <ShoppingCartRounded className={classes.menuItem} />
                    </ListItemIcon>
                    <ListItemText primary="Ecommerce" onClick={handleClickEcommerce} />
                    {openCollapseEcommerce ? (
                        <ExpandLess className={classes.expandIcon} />
                    ) : (
                            <ExpandMore className={classes.expandIcon} />
                        )}
                </MenuItem>
                <Collapse
                    in={openCollapseEcommerce}
                    timeout="auto"
                    unmountOnExit
                    style={{ background: blueGrey[800] }}
                >
                    <MenuList component="div" disablePadding>
                        <MenuItem
                            component={Link}
                            to="/products"
                            className={classes.nested}
                        >
                            <ListItemIcon>
                                <ShoppingBasketRounded className={classes.menuItem} />
                            </ListItemIcon>
                            <ListItemText primary="Products" />
                        </MenuItem>
                        <MenuItem
                            component={Link}
                            to="/apps/ecommerce/invoices"
                            className={classes.nested}
                        >
                            <ListItemIcon>
                                <ShoppingBasketRounded className={classes.menuItem} />
                            </ListItemIcon>
                            <ListItemText primary="Invoices" />
                        </MenuItem>
                        <MenuItem
                            component={Link}
                            to="/apps/ecommerce/orders"
                            className={classes.nested}
                        >
                            <ListItemIcon>
                                <BusinessCenterRounded className={classes.menuItem} />
                            </ListItemIcon>
                            <ListItemText primary="Orders" />
                        </MenuItem>
                        <MenuItem
                            component={Link}
                            to="/apps/ecommerce/products"
                            className={classes.nested}
                        >
                            <ListItemIcon>
                                <LocalMallRounded className={classes.menuItem} />
                            </ListItemIcon>
                            <ListItemText primary="Shop" />
                        </MenuItem>
                    </MenuList>
                </Collapse>
                <MenuItem
                    selected={selectedIndex === 7}
                    onClick={(event) => handleListItemClick(event, 7)}
                >
                    <ListItemIcon>
                        <AssignmentRounded className={classes.menuItem} />
                    </ListItemIcon>
                    <ListItemText primary="Inventory" />
                </MenuItem>
                <MenuItem
                    selected={selectedIndex === 8}
                    onClick={(event) => handleListItemClick(event, 8)}
                >
                    <ListItemIcon>
                        <PollRounded className={classes.menuItem} />
                    </ListItemIcon>
                    <ListItemText primary="Reports" />
                </MenuItem>
            </MenuList>
            <Divider />
            <MenuList>
                {["HR", "Taxes", "Settings"].map((text, index) => (
                    <MenuItem button key={text}>
                        <ListItemIcon>
                            {index % 2 === 0 ? <Inbox /> : <Mail />}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </MenuItem>
                ))}
            </MenuList>
        </Drawer>
    );

    const { children, history, match } = props;


    const isActive = path => {
        if (history.location.path === path) {
            return {
                color: '#000'
            }
        } else {
            return {
                color: '#fff'
            }

        }
    }





    const menuId = "primary-search-account-menu";
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            {!isAuth() && <MenuItem onCLick={handleMenuClose} component={Link} to="/signup" >sign up</MenuItem>}
            {!isAuth() && <MenuItem onClick={handleMenuClose} component={Link} to="/signin" >Sign in</MenuItem>}
            {isAuth() && <MenuItem onClick={() => { handleMenuClose(); signout(() => { }); }} component={Link} to="/">Sign out</MenuItem>}
            {isAuth() && <MenuItem onClick={handleMenuClose} component={Link} to={`/auth/user/user_info/${isAuth().id}`}>Profile</MenuItem>}
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
        </Menu>
    );

    const mobileMenuId = "primary-search-account-menu-mobile";
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >

            <MenuItem>
                <IconButton aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="secondary">
                        <Mail />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton aria-label="show 11 new notifications" color="inherit">
                    <Badge badgeContent={11} color="secondary">
                        <Notifications />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />

                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    //app bar
    const renderAppBar = (
        <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
            })}
        >
            <Toolbar>
                <IconButton
                    edge="start"
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                >
                    <MenuIcon />
                </IconButton>
                <Typography className={classes.title} variant="h6" noWrap>
                    Ecommerce
                </Typography>
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <Search />
                    </div>
                    <InputBase
                        placeholder="Search…"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{ "aria-label": "search" }}
                    />
                </div>
                <div className={classes.grow} />
                <div className={classes.sectionDesktop}>

                    <IconButton aria-label="show 4 new mails" color="inherit">
                        <Badge badgeContent={4} color="secondary">
                            <Mail />
                        </Badge>
                    </IconButton>
                    <IconButton aria-label="show 17 new notifications" color="inherit">
                        <Badge badgeContent={17} color="secondary">
                            <Notifications />
                        </Badge>
                    </IconButton>
                    <IconButton
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        <AccountCircle />
                        {isAuth() && isAuth().username}

                    </IconButton>
                </div>
                <div className={classes.sectionMobile}>
                    <IconButton
                        aria-label="show more"
                        aria-controls={mobileMenuId}
                        aria-haspopup="true"
                        onClick={handleMobileMenuOpen}
                        color="inherit"
                    >
                        <More />
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
    );

    //hide on scroll
    function HideOnScroll(props) {
        const { children, window } = props;
        // Note that you normally won't need to set the window ref as useScrollTrigger
        // will default to window.
        // This is only being set here because the demo is in an iframe.
        const trigger = useScrollTrigger({ target: window ? window() : undefined });

        return (
            <Slide appear={false} direction="down" in={!trigger}>
                {children}
            </Slide>
        );
    }

    HideOnScroll.propTypes = {
        children: PropTypes.element.isRequired,
        /**
         * Injected by the documentation to work in an iframe.
         * You won't need it on your project.
         */
        window: PropTypes.func,
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <HideOnScroll {...props}>{renderAppBar}</HideOnScroll>
            {/* {renderDrawer} */}
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {children}
            </main>
            {renderMobileMenu}
            {renderMenu}
        </div>
    );
}
