"use server";

export async function submitContactForm(prevState, formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");
  const captchaToken = formData.get("h-captcha-response");
  const botcheck = formData.get("botcheck");

  // Honeypot check
  if (botcheck) {
    return { success: false, message: "Spam detected" };
  }

  if (!captchaToken) {
    return {
      success: false,
      message: "Please complete the captcha verification.",
    };
  }

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: "2547556b-b432-436a-abbb-5df814268c6c",
        name,
        email,
        message,
        "h-captcha-response": captchaToken,
      }),
    });

    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error("Web3Forms API returned non-JSON response:", text);
      return {
        success: false,
        message: "External service error. Please try again later.",
      };
    }

    if (result.success) {
      return { success: true, message: "Transmission Successful" };
    } else {
      return {
        success: false,
        message: result.message || "Transmission Failed",
      };
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    return {
      success: false,
      message: "Connection interrupted. Please try again.",
    };
  }
}
