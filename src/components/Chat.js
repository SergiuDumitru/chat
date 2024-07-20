import { useEffect, useState, useRef } from 'react';
import {
    collection,
    addDoc,
    where,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
} from "firebase/firestore";
import { auth, db } from '../firebase-config.js'
import { Box, TextField, Button, List, ListItem, ListItemText, Typography, Paper, IconButton, ImageList, ImageListItem } from '@mui/material';
import { motion } from 'framer-motion';
import Message from './Message.js';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import ImageUploading from "react-images-uploading";

import { storage } from '../firebase-config.js';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";



function Chat({ room, toggleDarkMode, setRoom }) {
    const [newMessage, setNewMessage] = useState("")
    const [messages, setMessages] = useState([])
    const messagesRef = collection(db, "messages");
    const messagesEndRef = useRef(null);
    const [images, setImages] = useState([]);
    const maxNumber = 1;
    const [imgUrl, setImgUrl] = useState(null);
    const [progresspercent, setProgresspercent] = useState(0);


    const onChange = (imageList, addUpdateIndex) => {

        console.log(imageList, addUpdateIndex);
        setImages(imageList);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const queryMessages = query(
            messagesRef, where("room", "==", room), orderBy("createdAt"));


        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
            let messages = []
            snapshot.forEach((doc) => {
                messages.push({ ...doc.data(), id: doc.id })
            })

            setMessages(messages)
        })

        return () => unsubscribe()
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessage === "" && images.length === 0) return;

        if (images.length > 0) {
            const file = images[0].file;
            console.log(file);
            const storageRef = ref(storage, `files/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            setImages([]);

            uploadTask.on("state_changed",
                (snapshot) => {
                    const progress =
                        Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setProgresspercent(progress);
                },
                (error) => {
                    alert(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImgUrl(downloadURL);
                        console.log(imgUrl); // Log the imgUrl inside the then block
                    });
                }
            );
        }
        await addDoc(messagesRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser.displayName,
            room,
            imageUrl: imgUrl, // Add the imgUrl to the message data
        });
        setNewMessage("");
    };


    const handlePhotoClick = () => {

    }

    return (
        <Box sx={{ maxWidth: '600px', margin: '0 auto' }}>

            <Typography variant="h4" align="center" gutterBottom>
                Welcome to room {room}
            </Typography>
            <Button onClick={() => setRoom("")}>Change room</Button>

            <Paper className="chat-messages-container" style={{ maxHeight: 400, overflowX: 'hidden', whiteSpace: 'break-spaces' }}>
                <List>
                    {messages.length > 0 ? messages.map((message) => (
                        <ListItem key={message.id} divider>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }}
                            >
                                <Message message={message} />
                            </motion.div>
                        </ListItem>
                    )) : <ListItem><ListItemText primary="No messages yet. Be the first!" /></ListItem>}
                    <div ref={messagesEndRef} />
                </List>
            </Paper>

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate

            >
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    margin="normal"
                />
                <IconButton
                    sx={[
                        {
                            '&:hover': {
                                color: 'none',
                                backgroundColor: 'transparent',
                            },
                        }
                    ]}
                    type="button"
                    color="primary"
                    onClick={handlePhotoClick}
                >
                    <ImageUploading
                        multiple
                        value={images}
                        onChange={onChange}
                        maxNumber={maxNumber}
                        dataURLKey="data_url"
                        acceptType={["jpg"]}
                    >
                        {({
                            imageList,
                            onImageUpload,
                            onImageRemoveAll,
                            onImageUpdate,
                            onImageRemove,
                            isDragging,
                            dragProps
                        }) => (
                            // write your building UI
                            <div className="upload__image-wrapper">
                                <Button
                                    variant="contained"
                                    style={isDragging ? { color: "red" } : null}
                                    onClick={onImageUpload}
                                    {...dragProps}
                                >
                                    Click or Drop here
                                </Button>
                                &nbsp;
                                {images.length > 0 && <Button onClick={() => onImageRemove(0)}>Remove</Button>}

                            </div>
                        )}
                    </ImageUploading>

                </IconButton>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    Send
                </Button>
                <Box>
                    {images.length > 0 && <img width={"50%"} height={"50%"} alt="uploaded" src={images[0].data_url} />}
                </Box>
{/* {JSON.stringify(images[0])} */}
{progresspercent}

            </Box>
        </Box>
    );
}

export default Chat;