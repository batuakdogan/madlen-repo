import { forwardRef } from 'react';
import type { Message } from '../../types';
import MessageBubble from '../MessageBubble/MessageBubble';
import styles from './MessageList.module.css';

interface MessageListProps {
  messages: Message[];
}

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(({ messages }, ref) => {
  return (
    <div className={styles.container}>
      {messages.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No messages yet. Start a conversation!</p>
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}
          <div ref={ref} />
        </>
      )}
    </div>
  );
});

MessageList.displayName = 'MessageList';

export default MessageList;

