// src/components/ErrorBoundary.jsx

import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log("Error capturado: ", error);  // Log de error
    console.log("Información del error: ", errorInfo);  // Log de detalles del error
  }

  render() {
    if (this.state.hasError) {
      return <h1>Algo salió mal. Intenta de nuevo más tarde.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
