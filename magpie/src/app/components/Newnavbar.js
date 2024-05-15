import * as React from 'react';
import { Grid, AppBar, Box, Toolbar, IconButton, Typography, Menu, Avatar, Button, Tooltip, MenuItem, Container } from "@mui/material";
import { UserAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


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
            <Grid container spacing={2} sx={{ paddingLeft: 4, paddingRight: 4 }}>
                <Grid item lg={11} xs={10.6}>
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
                                <MenuItem onClick={() => { router.push('/about') }}>
                                    <Typography textAlign="center">{'About'}</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => { router.push('/profile') }}>
                                    <Typography textAlign="center">{'Profile'}</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => { router.push('/dashboard') }}>
                                    <Typography textAlign="center">{'Dashboard'}</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => { router.push('/match') }}>
                                    <Typography textAlign="center">{'Pick a roommate'}</Typography>
                                </MenuItem>  
                                <MenuItem onClick={() => { router.push('/rentals') }}>
                                    <Typography textAlign="center">{'Rentals'}</Typography>
                                </MenuItem>       
                                <MenuItem onClick={() => { router.push('/reviews') }}>
                                    <Typography textAlign="center">{'Reviews'}</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => { router.push('/report') }}>
                                    <Typography textAlign="center">{'Report User'}</Typography>
                                </MenuItem>  
                                <MenuItem onClick={() => { router.push('/agreement') }}>
                                    <Typography textAlign="center">{'Policies'}</Typography>
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