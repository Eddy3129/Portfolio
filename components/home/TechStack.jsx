"use client";

import { Component, useEffect, useState } from "react";
import dynamic from "next/dynamic";

const PLACEHOLDER = <div className="h-[600px] w-full" />;

const TechStackInner = dynamic(() => import("./TechStackInner"), {
  ssr: false,
  loading: () => PLACEHOLDER,
});

// No WebGL (old GPU, locked-down browser) must not blank the whole page.
class WebGLBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? PLACEHOLDER : this.props.children;
  }
}

export default function TechStack() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Desktop only (parent is `hidden lg:block`), and wait until the page-enter
    // animation is done so WebGL shader compile doesn't jank the transition.
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 400));
    const cancel = window.cancelIdleCallback ?? clearTimeout;
    const id = idle(() => setReady(true), { timeout: 600 });
    return () => cancel(id);
  }, []);

  if (!ready) return PLACEHOLDER;
  return (
    <WebGLBoundary>
      <TechStackInner />
    </WebGLBoundary>
  );
}
