import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logError } from '@/utils/errorHandler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logError(error, 'ErrorBoundary');
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div dir="rtl">
          <h1>אירעה שגיאה</h1>
          <p>אנא רענן את הדף או נסה שוב מאוחר יותר.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
