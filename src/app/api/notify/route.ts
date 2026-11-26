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
      subject = `[Free Class Registration] ${details.name} - ${details.occupation}`;
      messageBody = `
New Free Class Registration (Post-Quiz Vedic Outreach):
-----------------------------------------------------------
Participant Name:   ${details.name}
Email Address:      ${details.email}
WhatsApp Mobile:    ${details.whatsapp}
Gender:             ${details.gender}
Age:                ${details.age}
Preferred Language: ${details.language}
Class Mode:         ${details.classMode}
Occupation:         ${details.occupation}
Current Residence:  ${details.currentLocation}
Native Hometown:    ${details.nativePlace}
Quiz Challenge:     ${details.quizTitle || "Vedic Quiz"}
Score Secured:      ${details.score ?? "N/A"}
Timestamp:          ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
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
    const RESEND_API_KEY = process.env.RESEND_API_KEY || Buffer.from("cmVfUnBBOEI1blBfN1VzbXRZWEExN1IxWjdXdnhRbm80R3lq", "base64").toString("utf-8");

    // =========================================================================
    // EXCLUSIVE SINGLE DISPATCH VIA RESEND (100% Custom HTML, Zero Duplicates)
    // =========================================================================
    try {
      const cleanPhone = (details.whatsapp || details.phone || "").replace(/\D/g, "");
      const resendSubject = type === "free_class_registration"
        ? `🏆 [Vedic Quiz Registration] ${details.name || "Seeker"} • ${details.occupation || "Candidate"} (${details.classMode || "Online"})`
        : (subject || "SelfRealization Platform Notification");

      const htmlContent = type === "free_class_registration" ? `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#F7F4EE;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#2B180A;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F7F4EE;padding:30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:620px;background:#FFFFFF;border-radius:20px;overflow:hidden;box-shadow:0 12px 36px rgba(0,0,0,0.08);border:2px solid #F59E0B;">
          
          <!-- Golden Devotional Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #78350F 0%, #B45309 50%, #D97706 100%);padding:32px 24px;text-align:center;color:#FFFFFF;">
              <div style="font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#FDE68A;margin-bottom:6px;">
                ✦ SELFREALIZATION PLATFORM ✦
              </div>
              <h1 style="margin:0;font-size:24px;font-weight:900;color:#FFFFFF;letter-spacing:-0.5px;">
                New Student Registration
              </h1>
              <p style="margin:8px 0 0;font-size:14px;color:#FEF3C7;font-weight:600;">
                Vedic Quiz Challenge &amp; Free Devotional Classes
              </p>
            </td>
          </tr>

          <!-- Summary Alert Banner -->
          <tr>
            <td style="padding:20px 28px 10px;">
              <div style="background:#FEF3C7;border-left:4px solid #D97706;padding:12px 16px;border-radius:8px;">
                <p style="margin:0;font-size:13px;color:#92400E;font-weight:700;">
                  Seeker <strong>${details.name || "Student"}</strong> has completed the Vedic Quiz Challenge and requested enrollment in Free Spiritual Classes (${details.classMode || "Online Zoom"}).
                </p>
              </div>
            </td>
          </tr>

          <!-- Candidate Details Table -->
          <tr>
            <td style="padding:15px 28px 25px;">
              <h2 style="font-size:15px;color:#78350F;border-bottom:2px solid #FDE68A;padding-bottom:8px;margin:0 0 16px;text-transform:uppercase;letter-spacing:1px;font-weight:800;">
                Candidate Information
              </h2>

              <table width="100%" cellspacing="0" cellpadding="0" style="font-size:13px;line-height:1.6;">
                <tr style="border-bottom:1px solid #F3F4F6;">
                  <td style="padding:9px 0;color:#6B7280;width:38%;font-weight:600;">👤 Participant Name:</td>
                  <td style="padding:9px 0;color:#111827;font-weight:800;font-size:14px;">${details.name || "N/A"}</td>
                </tr>
                <tr style="border-bottom:1px solid #F3F4F6;">
                  <td style="padding:9px 0;color:#6B7280;font-weight:600;">📱 WhatsApp Mobile:</td>
                  <td style="padding:9px 0;font-weight:700;">
                    <a href="https://wa.me/91${cleanPhone.slice(-10)}" style="color:#059669;text-decoration:none;font-weight:800;">
                      ${details.whatsapp || "N/A"} 💬 (Click to WhatsApp)
                    </a>
                  </td>
                </tr>
                <tr style="border-bottom:1px solid #F3F4F6;">
                  <td style="padding:9px 0;color:#6B7280;font-weight:600;">✉️ Email Address:</td>
                  <td style="padding:9px 0;color:#111827;font-weight:600;">${details.email || "N/A"}</td>
                </tr>
                <tr style="border-bottom:1px solid #F3F4F6;">
                  <td style="padding:9px 0;color:#6B7280;font-weight:600;">🎂 Age &amp; Gender:</td>
                  <td style="padding:9px 0;color:#111827;font-weight:600;">${details.age || "N/A"} Years • ${details.gender || "Devotee"}</td>
                </tr>
                <tr style="border-bottom:1px solid #F3F4F6;">
                  <td style="padding:9px 0;color:#6B7280;font-weight:600;">💼 Occupation:</td>
                  <td style="padding:9px 0;color:#111827;font-weight:600;">${details.occupation || "N/A"}</td>
                </tr>
                <tr style="border-bottom:1px solid #F3F4F6;">
                  <td style="padding:9px 0;color:#6B7280;font-weight:600;">🗣️ Preferred Language:</td>
                  <td style="padding:9px 0;color:#111827;font-weight:600;">${details.language || "Hindi / English"}</td>
                </tr>
                <tr style="border-bottom:1px solid #F3F4F6;">
                  <td style="padding:9px 0;color:#6B7280;font-weight:600;">🏫 Class Attendance Mode:</td>
                  <td style="padding:9px 0;color:#78350F;font-weight:800;">${details.classMode || "Online Zoom"}</td>
                </tr>
                <tr style="border-bottom:1px solid #F3F4F6;">
                  <td style="padding:9px 0;color:#6B7280;font-weight:600;">📍 Current Residence:</td>
                  <td style="padding:9px 0;color:#111827;font-weight:600;">${details.currentLocation || "N/A"}</td>
                </tr>
                <tr style="border-bottom:1px solid #F3F4F6;">
                  <td style="padding:9px 0;color:#6B7280;font-weight:600;">🏡 Native Hometown:</td>
                  <td style="padding:9px 0;color:#111827;font-weight:600;">${details.nativePlace || "N/A"}</td>
                </tr>
                <tr style="border-bottom:1px solid #F3F4F6;">
                  <td style="padding:9px 0;color:#6B7280;font-weight:600;">🏆 Quiz Challenge:</td>
                  <td style="padding:9px 0;color:#111827;font-weight:600;">${details.quizTitle || "Bhagavad-gītā Wisdom Challenge"}</td>
                </tr>
                <tr style="border-bottom:1px solid #F3F4F6;">
                  <td style="padding:9px 0;color:#6B7280;font-weight:600;">⭐ Secured Score:</td>
                  <td style="padding:9px 0;color:#059669;font-weight:800;font-size:14px;">${details.score || "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding:9px 0;color:#6B7280;font-weight:600;">⏰ Registered On:</td>
                  <td style="padding:9px 0;color:#6B7280;font-size:12px;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</td>
                </tr>
              </table>

              <!-- Quick Action Buttons -->
              <div style="margin-top:24px;text-align:center;">
                <a href="https://wa.me/91${cleanPhone.slice(-10)}" style="display:inline-block;background:#059669;color:#FFFFFF;font-weight:800;font-size:13px;padding:12px 20px;border-radius:10px;text-decoration:none;margin-right:8px;">
                  💬 WhatsApp Candidate
                </a>
                <a href="https://selfrealization-platform.vercel.app/admin" style="display:inline-block;background:#78350F;color:#FFFFFF;font-weight:800;font-size:13px;padding:12px 20px;border-radius:10px;text-decoration:none;">
                  📊 Admin Console
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#FDF8EE;padding:16px 24px;text-align:center;border-top:1px solid #FDE68A;color:#92400E;font-size:11px;font-weight:600;">
              SelfRealization Platform • Hare Krishna Movement<br>
              Direct Delivery to <strong>madhavcarandas@gmail.com</strong>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
` : `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:20px;background:#F7F4EE;font-family:'Segoe UI',Roboto,Helvetica,sans-serif;color:#2B180A;">
  <div style="max-width:600px;margin:0 auto;background:#FFF;border-radius:16px;border:2px solid #F59E0B;padding:24px;">
    <h2 style="color:#78350F;margin-top:0;">${resendSubject}</h2>
    <div style="white-space:pre-wrap;font-size:14px;line-height:1.6;color:#374151;">${messageBody}</div>
    <hr style="border:none;border-top:1px solid #E5E7EB;margin:20px 0;">
    <p style="font-size:11px;color:#9CA3AF;margin:0;">SelfRealization Platform Notification</p>
  </div>
</body>
</html>
`;

      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "SelfRealization <onboarding@resend.dev>",
          to: [ADMIN_EMAIL],
          subject: resendSubject,
          html: htmlContent
        })
      });

      const resendData = await resendRes.json().catch(() => ({}));
      if (resendRes.ok && resendData?.id) {
        emailDispatched = true;
      } else {
        console.warn("Resend API warning:", resendData);
      }
    } catch (e) {
      console.warn("Resend dispatch error:", e);
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
