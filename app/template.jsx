import { ViewTransition } from "react";

// Template remounts on every navigation, so enter/exit fire per page.
export default function Template({ children }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
