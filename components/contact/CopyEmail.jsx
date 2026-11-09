"use client";

import { useState } from "react";

// Same look as the social links, but copies the address instead of opening a mail client.
export default function CopyEmail({ email, icon, className }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.location.href = `mailto:${email}`; // clipboard blocked (insecure context / permissions)
    }
  };

  return (
    <button type="button" onClick={copy} className={`${className} w-full text-left`} title={email}>
      <div className="text-gray-400 group-hover:text-inherit transition-colors">{icon}</div>
      <span className="font-mono text-sm text-gray-300 group-hover:text-white" aria-live="polite">
        {copied ? "Copied!" : "Email"}
      </span>
    </button>
  );
}
