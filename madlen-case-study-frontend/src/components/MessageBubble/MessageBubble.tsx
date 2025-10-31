import type { Message } from '../../types';
import styles from './MessageBubble.module.css';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  return (
    <div className={`${styles.bubble} ${message.role === 'user' ? styles.user : styles.assistant}`}>
      <div className={styles.content}>{message.content}</div>
    </div>
  );
};

export default MessageBubble;

