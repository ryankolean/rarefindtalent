import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl w-full text-center">
            <div className="mb-8">
              <AlertTriangle className="h-20 w-20 text-red-500 mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Something Went Wrong
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
                We're sorry, but something unexpected happened. Our team has been notified and we're working on it.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                <p className="font-mono text-sm text-red-800 mb-2">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <pre className="text-xs text-red-700 overflow-auto max-h-40">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={this.handleReload}
                className="bg-black text-white hover:bg-slate-800 h-12 px-8 w-full sm:w-auto"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload Page
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 h-12 px-8 w-full sm:w-auto"
              >
                <Link to="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Go Home
                </Link>
              </Button>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                Need help?{" "}
                <Link
                  to="/BookConsultation"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Contact our support team
                </Link>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
