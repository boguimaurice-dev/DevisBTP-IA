import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-4 border border-red-100">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Une erreur est survenue</h1>
            <p className="text-sm text-gray-500">
              Désolé, une erreur inattendue s'est produite. Veuillez rafraîchir la page ou contacter le support si le problème persiste.
            </p>
            {this.state.error && (
              <pre className="text-[10px] bg-gray-50 p-3 rounded-lg text-left overflow-auto max-h-32 text-red-600">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[#1A1A1A] text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all"
            >
              Actualiser la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
