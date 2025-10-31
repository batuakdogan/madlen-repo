import { useState, useRef, useEffect } from 'react';
import type { Model } from '../../types';
import styles from './ModelSelector.module.css';

interface ModelSelectorProps {
  models: Model[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

const ModelSelector = ({ models, selectedModel, onModelChange }: ModelSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedModelData = models.find(model => model.id === selectedModel);
  const displayText = selectedModelData?.name || 'Choose a model';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (modelId: string) => {
    onModelChange(modelId);
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <label className={styles.label}>
        <svg 
          className={styles.icon}
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
        AI Model
      </label>
      <div className={styles.selectWrapper}>
        <button
          type="button"
          className={`${styles.select} ${isOpen ? styles.selectOpen : ''}`}
          onClick={handleToggle}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={styles.selectText}>{displayText}</span>
          <svg 
            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        
        {isOpen && (
          <ul className={styles.dropdown} role="listbox">
            {Array.isArray(models) && models.length > 0 ? (
              models.map((model) => (
                <li
                  key={model.id}
                  className={`${styles.option} ${selectedModel === model.id ? styles.optionSelected : ''}`}
                  onClick={() => handleSelect(model.id)}
                  role="option"
                  aria-selected={selectedModel === model.id}
                >
                  <span className={styles.optionText}>{model.name}</span>
                  {selectedModel === model.id && (
                    <svg 
                      className={styles.checkIcon}
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </li>
              ))
            ) : (
              <li className={styles.optionEmpty}>No models available</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ModelSelector;

