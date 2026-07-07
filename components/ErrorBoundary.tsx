"use client";

import { Component, ReactNode } from "react";
import { MESSAGES } from "@/lib/messages";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : MESSAGES.errors.unexpected;
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown) {
    console.error("[ErrorBoundary]", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <p className="text-white font-semibold text-lg">{MESSAGES.errors.somethingWentWrong}</p>
          <p className="text-blue-300/60 text-sm max-w-sm">{this.state.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, message: "" })}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            {MESSAGES.common.retry}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
