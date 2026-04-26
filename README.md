# 🔐 OPEN OTP

**OPEN OTP** is a lightweight, privacy-focused browser extension that generates Time-Based One-Time Passwords (TOTP) for two-factor authentication (2FA).

It is part of the **OPEN Security Ecosystem**, designed to work seamlessly with **OPEN Password** to deliver a fast, secure, and modern authentication experience.

---

## 🌐 OPEN Ecosystem

The OPEN ecosystem simplifies secure login:

### 🔑 OPEN Password

* Generate strong passwords
* Save credentials securely
* Autofill login forms

### 🔐 OPEN OTP (this project)

* Generate 6-digit verification codes
* Support multiple accounts
* Provide secure 2FA codes

👉 Together, they provide:

* Autofill + OTP in one flow
* Faster and more secure logins
* A complete authentication solution

---

## 🚀 Features

* 🔢 Generate 6-digit TOTP codes (refresh every 30 seconds)
* ⏱ Real-time countdown timer
* ➕ Add multiple accounts
* 📷 QR code support (otpauth:// format)
* 🔐 100% local encrypted storage
* 📋 One-click copy to clipboard
* ⚡ Fast and lightweight
* 🎨 Clean and minimal UI

---

## 🚀 Live Demo

Try the OPEN experience:

👉 https://premiumpasswordgenerator.web.app/

> ⚠️ Note: This demo showcases the UI/experience.
> For full TOTP functionality, use the browser extension.

---

## 💡 Why OPEN OTP?

* 🔐 100% Local-first (no cloud, no tracking, no data leaks)
* ⚡ Instant code generation
* 🧩 Works seamlessly with OPEN Password
* 🛡️ Privacy-focused design

---

## 🧠 How It Works

OPEN OTP uses the Time-Based One-Time Password (TOTP) algorithm (RFC 6238):

* A secret key is stored securely
* A 6-digit code is generated every 30 seconds
* Codes are time-based and expire automatically

---

## 🔗 Integration with OPEN Password

When used together:

1. OPEN Password autofills:

   * Email
   * Password

2. OPEN OTP provides:

   * Instant 2FA code

3. Login is completed in seconds ⚡

> 🎯 Goal: Seamless and secure login experience

---

## 🔐 Security

* All secrets are stored **locally on the user's device**
* Data is encrypted using the **Web Crypto API (AES)**
* No external servers or cloud sync
* TOTP codes generated using **otplib**

> ⚠️ Warning: If you lose your stored secrets, you cannot recover your accounts. Always backup your keys securely.

---

## 🛠️ Tech Stack

* JavaScript (Vanilla)
* HTML5 & CSS3
* Web Crypto API (local encryption)
* otplib (TOTP generation)
* Chrome Extension APIs

---

## 📦 Installation

### 🔧 Load Extension (Developer Mode)

1. Clone the repository:

   ```bash
   git clone https://github.com/Hussein35847/OPEN-TOTP.git
   ```

2. Open Chrome:

   ```
   chrome://extensions/
   ```

3. Enable **Developer Mode**

4. Click **Load unpacked**

5. Select the project folder

---

## 📱 Usage

1. Open the extension
2. Add account (QR code or secret key)
3. View generated OTP codes
4. Use during login

---

## 🔮 Future Improvements

* 🔗 Deeper integration with OPEN Password
* 🔑 Master password protection
* 📱 Mobile version
* 🌙 Dark mode
* 🔔 Smart OTP suggestions

---

## 🤝 Contributing

Contributions are welcome!

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Hussein Amer**

---

## ⭐ Support

If you like this project, give it a star ⭐
and support the OPEN ecosystem 🚀
