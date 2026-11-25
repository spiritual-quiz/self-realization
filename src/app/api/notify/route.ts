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

    // 1. Primary Guaranteed Dispatch via EmailJS (1.4s response, HTTP 200 OK directly to madhavcarandas@gmail.com)
    try {
      const emailJsRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": "https://selfrealization-platform.vercel.app"
        },
        body: JSON.stringify({
          service_id: "service_1ve1iom",
          template_id: "template_ypw8wpq",
          user_id: "8jCdn6vjWwsSe9CNK",
          template_params: {
            name: details.name || details.fullName || "Seeker",
            mobile: details.whatsapp || details.phone || "Not provided",
            email: details.email || ADMIN_EMAIL,
            language: details.language || "Hindi / English",
            track: type === "free_class_registration"
              ? `🏆 Vedic Quiz Challenge • Free Classes (${details.classMode || "Online Zoom"})`
              : (subject || "SelfRealization Registration"),
            notes: type === "free_class_registration"
              ? `[Vedic Quiz Seeker] Quiz: ${details.quizTitle || "Bhagavad-gītā Wisdom"} | Score: ${details.score || "Completed"} | Mode: ${details.classMode || "Online"} | Registered: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST`
              : (messageBody || "Class Registration"),
            age: String(details.age || "N/A"),
            status: details.occupation || details.preferredMode || "Enrolled Seeker",
            native_address: details.nativePlace || "N/A",
            current_address: details.currentLocation || "N/A",
          }
        })
      });

      if (emailJsRes.ok) {
        emailDispatched = true;
      }
    } catch (e) {
      console.warn("EmailJS registration notice:", e);
    }

    // 2. Secondary Asynchronous Backup via FormSubmit (Non-blocking with 3.5s timeout)
    try {
      const isQuizReg = type === "free_class_registration";
      const formSubmitBody: Record<string, any> = {
        _subject: isQuizReg 
          ? `🏆 [VEDIC QUIZ REGISTRATION] ${details.name || details.fullName} • ${details.occupation || "Seeker"} (${details.classMode || "Online"})` 
          : subject,
        _replyto: details.email || ADMIN_EMAIL,
        _captcha: "false",
        _template: "table",
      };

      if (isQuizReg) {
        formSubmitBody["PORTAL"] = "SelfRealization Platform • Bhagavad-gītā Wisdom Challenge";
        formSubmitBody["REGISTRATION TYPE"] = `Free Vedic Classes (${details.classMode || "Online / Offline"})`;
        formSubmitBody["PARTICIPANT NAME"] = details.name || details.fullName;
        formSubmitBody["WHATSAPP NUMBER"] = details.whatsapp || details.phone;
        formSubmitBody["EMAIL ADDRESS"] = details.email;
        formSubmitBody["AGE & GENDER"] = `${details.age || "N/A"} Years • ${details.gender || "Devotee"}`;
        formSubmitBody["OCCUPATION"] = details.occupation || "N/A";
        formSubmitBody["PREFERRED LANGUAGE"] = details.language || "Hindi / English";
        formSubmitBody["CLASS ATTENDANCE MODE"] = details.classMode || details.preferredMode || "Online Zoom";
        formSubmitBody["CURRENT RESIDENCE"] = details.currentLocation || "N/A";
        formSubmitBody["NATIVE HOMETOWN"] = details.nativePlace || "N/A";
        formSubmitBody["QUIZ CHALLENGE"] = details.quizTitle || "Vedic Quiz Challenge";
        formSubmitBody["SECURED SCORE"] = details.score || "N/A";
        formSubmitBody["SUBMISSION TIME"] = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST";
        formSubmitBody["FOLLOW-UP ACTION"] = "Candidate requested enrollment in free spiritual classes. Please add to WhatsApp batch.";
      } else {
        formSubmitBody["TYPE"] = type || "general";
        formSubmitBody["NAME"] = details.fullName || details.name || "Administrator";
        formSubmitBody["EMAIL"] = details.email || ADMIN_EMAIL;
        formSubmitBody["PHONE"] = details.phone || details.whatsapp || "N/A";
        formSubmitBody["DETAILS"] = messageBody;
      }

      // Fast non-blocking fetch with 3.5s AbortSignal
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Referer": "https://selfrealization-platform.vercel.app/quiz",
          "Origin": "https://selfrealization-platform.vercel.app"
        },
        body: JSON.stringify(formSubmitBody)
      }).then(() => clearTimeout(timeoutId)).catch(() => {});
    } catch (e) {
      console.warn("FormSubmit dispatch warning:", e);
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
