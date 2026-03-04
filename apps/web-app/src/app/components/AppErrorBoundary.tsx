import React from 'react';
import { Button, Card, EmptyState } from '@slotra/ui';
import type { ErrorInfo, ReactNode } from 'react';
import { trackWebEvent } from '@/features/analytics/trackWebEvent';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends React.Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    trackWebEvent('web_runtime_error', {
      message: error.message,
      componentStack: errorInfo.componentStack,
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="public-page public-page--centered">
        <Card>
          <EmptyState
            align="left"
            title="Something went wrong"
            description="The page hit an unexpected error. You can retry the current screen or go back to a stable route."
            actions={(
              <>
                <Button type="button" onClick={this.handleRetry}>
                  Retry screen
                </Button>
                <a className="button-link button-link--secondary" href="/">
                  Back to home
                </a>
              </>
            )}
          />
        </Card>
      </main>
    );
  }
}
