# Email Templates

HTML templates for EmailJS. Paste into [EmailJS Dashboard](https://dashboard.emailjs.com/) → Email Templates.

## Site Colors

- **Primary:** `#152b44` (dark blue)
- **Secondary:** `#F2EDE9` (light cream)

## Calculator Lead Notification

**File:** `calculator-lead-notification.html`

1. Create new template in EmailJS
2. Copy the HTML content
3. Replace `[YOUR_LOGO_URL]` with your logo URL (or remove the img tag)
4. Set **Subject:** `ליד חדש ממחשבון אומדן - {{lead_name}}`
5. Set **To Email** to your admin address
6. Save and copy the Template ID to `VITE_EMAILJS_CALCULATOR_TEMPLATE_ID` in `.env`
