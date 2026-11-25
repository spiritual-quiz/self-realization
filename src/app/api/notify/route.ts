import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = "madhavcarandas@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { type, details } = data;

    // =========================================================================
    // 1. PASSWORD RESET (EXCLUSIVELY CLEAN FORMSUBMIT — NEVER USE LIVE-LIKE-A-MONK EMAILJS)
    // =========================================================================
    if (type === "password_reset") {
      const resetUrl = details.resetUrl || `https://selfrealization-platform.vercel.app/admin/login?mode=reset&token=${details.token || Date.now()}&email=${encodeURIComponent(details.email || ADMIN_EMAIL)}`;
      
      let fsSuccess = true;
      try {
        const fsRes = await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Referer": "https://selfrealization-platform.vercel.app/admin/login",
            "Origin": "https://selfrealization-platform.vercel.app"
          },
          body: JSON.stringify({
            _subject: "🔒 Password Reset Link - SelfRealization Admin Portal",
            _template: "box",
            _captcha: "false",
            "SECURITY NOTICE": "Official Password Reset Request for SelfRealization Portal",
            "ADMIN ACCOUNT": details.email || ADMIN_EMAIL,
            "PASSWORD RESET LINK": resetUrl,
            "INSTRUCTIONS": "Click the link above to set your new admin password. This link is valid for 2 hours.",
            "SECURITY": "If you did not request this password reset, please contact technical support."
          })
        });
        const fsData = await fsRes.json().catch(() => ({}));
        fsSuccess = fsData?.success !== "false";
      } catch (e) {
        console.warn("FormSubmit password reset notice:", e);
      }

      return NextResponse.json({
        success: true,
        emailDispatched: fsSuccess,
        resetUrl,
        recipient: ADMIN_EMAIL,
        timestamp: new Date().toISOString()
      });
    }

    // =========================================================================
    // 2. CLASS REGISTRATIONS & INQUIRIES
    // =========================================================================
    let subject = "New Notification from SelfRealization Platform";
    let messageBody = "";

    if (type === "free_class_registration") {
      subject = `🎓 [Free Class Registration] ${details.name} - ${details.occupation}`;
      messageBody = `
New Free Class Registration (Post-Quiz Vedic Outreach):
-----------------------------------------------------------
Name / नाम:               ${details.name}
Email / ईमेल:             ${details.email}
WhatsApp / व्हाट्सएप:       ${details.whatsapp}
Gender / लिंग:            ${details.gender}
Age / आयु:               ${details.age}
Language / भाषा:          ${details.language}
Class Mode / माध्यम:      ${details.classMode}
Occupation / व्यवसाय:     ${details.occupation}
Currently Staying / निवास: ${details.currentLocation}
Native Place / मूल स्थान:  ${details.nativePlace}
Quiz Challenge:           ${details.quizTitle || "Vedic Quiz"}
Score Secured:            ${details.score ?? "N/A"}
Timestamp:                ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
-----------------------------------------------------------
      `.trim();
    } else if (type === "class_registration") {
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
    }

    let emailDispatched = false;

    // 1. Send via EmailJS (Exclusively for Live Like a Monk & General Inquiries — NEVER for Vedic Quiz)
    const isQuizReg = type === "free_class_registration";

    if (isQuizReg) {
      // Vedic Quiz registration is dispatched strictly ONCE directly by the client to FormSubmit
      return NextResponse.json({
        success: true,
        message: "Quiz registration handled exclusively by direct FormSubmit client dispatch to prevent duplicate emails.",
        recipient: ADMIN_EMAIL,
        timestamp: new Date().toISOString()
      });
    }
      const emailJsServiceId = "service_1ve1iom";
      const emailJsTemplateId = "template_ypw8wpq";

      try {
        const emailJsRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Origin": "https://selfrealization-platform.vercel.app"
          },
          body: JSON.stringify({
            service_id: emailJsServiceId,
            template_id: emailJsTemplateId,
            user_id: "8jCdn6vjWwsSe9CNK",
            template_params: {
              name: details.name || details.fullName || "Participant",
              mobile: details.whatsapp || details.phone || "Not provided",
              email: details.email || ADMIN_EMAIL,
              language: details.language || "English",
              track: subject,
              notes: messageBody,
              age: details.age || "N/A",
              status: type || "Notification",
              native_address: details.nativePlace || "SelfRealization Portal",
              current_address: details.currentLocation || "https://selfrealization-platform.vercel.app",
            }
          })
        });

        if (emailJsRes.ok) {
          emailDispatched = true;
        }
      } catch (e) {
        console.warn("EmailJS registration notice:", e);
      }

    // 2. Primary / Exclusive Dispatch via FormSubmit (Ultra-Clean Executive Box Layout)
    try {
      const formSubmitBody: Record<string, any> = {
        _subject: isQuizReg 
          ? `🏆 [VEDIC QUIZ REGISTRATION] ${details.name} • ${details.occupation} (${details.classMode})` 
          : subject,
        _replyto: details.email || ADMIN_EMAIL,
        _captcha: "false",
        _template: "box",
      };

      if (type === "free_class_registration") {
        formSubmitBody["SPIRITUAL OUTREACH"] = "SelfRealization Portal • Bhagavad-gītā Wisdom Challenge";
        formSubmitBody["REGISTRATION TYPE"] = "Free Devotional Classes (Post-Quiz Outreach)";
        formSubmitBody["CANDIDATE NAME"] = details.name;
        formSubmitBody["WHATSAPP NUMBER"] = details.whatsapp;
        formSubmitBody["EMAIL ADDRESS"] = details.email;
        formSubmitBody["GENDER & AGE"] = `${details.gender} • ${details.age} Years`;
        formSubmitBody["PREFERRED LANGUAGE"] = details.language;
        formSubmitBody["CLASS ATTENDANCE MODE"] = details.classMode;
        formSubmitBody["OCCUPATION"] = details.occupation;
        formSubmitBody["CURRENT RESIDENCE"] = details.currentLocation;
        formSubmitBody["NATIVE HOMETOWN"] = details.nativePlace;
        formSubmitBody["QUIZ CHALLENGE"] = details.quizTitle || "Bhagavad-gītā Wisdom Challenge";
        formSubmitBody["SECURED SCORE"] = details.score || "N/A";
        formSubmitBody["SUBMISSION TIME"] = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST";
        formSubmitBody["STATUS"] = "Enrolled Seeker (Ready for Free Vedic Sessions)";
      } else {
        formSubmitBody["Type"] = type || "general";
        formSubmitBody["Name"] = details.fullName || details.name || "Administrator";
        formSubmitBody["Email"] = details.email || ADMIN_EMAIL;
        formSubmitBody["Phone"] = details.phone || details.whatsapp || "N/A";
        formSubmitBody["Details"] = messageBody;
      }

      await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Referer": "https://selfrealization-platform.vercel.app",
          "Origin": "https://selfrealization-platform.vercel.app"
        },
        body: JSON.stringify(formSubmitBody)
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
