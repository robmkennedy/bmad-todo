import { useToast } from '../../hooks/useToast';
import styles from './Toast.module.css';

/**
 * Toast container component
 * Renders all active toasts from the toast context
 */
export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className={styles.toastContainer} role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type]}`}
          role="alert"
          aria-live="polite"
        >
          <span className={styles.message}>{toast.message}</span>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

