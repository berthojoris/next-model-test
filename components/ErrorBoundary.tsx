import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to an error reporting service or console
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render any custom fallback UI
      return (
        <div className="flex items-center justify-center h-screen w-screen bg-gray-900 text-white">
          <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl animate-fade-in">
            <h1 className="text-3xl font-bold text-red-400 mb-4">Oops! Something went wrong.</h1>
            <p className="text-gray-300 mb-6">We've encountered an unexpected error. Please try refreshing the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-gradient font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
