# Error Handling Strategy

## Error Response Format

```typescript
interface AppError {
  code: string;
  message: string;
  severity: 'warning' | 'error' | 'critical';
  details?: Record<string, any>;
  timestamp: number;
  recoverable: boolean;
}

const ERROR_CODES = {
  VALIDATION_TITLE_REQUIRED: 'VALIDATION_TITLE_REQUIRED',
  STORAGE_QUOTA_EXCEEDED: 'STORAGE_QUOTA_EXCEEDED',
  STORAGE_UNAVAILABLE: 'STORAGE_UNAVAILABLE',
  STORAGE_PARSE_ERROR: 'STORAGE_PARSE_ERROR',
  STATE_INVALID_TASK_ID: 'STATE_INVALID_TASK_ID',
  ANIMATION_TIMEOUT: 'ANIMATION_TIMEOUT',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;
```

## User-Friendly Messages

```typescript
const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.VALIDATION_TITLE_REQUIRED]: 'Please enter a task title',
  [ERROR_CODES.STORAGE_QUOTA_EXCEEDED]: 'Storage is full. Some older tasks have been archived.',
  [ERROR_CODES.STORAGE_UNAVAILABLE]: 'Unable to save progress. Your browser may be in private mode.',
  [ERROR_CODES.STORAGE_PARSE_ERROR]: 'Failed to load saved data. Starting fresh.',
  [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please refresh the page.',
};
```

## Storage Error Handling

**LocalStorage Quota Exceeded:**

1. Detect `QuotaExceededError`
2. Archive completed tasks older than 30 days
3. Retry persist with cleaned state
4. If still fails, show critical error with export option

**Storage Parse Error:**

1. Catch `JSON.parse` error
2. Log error for debugging
3. Start with fresh state
4. Show warning toast to user

## Error Boundaries

```typescript
export class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <button onClick={() => window.location.reload()}>
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

