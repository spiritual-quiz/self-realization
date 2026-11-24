import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = "madhavcarandas@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { type, details } = data;

    let subject = "New Notification from SelfRealization Platform";
    let messageBody = "";

    if (type === "class_registration") {
      subject = `[New Class Registration] ${details.classTitle || "Live Class"} - ${details.fullName}`;
      messageBody = `
New Class Registration Received on SelfRealization Platform:
-----------------------------------------------------------
Participant Name: ${details.fullName}
Phone Number:     ${details.phone}
Email Address:    ${details.email || "Not provided"}
Class Title:      ${typeof details.classTitle === "object" ? (details.classTitle.en || details.classTitle.hi) : details.classTitle}
Attendance Mode:  ${details.preferredMode || "Online"}
Questions/Notes:  ${details.questions || "None"}
Timestamp:        ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
-----------------------------------------------------------
      `.trim();
    } else if (type === "inquiry") {
      subject = `[New Inquiry] ${details.subject || "Spiritual Inquiry"} - ${details.fullName}`;
      messageBody = `
New Contact Inquiry Received:
-----------------------------------------------------------
Name:          ${details.fullName}
Phone:         ${details.phone}
Email:         ${details.email || "Not provided"}
Subject:       ${details.subject}
Message:
${details.message}

Timestamp:     ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
-----------------------------------------------------------
      `.trim();
    } else if (type === "password_reset") {
      const resetUrl = details.resetUrl || `https://selfrealization-platform.vercel.app/admin/login?mode=reset&token=${details.token || Date.now()}&email=${encodeURIComponent(details.email)}`;
      subject = `[Admin Security] Password Reset Link for SelfRealization Portal`;
      messageBody = `
Hare Kṛṣṇa,

A password reset request was initiated for your SelfRealization Admin account (${details.email}).

👉 PASSWORD RESET LINK:
${resetUrl}

Please click the link above to set your new admin password. This link is valid for 2 hours.

If you did not make this request, you can safely ignore this email.
      `.trim();
    }

    const isReset = type === "password_reset";

    // 1. Primary Dispatch: Direct EmailJS integration (configured with recipient madhavcarandas@gmail.com)
    let emailDispatched = false;
    try {
      const resetUrl = details.resetUrl || `https://selfrealization-platform.vercel.app/admin/login?mode=reset&token=${details.token || Date.now()}&email=${encodeURIComponent(details.email)}`;
      const emailJsRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": "https://live-like-a-monk.vercel.app"
        },
        body: JSON.stringify({
          service_id: "service_1ve1iom",
          template_id: "template_ypw8wpq",
          user_id: "8jCdn6vjWwsSe9CNK",
          template_params: {
            name: isReset ? "ADMIN PASSWORD RESET" : (details.fullName || details.name || "SelfRealization Admin"),
            mobile: isReset ? "Password Reset Action" : (details.phone || "9130542150"),
            email: ADMIN_EMAIL,
            language: "English",
            track: isReset ? "🔒 URGENT: SelfRealization Admin Password Reset Link" : subject,
            notes: messageBody,
            age: "N/A",
            status: isReset ? "PASSWORD_RESET_LINK" : (type || "Notification"),
            native_address: isReset ? "Password Reset Link" : "SelfRealization Portal",
            current_address: resetUrl
          }
        })
      });

      if (emailJsRes.ok) {
        emailDispatched = true;
      }
    } catch (e) {
      console.warn("EmailJS notification error:", e);
    }

    // 2. Secondary Dispatch: FormSubmit backup
    try {
      await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Referer": "https://selfrealization-platform.vercel.app",
          "Origin": "https://selfrealization-platform.vercel.app"
        },
        body: JSON.stringify({
          _subject: subject,
          _replyto: details.email || ADMIN_EMAIL,
          _captcha: "false",
          type: type || "general",
          name: details.fullName || details.name || "Administrator",
          email: details.email || ADMIN_EMAIL,
          phone: details.phone || "N/A",
          details: messageBody
        })
      }).catch(() => {});
    } catch (e) {}

    return NextResponse.json({
      success: true,
      emailDispatched,
      recipient: ADMIN_EMAIL,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("Notify API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to dispatch notification" },
      { status: 500 }
    );
  }
}
