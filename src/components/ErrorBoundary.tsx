import React, { ErrorInfo, ReactNode } from 'react';
import { RefreshCw, ShieldAlert, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Tesla Management ErrorBoundary] Caught application error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    try {
      // Clear any corrupted local cache keys if needed
      sessionStorage.removeItem('tm_vehicles_cache_v4');
    } catch {}
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    try {
      window.location.href = window.location.origin + (import.meta.env.BASE_URL || '/');
    } catch {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen w-full bg-white text-neutral-900 flex items-center justify-center p-4 sm:p-6 font-sans">
          <div className="max-w-lg w-full bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xl text-center space-y-6 animate-in fade-in duration-200">
            {/* Tesla Brand Accent */}
            <div className="w-12 h-12 mx-auto rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-red-600 font-bold">
                System Recovery
              </span>
              <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                Tesla Management Desk
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                The application encountered an unexpected display issue while rendering. You can reload the page to restore the full vehicle catalog and services.
              </p>
            </div>

            {/* Error Message (sanitized) */}
            {this.state.error?.message && (
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-left">
                <span className="text-[10px] font-mono uppercase text-neutral-500 font-semibold block mb-1">
                  Diagnostic Information
                </span>
                <p className="text-xs font-mono text-neutral-700 break-words line-clamp-3">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                id="error-reload-btn"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2 shadow-xs active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Website</span>
              </button>

              <button
                type="button"
                id="error-home-btn"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2 shadow-2xs active:scale-95"
              >
                <Home className="w-4 h-4" />
                <span>Homepage</span>
              </button>
            </div>

            <p className="text-[10px] text-neutral-400 font-mono">
              Official Tesla Management Portal & Client Support
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
