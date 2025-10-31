import { useState, useEffect, useRef } from 'react';
import type { Message, Model } from '../../types';
import { fetchModels, postChatMessage } from '../../services/api';
import Header from '../../components/Header/Header';
import ModelSelector from '../../components/ModelSelector/ModelSelector';
import MessageList from '../../components/MessageList/MessageList';
import MessageInput from '../../components/MessageInput/MessageInput';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import styles from './ChatView.module.css';

const ChatView = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch models on component mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        const fetchedModels = await fetchModels();
        setModels(fetchedModels);
        if (fetchedModels.length > 0) {
          setSelectedModel(fetchedModels[0].id);
        }
      } catch (err) {
        setError('Failed to load models. Please refresh the page.');
        console.error('Error fetching models:', err);
      }
    };

    loadModels();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
  };

  const handleSendMessage = async (userMessage: string) => {
    try {
      // Clear any previous errors
      setError(null);
      
      // Set loading state
      setIsLoading(true);
      
      // Add user message to the list
      const newUserMessage: Message = {
        role: 'user',
        content: userMessage,
      };
      setMessages((prev) => [...prev, newUserMessage]);
      
      // Call the API
      const response = await postChatMessage(userMessage, sessionId, selectedModel);
      
      // Add assistant's reply to the list
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Update session ID
      setSessionId(response.data.sessionId);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <ModelSelector
        models={models}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
      />
      <MessageList messages={messages} ref={messagesEndRef} />
      {isLoading && <LoadingIndicator />}
      {error && <div className={styles.error}>{error}</div>}
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatView;

