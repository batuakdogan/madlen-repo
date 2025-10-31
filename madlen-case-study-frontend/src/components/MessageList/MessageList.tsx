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
          <div className={styles.emptyStateIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className={styles.emptyStateTitle}>Start a Conversation</h2>
          <p className={styles.emptyStateDescription}>
            Choose a model above and send your first message to begin chatting with AI
          </p>
          <div className={styles.suggestionCards}>
            <div className={styles.suggestionCard}>
              <div className={styles.cardIcon}>💡</div>
              <div className={styles.cardText}>Ask questions</div>
            </div>
            <div className={styles.suggestionCard}>
              <div className={styles.cardIcon}>✨</div>
              <div className={styles.cardText}>Get creative ideas</div>
            </div>
            <div className={styles.suggestionCard}>
              <div className={styles.cardIcon}>🔍</div>
              <div className={styles.cardText}>Explore topics</div>
            </div>
          </div>
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

