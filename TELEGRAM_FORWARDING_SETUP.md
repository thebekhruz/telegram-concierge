# Telegram Bot Forwarding Setup Guide (v1.0)

This guide explains how to set up the Telegram bot forwarding feature for the mini app. When users submit the application form, their information will be forwarded to a Telegram channel or chat where admins can review it.

## Overview

The v1.0 implementation forwards lead capture form submissions directly to a Telegram channel/chat without requiring AMO CRM integration. This provides a simpler setup while still allowing admins to:

- ✅ Receive all application form data
- ✅ See the Telegram username of the applicant
- ✅ View full client card (all form fields)
- ✅ Contact applicants directly via Telegram
- ✅ Store leads in database (optional)

## Prerequisites

1. **Telegram Bot Token**: You need a bot token from [@BotFather](https://t.me/BotFather)
2. **CRM Channel/Chat**: A Telegram channel or chat where notifications will be sent
3. **Bot Admin Permissions**: The bot must be added as an admin to the CRM channel/chat

## Step-by-Step Setup

### 1. Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Send `/newbot` command
3. Follow the prompts:
   - Choose a name for your bot (e.g., "Oxbridge Admissions")
   - Choose a username (e.g., "oxbridge_admissions_bot")
4. Copy the bot token provided (looks like: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. Create a CRM Channel or Chat

#### Option A: Private Channel (Recommended)
1. Create a new Telegram channel
2. Make it private
3. Add your bot as an admin with "Post Messages" permission
4. Get the channel ID:
   - Forward any message from the channel to [@userinfobot](https://t.me/userinfobot)
   - Copy the channel ID (e.g., `-1001234567890`)

#### Option B: Group Chat
1. Create a new Telegram group
2. Add your bot to the group
3. Make the bot an admin
4. Get the chat ID:
   - Add [@userinfobot](https://t.me/userinfobot) to the group
   - Copy the chat ID

### 3. Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your credentials:
   ```env
   # Telegram Bot Configuration
   BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz

   # CRM Channel (where to send application notifications)
   CRM_CHANNEL_ID=-1001234567890

   # Mini App Configuration
   WEB_APP_URL=https://your-domain.com
   WEB_APP_PORT=3000

   # Database Configuration (optional for v1.0)
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=telegram_concierge
   DB_USER=postgres
   DB_PASSWORD=your_password_here

   # Environment
   NODE_ENV=production
   ```

### 4. Build and Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   # Note: CSS build will fail if tailwindcss is not installed, but that's okay
   # The mini app uses Tailwind via CDN

   # Build TypeScript only:
   npx tsc
   ```

3. Run the server:
   ```bash
   npm start
   ```

   Or for development:
   ```bash
   npm run dev
   ```

### 5. Test the Integration

1. Open the mini app in Telegram
2. Fill out the application form
3. Submit the form
4. Check your CRM channel - you should see a formatted message with:
   - Lead type (Tour, Open House, or Interview)
   - Parent information (name, phone, email)
   - Telegram user info (username, ID, name)
   - Application details (children count, ages, program interest)
   - Preferences (language, interests from quiz)
   - Specific questions
   - Timestamp
   - "Contact on Telegram" button

## Message Format

When a user submits the application form, admins will receive a message like this:

```
🏫 School Tour Request
━━━━━━━━━━━━━━━━━━━

👤 PARENT INFORMATION
Name: John Smith
📱 Phone: +998901234567
📧 Email: john@example.com
🔗 Username: @johnsmith
🆔 Telegram ID: 123456789
👨‍💼 Telegram Name: John Smith

👨‍👩‍👧‍👦 APPLICATION DETAILS
Children Count: 2
Ages: 5-7, 8-10
Program Interest: IB Stream

📊 PREFERENCES
🌐 Language: EN
🎯 Interests: international, academics

💬 SPECIFIC QUESTIONS
What extracurricular activities are available?

⏰ Submitted: Dec 15, 2024, 3:45 PM

[📞 Contact on Telegram] (button)
```

## Features

### ✅ Implemented in v1.0

- ✅ Form submission forwarding to Telegram
- ✅ Formatted messages with all form data
- ✅ Display Telegram username and user info
- ✅ "Contact on Telegram" button with deep link
- ✅ Optional database storage
- ✅ Error handling (won't break if Telegram fails)
- ✅ Timestamp in Tashkent timezone

### 🔮 Future Enhancements (v2.0)

- AMO CRM integration
- Lead status tracking in Telegram
- Reply-to-lead functionality
- Admin dashboard
- Analytics and reporting

## Troubleshooting

### Bot not sending messages
1. Verify bot token is correct in `.env`
2. Check that bot is added as admin in the channel/chat
3. Check server logs for error messages

### Wrong chat ID
- Make sure the chat ID starts with `-` (negative number)
- Use [@userinfobot](https://t.me/userinfobot) to get the correct ID

### Database errors
- Database storage is optional in v1.0
- The system will continue working even if database fails
- Check console logs for database errors (won't affect Telegram forwarding)

### Build errors
- CSS build may fail if tailwindcss is not installed - this is okay
- The mini app uses Tailwind via CDN
- Just run `npx tsc` to build TypeScript

## Support

For issues or questions:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Test with [@userinfobot](https://t.me/userinfobot) to confirm bot permissions

## Architecture

```
User fills form → Frontend (app.js) → Backend (/api/submit-lead) → Telegram Bot API → CRM Channel
                                   └→ Database (optional)
```

The backend endpoint:
1. Receives form data from frontend
2. Validates required fields (parent name, phone)
3. Formats a nice message with all details
4. Sends to Telegram CRM channel via Bot API
5. Optionally stores in database
6. Returns success response

This architecture allows the system to work even if:
- Database is not configured
- Telegram sending fails (graceful degradation)
- Network issues occur
