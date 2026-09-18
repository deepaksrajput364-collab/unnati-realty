/* REALYNK BROKER INVITE — V1 */
(function () {
  "use strict";

  if (window.__REALYNK_BROKER_INVITE_V1__) return;
  window.__REALYNK_BROKER_INVITE_V1__ = true;

  const ADMIN = "seagullairexpress@gmail.com";
  const FIREBASE_VERSION = "12.1.0";

  async function firebase() {
    const appMod = await import(
      "https://www.gstatic.com/firebasejs/" +
        FIREBASE_VERSION +
        "/firebase-app.js"
    );

    const authMod = await import(
      "https://www.gstatic.com/firebasejs/" +
        FIREBASE_VERSION +
        "/firebase-auth.js"
    );

    const fs = await import(
      "https://www.gstatic.com/firebasejs/" +
        FIREBASE_VERSION +
        "/firebase-firestore.js"
    );

    const cfg = await import("./firebase-config.js");

    const app = appMod.getApps().length
      ? appMod.getApps()[0]
      : appMod.initializeApp(cfg.firebaseConfig);

    return {
      auth: authMod.getAuth(app),
      GoogleAuthProvider: authMod.GoogleAuthProvider,
      signInWithPopup: authMod.signInWithPopup,
      fs: fs,
      db: fs.getFirestore(app)
    };
  }

  function cleanPhone(value) {
    let p = String(value || "").replace(/\D/g, "");

    if (p.length === 12 && p.startsWith("91")) {
      p = p.substring(2);
    }

    if (p.length === 11 && p.startsWith("0")) {
      p = p.substring(1);
    }

    return p;
  }

  function invitationLink(id) {
    return (
      location.origin +
      location.pathname.replace(/[^/]*$/, "") +
      "broker-invite.html?id=" +
      encodeURIComponent(id)
    );
  }

  function whatsappLink(phone, name, id) {
    const message =
      "🤝 ReaLynk Broker Network Invitation\n\n" +
      "Namaste " +
      name +
      ",\n\n" +
      "ReaLynk real-estate brokers ko ek hi network mein connect karne ka simple platform hai.\n\n" +
      "🏠 Property listings share karein\n" +
      "🔗 Digital Broker Card share karein\n" +
      "🤝 Broker-to-broker opportunities connect karein\n" +
      "🎁 Pehli 5 property listings FREE hain.\n\n" +
      "👉 Join / Accept Invitation:\n" +
      invitationLink(id) +
      "\n\n" +
      "ReaLynk — Connect • Share • Grow\n\n" +
      "Dhanyavaad.";

    return (
      "https://web.whatsapp.com/send?phone=91" +
      phone +
      "&text=" +
      encodeURIComponent(message)
    );
  }

  async function openInviteForm() {
    if (document.getElementById("realynkInviteModal")) return;

    const modal = document.createElement("div");

    modal.id = "realynkInviteModal";

    modal.style =
      "position:fixed;inset:0;background:rgba(0,20,40,.65);" +
      "z-index:99999;display:flex;align-items:center;" +
      "justify-content:center;padding:16px;";

    modal.innerHTML = `
      <div style="
        width:min(560px,100%);
        max-height:92vh;
        overflow:auto;
        background:#fff;
        border-radius:20px;
        padding:22px;
        font-family:Arial,sans-serif;
        box-shadow:0 20px 60px rgba(0,0,0,.25);
      ">

        <div style="
          display:flex;
          justify-content:space-between;
          align-items:center;
        ">
          <h2 style="margin:0;color:#0b3768;">
            🤝 ReaLynk — Add / Invite Broker
          </h2>

          <button
            id="realynkInviteClose"
            type="button"
            style="
              border:0;
              background:none;
              font-size:26px;
              cursor:pointer;
            "
          >×</button>
        </div>

        <p style="color:#667788;">
          Broker details add karein aur invitation WhatsApp par open karein.
        </p>

        <div
          id="realynkInviteMessage"
          style="
            display:none;
            padding:11px;
            border-radius:10px;
            margin:10px 0;
          "
        ></div>

        <div style="display:grid;gap:10px;">

          <input
            id="realynkBrokerName"
            placeholder="Broker Name *"
            style="padding:13px;border:1px solid #ccd6e0;border-radius:10px;"
          >

          <input
            id="realynkBrokerPhone"
            placeholder="Mobile / WhatsApp *"
            inputmode="tel"
            style="padding:13px;border:1px solid #ccd6e0;border-radius:10px;"
          >

          <input
            id="realynkBrokerEmail"
            placeholder="Email (Optional)"
            style="padding:13px;border:1px solid #ccd6e0;border-radius:10px;"
          >

          <input
            id="realynkBrokerCompany"
            placeholder="Company / Agency"
            style="padding:13px;border:1px solid #ccd6e0;border-radius:10px;"
          >

          <input
            id="realynkBrokerCity"
            placeholder="City"
            style="padding:13px;border:1px solid #ccd6e0;border-radius:10px;"
          >

          <input
            id="realynkBrokerAreas"
            placeholder="Areas Served"
            style="padding:13px;border:1px solid #ccd6e0;border-radius:10px;"
          >

          <input
            id="realynkBrokerExperience"
            placeholder="Experience"
            style="padding:13px;border:1px solid #ccd6e0;border-radius:10px;"
          >

          <button
            id="realynkInviteSave"
            type="button"
            style="
              padding:14px;
              border:0;
              border-radius:11px;
              background:#0b3768;
              color:#fff;
              font-weight:800;
              font-size:16px;
              cursor:pointer;
            "
          >
            Save & Open WhatsApp
          </button>

        </div>

        <p style="font-size:12px;color:#788899;margin-bottom:0;">
          RERA number baad mein broker profile mein add kiya ja sakta hai.
        </p>

      </div>
    `;

    document.body.appendChild(modal);

    const $ = (id) => modal.querySelector("#" + id);

    const messageBox = $("realynkInviteMessage");

    $("realynkInviteClose").onclick = () => modal.remove();

    $("realynkInviteSave").onclick = async function () {
      const name = $("realynkBrokerName").value.trim();
      const phone = cleanPhone($("realynkBrokerPhone").value);
      const email = $("realynkBrokerEmail").value.trim();
      const company = $("realynkBrokerCompany").value.trim();
      const city = $("realynkBrokerCity").value.trim();
      const areas = $("realynkBrokerAreas").value.trim();
      const experience = $("realynkBrokerExperience").value.trim();

      if (!name || phone.length !== 10) {
        messageBox.textContent =
          "Broker name aur valid 10 digit mobile number zaroori hai.";
        messageBox.style.display = "block";
        messageBox.style.background = "#fff1f0";
        messageBox.style.color = "#b42318";
        return;
      }

      this.disabled = true;

      try {
        const fb = await firebase();

        if (!fb.auth.currentUser) {
          await fb.signInWithPopup(
            fb.auth,
            new fb.GoogleAuthProvider()
          );
        }

        const currentEmail =
          String(fb.auth.currentUser?.email || "").toLowerCase();

        if (currentEmail !== ADMIN) {
          throw new Error("ADMIN_LOGIN_REQUIRED");
        }

        const query = fb.fs.query(
          fb.fs.collection(fb.db, "brokerInvitations"),
          fb.fs.where("phone", "==", phone)
        );

        const snapshot = await fb.fs.getDocs(query);

        let id;

        if (!snapshot.empty) {
          id = snapshot.docs[0].id;

          messageBox.textContent =
            "Existing invitation mil gaya. Naya duplicate record nahi banega.";
        } else {
          id = "INV-" + Date.now();

          await fb.fs.setDoc(
            fb.fs.doc(fb.db, "brokerInvitations", id),
            {
              id: id,
              name: name,
              phone: phone,
              email: email,
              company: company,
              city: city,
              areas: areas,
              experience: experience,
              status: "Invited",
              invitedBy: ADMIN,
              createdAt: fb.fs.serverTimestamp()
            }
          );

          messageBox.textContent =
            "Invitation save ho gaya. WhatsApp open karein.";
        }

        messageBox.style.display = "block";
        messageBox.style.background = "#e9f8ef";
        messageBox.style.color = "#18864b";

        const whatsappButton = document.createElement("a");

        whatsappButton.href = whatsappLink(phone, name, id);
        whatsappButton.target = "_blank";
        whatsappButton.rel = "noopener";
        whatsappButton.textContent =
          "📲 Open WhatsApp Invitation";

        whatsappButton.style =
          "display:block;text-align:center;margin-top:10px;" +
          "padding:13px;border-radius:10px;background:#168c4b;" +
          "color:#fff;text-decoration:none;font-weight:800;";

        messageBox.appendChild(whatsappButton);

        whatsappButton.click();

      } catch (error) {

        console.error(error);

        messageBox.textContent =
          error.message === "ADMIN_LOGIN_REQUIRED"
            ? "Super Admin account se login karein: seagullairexpress@gmail.com"
            : "Firebase/Login error. Dobara try karein.";

        messageBox.style.display = "block";
        messageBox.style.background = "#fff1f0";
        messageBox.style.color = "#b42318";

      } finally {
        this.disabled = false;
      }
    };
  }

  function addInviteButton() {
    if (document.getElementById("realynkInviteButton")) return;

    const brokerSection = document.getElementById("brokers");

    if (!brokerSection) return;

    const page = brokerSection.querySelector(".page");

    if (!page) return;

    const button = document.createElement("button");

    button.id = "realynkInviteButton";
    button.type = "button";
    button.textContent = "🤝 Add / Invite Broker";

    button.style =
      "width:100%;margin:0 0 12px;padding:14px;" +
      "border:0;border-radius:11px;background:#0b3768;" +
      "color:#fff;font-weight:800;font-size:16px;cursor:pointer;";

    button.onclick = openInviteForm;

    const heading = page.querySelector("h2");

    if (heading && heading.nextSibling) {
      page.insertBefore(button, heading.nextSibling);
    } else {
      page.prepend(button);
    }
  }

  [100, 500, 1200, 2500].forEach(function (delay) {
    setTimeout(addInviteButton, delay);
  });

  document.addEventListener(
    "click",
    function (event) {
      if (
        event.target.closest &&
        event.target.closest(
          'button[onclick*="openScreen(\'brokers\')"]'
        )
      ) {
        setTimeout(addInviteButton, 100);
        setTimeout(addInviteButton, 500);
      }
    },
    true
  );

})();
