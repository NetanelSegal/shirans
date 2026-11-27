import { Component, ReactNode } from 'react';
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

  componentDidCatch(error: Error): void {
    logError(error, 'ErrorBoundary');
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div dir="rtl">
          <h1>אירעה שגיאה</h1>
          <p>אפשר לרענן את הדף או לנסות שוב בעוד כמה דקות.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
