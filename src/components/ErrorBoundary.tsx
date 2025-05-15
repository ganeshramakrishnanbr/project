import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true, error: _, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="text-red-800 font-semibold mb-2">Something went wrong</h2>
          <div className="text-red-600 whitespace-pre-wrap font-mono text-sm">
            {this.state.error?.toString()}
          </div>
          <div className="mt-2 text-red-500 whitespace-pre-wrap font-mono text-xs">
            {this.state.errorInfo?.componentStack}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
