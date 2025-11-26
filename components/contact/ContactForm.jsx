"use client";

import { useState } from "react";
import { PaperPlaneRightIcon, CircleNotchIcon, CheckCircleIcon, WarningCircleIcon } from "../PhosphorIcons";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [captchaToken, setCaptchaToken] = useState(null);

  const onHCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      alert("Please complete the captcha verification.");
      return;
    }

    setStatus("loading");

    const formData = new FormData(e.target);
    formData.append("h-captcha-response", captchaToken);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        console.log(result);
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
    }
  };

  if (status === "success") {
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
          onClick={() => setStatus("idle")}
          className="mt-4 text-xs text-neon-green hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <WarningCircleIcon className="text-red-500 w-8 h-8" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">Transmission Failed</h3>
          <p className="text-gray-500 text-xs mt-1">
            Connection interrupted. Please try again.
          </p>
        </div>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-xs text-red-500 hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="hidden"
        name="access_key"
        value="2547556b-b432-436a-abbb-5df814268c6c"
      />
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
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input-field"
          placeholder="Vitalik Buterin"
          disabled={status === "loading"}
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
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="input-field"
          placeholder="anon@email.com"
          disabled={status === "loading"}
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
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className="input-field resize-none"
          placeholder="Hi, Eddy! Let's build the future..."
          disabled={status === "loading"}
        ></textarea>
      </div>

      <div className="transform scale-[0.85] origin-left sm:scale-100">
        <HCaptcha
          sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
          reCaptchaCompat={true}
          onVerify={onHCaptchaChange}
          theme="dark"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary group"
      >
        {status === "loading" ? (
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
