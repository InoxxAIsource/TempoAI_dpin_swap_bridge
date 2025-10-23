import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Props {
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class WormholeErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Wormhole Widget Error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-2xl mx-auto p-6">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Swap Widget Error</AlertTitle>
            <AlertDescription>
              The Wormhole swap widget encountered an error. This might be due to network issues or a temporary problem with the widget.
            </AlertDescription>
          </Alert>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-lg">What happened?</h3>
            <p className="text-sm text-muted-foreground">
              {this.state.error?.message || 'An unexpected error occurred while loading the swap interface.'}
            </p>

            <div className="space-y-2">
              <p className="text-sm font-medium">Try these solutions:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Refresh the page to reload the widget</li>
                <li>Check your wallet connection</li>
                <li>Ensure your network connection is stable</li>
                <li>Try switching between Testnet and Mainnet</li>
              </ul>
            </div>

            <Button onClick={this.handleReset} className="w-full" size="lg">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload Widget
            </Button>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4">
                <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                  View Error Details (Dev Only)
                </summary>
                <pre className="mt-2 text-xs bg-muted p-4 rounded overflow-auto max-h-40">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
