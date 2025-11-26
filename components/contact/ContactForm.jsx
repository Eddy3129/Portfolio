"use client";

import { useState } from "react";
import {
  PaperPlaneRightIcon,
  CircleNotchIcon,
  CheckCircleIcon,
} from "../PhosphorIcons";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const initialState = {
  success: false,
  message: "",
};

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState(initialState);
  const [captchaToken, setCaptchaToken] = useState(null);

  const onHCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      setState({
        success: false,
        message: "Please complete the captcha verification.",
      });
      return;
    }

    setIsSubmitting(true);
    setState({ success: false, message: "" });

    const formData = new FormData(e.target);
    const object = Object.fromEntries(formData);

    // Honeypot check
    if (object.botcheck) {
      setState({ success: false, message: "Spam detected" });
      setIsSubmitting(false);
      return;
    }

    const json = JSON.stringify({
      access_key: "2547556b-b432-436a-abbb-5df814268c6c",
      ...object,
      "h-captcha-response": captchaToken,
    });

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      });

      const result = await response.json();

      if (result.success) {
        setState({ success: true, message: "Transmission Successful" });
      } else {
        setState({
          success: false,
          message: result.message || "Transmission Failed",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setState({
        success: false,
        message: "Connection interrupted. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary group"
      >
        {isSubmitting ? (
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
