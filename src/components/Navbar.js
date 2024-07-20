import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { auth, db } from '../firebase-config.js'
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import AccountCircle from '@mui/icons-material/AccountCircle';


const Navbar = ({ isAuth, signUserOut, toggleDarkMode, toggleDarkTheme }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [userData, setUserData] = useState(null)
 
    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
              
              setUserData(user)
              console.log(user)
            } else {
              // User is signed out
              // ...
              console.log("user is logged out")
            }
          });
         
    }, [])

    const handleLogout = () => {
        signUserOut();
        setAnchorEl(null);
    }

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar className='navbar' position="static" sx={{
            // border: toggleDarkMode ? '2px solid grey' : '2px solid black',

            display: 'flex',
            justifyContent: 'center',
            boxShadow: 2,
            borderRadius: '16px',
            width: '45%',
            height: '40px',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '10px',
        }}>
            <Toolbar>
                <IconButton
                    edge="start"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >

                </IconButton>
                <Typography component="div" sx={{ flexGrow: 1, fontsize: '13px', fontWeight: 'bold' }}>
                    Chat Rooms
                </Typography>
                {toggleDarkMode ? <LightModeIcon onClick={toggleDarkTheme} /> : <DarkModeIcon onClick={toggleDarkTheme} />}
               
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                >
                    {userData && isAuth ? <Avatar sx={{ width: 22, height: 22 }} alt={userData.displayName} src={userData.photoURL} /> : <AccountCircle sx={{ width: 22, height: 22 }} />}
                </IconButton>
                <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    {isAuth ? <MenuItem onClick={handleLogout}>LogOut</MenuItem>: null}
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;