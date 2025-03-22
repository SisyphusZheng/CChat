import { useChatStore } from '../store/useChatStore'
import { useEffect } from 'react';

const ChatContainer = () => {
    const { message, getMessages, isMessagesLoading, selectedUser } = useChatStore();
    useEffect(() => {
        getMessages(selectedUser._id);
    })
    if (isMessagesLoading) return <div>Loading...</div>
    return <div>ChatContainer</div>
}


export default ChatContainer;