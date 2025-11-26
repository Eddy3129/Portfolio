"use client";

import { useState, useActionState } from "react";
import {
  PaperPlaneRightIcon,
  CircleNotchIcon,
  CheckCircleIcon,
  WarningCircleIcon,
} from "../PhosphorIcons";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { submitContactForm } from "@/app/actions";

const initialState = {
  success: false,
  message: "",
};

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialState
  );
  const [captchaToken, setCaptchaToken] = useState(null);

  const onHCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  if (state.success) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 rounded-full bg-neon-green/10 flex items-center justify-center border border-neon-green/50 shadow-[0_0_20px_rgba(0,255,157,0.2)]">
          <CheckCircleIcon className="text-neon-green w-8 h-8" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">
            Transmission Successful
          </h3>
          <p className="text-gray-500 text-xs mt-1">
            Transaction Hash: 0x{Math.random().toString(16).slice(2)}...
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-xs text-neon-green hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  if (state.success === false && state.message) {
    // We can show error here, or just below the form.
    // The original code replaced the form with error UI, but usually we want to keep the form and show error.
    // However, to match original behavior:
    if (
      state.message !== "Please complete the captcha verification." &&
      state.message !== "Spam detected"
    ) {
      // Only show full error screen for network/api errors if desired,
      // but better to show inline error for validation.
      // Let's stick to the original behavior for "error" status which seemed to be for API failures.
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.success === false && state.message && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-xs text-center">
          {state.message}
        </div>
      )}

      <input
        type="checkbox"
        name="botcheck"
        className="hidden"
        style={{ display: "none" }}
      />
      <input
        type="hidden"
        name="h-captcha-response"
        value={captchaToken || ""}
      />

      {/* Name Field */}
      <div className="group">
        <label className="block text-gray-500 text-xs mb-2 group-focus-within:text-neon-green transition-colors">
          &gt; ENTER_NAME
        </label>
        <input
          required
          name="name"
          type="text"
          className="input-field"
          placeholder="Vitalik Buterin"
          disabled={isPending}
        />
      </div>

      {/* Email Field */}
      <div className="group">
        <label className="block text-gray-500 text-xs mb-2 group-focus-within:text-neon-green transition-colors">
          &gt; ENTER_EMAIL_ADDRESS
        </label>
        <input
          required
          name="email"
          type="email"
          className="input-field"
          placeholder="anon@email.com"
          disabled={isPending}
        />
      </div>

      {/* Message Field */}
      <div className="group">
        <label className="block text-gray-500 text-xs mb-2 group-focus-within:text-neon-green transition-colors">
          &gt; ENTER_MESSAGE_PAYLOAD
        </label>
        <textarea
          required
          name="message"
          rows="5"
          className="input-field resize-none"
          placeholder="Hi, Eddy! Let's build the future..."
          disabled={isPending}
        ></textarea>
      </div>

      <div className="transform scale-[0.85] origin-left sm:scale-100">
        <HCaptcha
          sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
          reCaptchaCompat={false}
          onVerify={onHCaptchaChange}
          theme="dark"
        />
      </div>

      <button type="submit" disabled={isPending} className="btn-primary group">
        {isPending ? (
          <>
            <CircleNotchIcon className="animate-spin" size={16} />
            <span>BROADCASTING...</span>
          </>
        ) : (
          <>
            <PaperPlaneRightIcon
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
            <span>[ SUBMIT_MESSAGE ]</span>
          </>
        )}
      </button>
    </form>
  );
}
