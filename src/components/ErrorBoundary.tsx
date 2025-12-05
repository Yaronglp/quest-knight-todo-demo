import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * Tip #19: Always use error boundaries
 * Catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console or error reporting service
    console.error('[ErrorBoundary] Caught an error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError === true) {
      // Render custom fallback UI or default
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-dark-900 p-4">
          <div className="max-w-md rounded-lg border-2 border-red-500 bg-dark-800 p-6 text-center">
            <div className="mb-4 text-5xl">⚠️</div>
            <h2 className="mb-2 font-fantasy text-2xl font-bold text-red-400">
              Something went wrong
            </h2>
            <p className="mb-4 text-dark-300">
              {this.state.error?.message ?? 'An unexpected error occurred'}
            </p>
            <button
              onClick={this.handleReset}
              className="rounded bg-primary-600 px-4 py-2 font-medium text-white transition-colors hover:bg-primary-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

