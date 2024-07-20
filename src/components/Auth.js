import { auth, provider } from '../firebase-config.js'
import { signInWithPopup } from 'firebase/auth'
import Cookies from 'universal-cookie'
import { Box, Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { motion } from 'framer-motion';
import prevSkewDark from '../img/dark.png'
import prevSkewLight from '../img/light.png'


const cookies = new Cookies()
export const Auth = ({ setIsAuth, toggleDarkMode }) => {

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider)
            cookies.set("auth-token", result.user.refreshToken)
            setIsAuth(true)
        }
        catch (err) {
            console.log(err)
        }
    }
    return (
        <Box sx={{
            overflow: 'hidden',
            height: '90vh',   
        }}>


            <motion.div
                style={{marginLeft: '80px',}}
                initial={{ opacity: 0, scale: 1.25, filter: "blur(5px)", }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)", }}
                transition={{ duration: 0.35, }}
            >
                <Typography className='title' variant="h1" sx={{ mt: 8, ml: 8, }}>
                    Join the chat
                </Typography>


            </motion.div>
            <motion.div
                style={{marginLeft: '80px',}}
                initial={{ opacity: 0, scale: 1.25, filter: "blur(5px)", }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)", }}
                transition={{ duration: 0.35, delay: 0.35 }}
            >
                <Typography className='sub-title' variant="h2" sx={{ mt: 8, ml: 8,  }}>
                    Room based chat application. <br />
                    Made with &#129505; using <br />React, Firebase, MaterialUI and Framer Motion.
                </Typography>


            </motion.div>
            <motion.div
                style={{marginLeft: '80px',}}
                initial={{ opacity: 0, scale: 1.25, filter: "blur(5px)", }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)", }}
                transition={{ duration: 0.35, delay: 0.7 }}
            >
                <Button sx={{ mt: 8, ml: 8, }} size="large" startIcon={<GoogleIcon />} variant="contained" onClick={() => signInWithGoogle()}>Sign In with Google</Button>


            </motion.div>
            
                <motion.img 
                src={toggleDarkMode ? prevSkewDark : prevSkewLight} 
                alt="prevSkew" 
                width="60%" 
                style={{ position: 'absolute', bottom: 0, right: 0, zIndex: -1 }} 
                initial={{ opacity: 0, scale: 0.75, filter: "blur(5px)", }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)", }}
                transition={{ duration: 0.35, delay: 1.05 }}>
            </motion.img>


        </Box>
    )
}