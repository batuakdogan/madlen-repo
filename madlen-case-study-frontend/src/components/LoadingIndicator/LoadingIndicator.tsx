import styles from './LoadingIndicator.module.css';

const LoadingIndicator = () => {
  return (
    <div className={styles.container}>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
    </div>
  );
};

export default LoadingIndicator;

