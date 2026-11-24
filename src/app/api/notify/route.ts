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
      subject = `[Admin Security] Password Retrieval for SelfRealization Portal`;
      messageBody = `
Hare Kṛṣṇa,

A password retrieval was requested for the SelfRealization Admin Portal.

Registered Admin Email: ${details.email}
Portal Login URL:       https://selfrealization-platform.vercel.app/admin/login
Temporary Admin Pass:   SelfRealization@2026

If you did not request this, please ensure your account credentials remain secure.
      `.trim();
    }

    // 1. Dispatch email via FormSubmit AJAX service (with valid Origin & Referer headers)
    let emailDispatched = false;
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
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
      });

      const jsonRes = await res.json().catch(() => null);
      if (res.ok || jsonRes?.success) {
        emailDispatched = true;
      }
    } catch (e) {
      console.warn("FormSubmit mail forwarder error (will still record notification):", e);
    }

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
