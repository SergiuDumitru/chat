import { ListItemText } from '@mui/material';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { auth } from '../firebase-config';


function Message({ message }) {
    const user = auth.currentUser



    const [hovered, setHovered] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)

const handleEmojiClick = async (e) => {
    console.log(e.unified, message.id);
    setShowEmojiPicker(false);

    const messageRef = doc(db, "messages", message.id);
    
    const newReaction = {
        emoji: e.imageUrl,
        user: user.displayName
    };

    try {
        const messageDoc = await getDoc(messageRef);
        const messageData = messageDoc.data();

        let reactions = messageData.reactions ? messageData.reactions : [];
        const existingReactionIndex = reactions.findIndex(
            (reaction) => reaction.user === user.displayName
        );

        if (existingReactionIndex !== -1) {
            reactions[existingReactionIndex].emoji = newReaction.emoji;
        } else {
            reactions.push(newReaction);
        }
        await updateDoc(messageRef, { reactions });

        console.log("Emoji reaction updated successfully");
    } catch (error) {
        console.error("Error updating emoji reaction: ", error);
    }
};

const removeReaction = async () => {
    const messageRef = doc(db, "messages", message.id);
    try {
        const messageDoc = await getDoc(messageRef);
        const messageData = messageDoc.data();
        const reactions = messageData.reactions ? messageData.reactions : [];
        const existingReactionIndex = reactions.findIndex(
            (reaction) => reaction.user === user.displayName
        );
        if (existingReactionIndex !== -1) {
            reactions.splice(existingReactionIndex, 1);
            await updateDoc(messageRef, { reactions });
        }
    } catch (error) {
        console.error("Error removing emoji reaction: ", error);
    }
};

    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '560px' }}>
            <ListItemText
                primary={message.user}
                secondary={<img src={message.imageUrl} alt="image" width="200px"/> }
                
            />{message.reactions ? 
                message.reactions.map((emoji) => (
                    <img onClick={removeReaction} title={emoji.user} key={message.id + message.user} src={emoji.emoji} alt="reaction" width="24px" style={{ marginBottom: '32px' }}/>
                ))
            : null}
            
            <AddReactionIcon
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                sx={{ mb: 4, color: hovered ? '#bfbfbf' : null }}
            />
            {showEmojiPicker ? <EmojiPicker style={{ position: 'absolute', right: '50px', bottom: '15px', zIndex: '1' }}
                onReactionClick={(e) => handleEmojiClick(e, message.id)}
                // emojiStyle='google'
                allowExpandReactions={false}
                reactionsDefaultOpen={true}
                lazyLoad = {true}
                searchDisabled={true}
                lazyLoadEmojis = {true}
            /> : null}
        </div>)
}
export default Message