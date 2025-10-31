import { useState, useEffect, useRef } from 'react';
import type { Message, Model } from '../../types';
import { fetchModels, postChatMessage } from '../../services/api';
import { getOperationErrorMessage } from '../../utils/errorHandler';
import Header from '../../components/Header/Header';
import ModelSelector from '../../components/ModelSelector/ModelSelector';
import MessageList from '../../components/MessageList/MessageList';
import MessageInput from '../../components/MessageInput/MessageInput';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import ErrorDisplay from '../../components/ErrorDisplay/ErrorDisplay';
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
        const errorMessage = getOperationErrorMessage('fetchModels', err);
        setError(errorMessage);
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
    if (!userMessage.trim()) {
      setError('Please enter a message.');
      return;
    }

    if (!selectedModel) {
      setError('Please select a model before sending a message.');
      return;
    }

    try {
      setError(null);
      
      // Set loading state
      setIsLoading(true);
      
      const newUserMessage: Message = {
        role: 'user',
        content: userMessage,
      };
      setMessages((prev) => [...prev, newUserMessage]);
      
      // Call the API
      const response = await postChatMessage(userMessage, sessionId, selectedModel);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Update session ID
      setSessionId(response.data.sessionId);
    } catch (err) {
      // Handle API errors with meaningful messages
      const errorMessage = getOperationErrorMessage('sendMessage', err);
      setError(errorMessage);
      console.error('Error sending message:', err);
      

    } finally {
      setIsLoading(false);
    }
  };

  const handleDismissError = () => {
    setError(null);
  };

  return (
    <div className={styles.container}>
      <Header />
      <ModelSelector
        models={models}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
      />
      {error && <ErrorDisplay message={error} onDismiss={handleDismissError} autoDismiss />}
      <MessageList messages={messages} ref={messagesEndRef} />
      {isLoading && <LoadingIndicator />}
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatView;

