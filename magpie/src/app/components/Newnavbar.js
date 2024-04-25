import * as React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import { Grid, AppBar, Box, Toolbar, IconButton, Typography, Menu, Avatar, Button, Tooltip, MenuItem, Container } from "@mui/material";
import { UserAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Dashboard', 'Logout'];

function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [loading, setLoading] = useState(true);


    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const { user, logOut } = UserAuth();

    const uid = user?.uid;
    // const db = getFirestore();
    // const userProfiles = collection(db, 'userProfiles');
    // const query = query(userProfiles, where('uid', '==', uid));
    

    const handleSignOut = () => {
        if (user) {
            logOut();
            router.push('/#');
        } else {
            router.push('/#');


        }
    }
    const router = useRouter();


    useEffect(() => {
        const checkAuthentication = async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
            setLoading(false);
        };
        checkAuthentication();
    }, [user]);

    return (
        <AppBar position="absolute">

            <Grid container spacing={4} sx={{ paddingLeft: 4, paddingRight: 4 }}>
                <Grid item xs={11}>
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            className="logo"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                textDecoration: 'none',
                            }}
                        >
                            {'ROOMMIXER'}
                        </Typography>
                    </Toolbar>

                </Grid>


                <Grid item xs={1}>
                    <Toolbar disableGutters>
                        <Box sx={{ flexGrow: 0, marginLeft: '70%' }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >

                                <MenuItem onClick={() => { router.push('/profile') }}>
                                    <Typography textAlign="center">{'Profile'}</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => { router.push('/dashboard') }}>
                                    <Typography textAlign="center">{'Dashboard'}</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => { router.push('/tour') }}>
                                    <Typography textAlign="center">{'Tour Halls'}</Typography>
                                </MenuItem>      
                                <MenuItem onClick={handleSignOut}>
                                    <Typography textAlign="center">{'Log out'}</Typography>
                                </MenuItem>

                            </Menu>
                        </Box>
                    </Toolbar>
                </Grid>

            </Grid>


        </AppBar>
    );
}
export default ResponsiveAppBar;