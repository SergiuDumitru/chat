import './App.css';
import { Auth } from './components/Auth';
import { useState, useRef } from 'react';
import Cookies from 'universal-cookie'
import Chat from './components/Chat'
import { signOut } from 'firebase/auth'
import { auth } from "./firebase-config.js"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { Container, Button, Switch, Card, CardContent, Typography, CardMedia } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import NavBar from './components/Navbar.js';


const cookies = new Cookies()


function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"))
  const [room, setRoom] = useState(cookies.get("room"))
  const [toggleDarkMode, setToggleDarkMode] = useState(true);


  const darkTheme = createTheme({
    palette: {
      mode: toggleDarkMode ? 'dark' : 'light',
      
    },
  });

  function handleSignInResult(result) {
    // Do something with the result here
    console.log(result);
  }

  const toggleDarkTheme = () => {
    setToggleDarkMode(!toggleDarkMode);
  };

  const roomInputRef = useRef(null)

  const signUserOut = async () => {
    cookies.remove("auth-token")
    setIsAuth(false)
    await signOut(auth)
    setRoom("")
  }

  const handleRoom = () => {
    cookies.set("room", roomInputRef.current.value)
    setRoom(roomInputRef.current.value)
  } 

  // if (!isAuth) {

  //   return (
  //     <ThemeProvider theme={darkTheme}>
  //       <CssBaseline />
  //       <Container>
  //         <Auth setIsAuth={setIsAuth} theme={darkTheme} />
  //       </Container>
  //       <Switch checked={toggleDarkMode} onChange={toggleDarkTheme} />
  //     </ThemeProvider>
  //   )
  // }

  // return <ThemeProvider theme={darkTheme}>
  //   <CssBaseline />
   
  //   {room ? (
  //     <Chat room={room} />
  //   ) :
  //     (
  //       <div>
  //         <label>Enter Room Name</label>
  //         <input ref={roomInputRef} />
  //         <button onClick={() => setRoom(roomInputRef.current.value)} >Enter Chat</button>
  //       </div>
  //     )
  //   }
  //   <div className='sign-out'>
  //     <button onClick={signUserOut}>Sign Out</button>
  //   </div>
  // </ThemeProvider>


  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <NavBar signUserOut={signUserOut} isAuth={isAuth} toggleDarkMode={toggleDarkMode} toggleDarkTheme={toggleDarkTheme} setIsAuth={setIsAuth}/>
      <Container>
        {!isAuth?
          <Auth onSignInResult={handleSignInResult} setIsAuth={setIsAuth} toggleDarkMode={toggleDarkMode} />
          : room?
          <Chat room={room} setRoom={setRoom} /> :
          <div>
            <label>Enter Room Name</label>
            <input ref={roomInputRef} />
            <button onClick={handleRoom} >Enter Chat</button>
          </div>
        }
        
      </Container>
      
    </ThemeProvider>
  )
}

export default App;
