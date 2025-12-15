# 🎓 Oxbridge International School - Telegram Concierge Bot

A comprehensive Telegram bot and mini app for Oxbridge International School's admissions office, helping prospective parents calculate tuition fees, get information, and connect with admissions managers through both chat interface and a modern web-based application.

## ✨ Features

### Version 1.0

- **💰 Price Calculator**
  - Support for both MU and Yashnobod campuses
  - IB, Russian School, and Kindergarten programs
  - Automatic discount calculations (sibling, year, annual payment)
  - Flexible payment periods (monthly, quarterly, annually)
  - Entry fee calculation with applicable discounts
  - Available in both bot chat and mini app

- **📱 Telegram Mini App**
  - Modern, responsive web interface accessible from Telegram
  - Multi-step admissions form with smart routing
  - Campus information with high-quality images
  - Program explorer (Kindergarten, Russian Stream, IB Stream)
  - Value proposition showcase
  - Personalization quiz for smart routing
  - FAQ hub with searchable, categorized content
  - Enhanced calculator with sibling discounts
  - **Lead capture form with Telegram forwarding (v1.0)** ⭐ NEW
  - Thank you page with next steps
  - Full integration with bot backend

- **📨 Lead Forwarding System (v1.0)** ⭐ NEW
  - Automatic forwarding of application forms to Telegram channel/chat
  - Formatted messages with complete applicant information
  - Display Telegram username and user details
  - One-click "Contact on Telegram" button for admins
  - Optional database storage for lead tracking
  - Graceful error handling (works even if Telegram fails)
  - See [TELEGRAM_FORWARDING_SETUP.md](./TELEGRAM_FORWARDING_SETUP.md) for setup guide

- **🌐 Multi-Language Support**
  - English 🇬🇧
  - Russian 🇷🇺
  - Uzbek 🇺🇿
  - Turkish 🇹🇷
  - Available in both bot and mini app

- **👤 Connect with Manager**
  - Collects user information and preferences
  - Sends detailed lead information to CRM channel
  - Direct link for managers to contact users
  - Supports both bot chat and mini app submissions

- **❓ FAQ Section**
  - What's included in tuition
  - School programs overview
  - Admission process
  - School schedule
  - Quick-view messages for better UX
  - Searchable FAQ hub in mini app

- **📞 Contact Information**
  - Campus addresses and phone numbers
  - Email and website
  - Social media links

- **⚙️ Admin Panel**
  - Broadcast messages to all users
  - View statistics (users, conversations, leads)
  - Intercept mode to monitor conversations
  - Manual conversation intervention

- **💾 Full Data Logging**
  - PostgreSQL database for all interactions
  - User management and tracking
  - Lead generation and status tracking
  - Conversation history
  - Mini app submission tracking

## 🏗️ Tech Stack

### Backend
- **Language**: TypeScript
- **Runtime**: Node.js 18+
- **Bot Framework**: Telegraf 4.x
- **Web Framework**: Express.js 5.x
- **Database**: PostgreSQL 13+ with TypeORM
- **Architecture**: Modular handler-based structure

### Frontend (Mini App)
- **Framework**: Alpine.js 3.x (for interactive components)
- **Styling**: Tailwind CSS 4.x (CDN)
- **SDK**: Telegram Web App SDK
- **Languages**: Vanilla JavaScript (ES6+)
- **Design**: Mobile-first, responsive design

### Build Tools
- **TypeScript Compiler**: tsc
- **CSS Build**: Tailwind CSS CLI
- **Development**: ts-node-dev (auto-reload)

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 13+
- A Telegram Bot Token (from [@BotFather](https://t.me/botfather))
- A Telegram Channel for CRM notifications (optional but recommended)

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd telegram-concierge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up PostgreSQL

Create a new database:

```bash
# Using psql
psql -U postgres
CREATE DATABASE telegram_concierge;
\q
```

### 4. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Telegram Bot Configuration
BOT_TOKEN=your_bot_token_from_botfather

# CRM Channel (create a channel and add your bot as admin)
CRM_CHANNEL_ID=-1001234567890

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=telegram_concierge
DB_USER=postgres
DB_PASSWORD=your_password

# Admin User IDs (your Telegram user ID)
ADMIN_USER_IDS=123456789,987654321

# Mini App Configuration
WEB_APP_URL=https://your-domain.com
WEB_APP_PORT=3000

# Environment
NODE_ENV=development
```

**Important Notes:**
- `WEB_APP_URL` must be HTTPS in production (required by Telegram)
- For local development, use a tunneling service like ngrok
- `WEB_APP_PORT` is the port where the Express server will run

#### How to get your Telegram User ID:

1. Message [@userinfobot](https://t.me/userinfobot)
2. It will reply with your user ID

#### How to get CRM Channel ID:

1. Create a new Telegram channel
2. Add your bot as an administrator
3. Forward a message from the channel to [@userinfobot](https://t.me/userinfobot)
4. It will show the channel ID (format: -1001234567890)

### 5. Set up Mini App (Optional but Recommended)

The mini app provides a modern web interface for admissions. To enable it:

1. **For Development (using ngrok):**
   ```bash
   # Install ngrok (if not already installed)
   # macOS: brew install ngrok
   # Or download from https://ngrok.com
   
   # Start ngrok tunnel
   ngrok http 3000
   
   # Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
   # Update .env: WEB_APP_URL=https://abc123.ngrok.io
   ```

2. **For Production:**
   - Deploy to a server with HTTPS (required by Telegram)
   - Update `WEB_APP_URL` with your production domain
   - Ensure SSL certificate is properly configured

3. **Register Mini App with BotFather:**
   - Open [@BotFather](https://t.me/botfather) in Telegram
   - Send `/mybots`
   - Select your bot
   - Choose "Bot Settings" → "Menu Button"
   - Choose "Configure menu button"
   - Send the Mini App URL: `https://your-domain.com`
   - Send a description: "Apply to Oxbridge"

### 6. Run the bot

**Development mode** (with auto-reload):

```bash
npm run dev
```

This will start:
- Telegram bot (connects to Telegram servers)
- Web server on port 3000 (serves mini app)
- Auto-reload on file changes

**Production mode**:

```bash
# Build TypeScript and CSS
npm run build

# Start the application
npm start
```

**Additional Commands:**

```bash
# Watch CSS changes during development
npm run watch:css

# Build CSS only
npm run build:css

# Lint code
npm run lint

# Format code
npm run format
```

## 📂 Project Structure

```
telegram-concierge/
├── src/
│   ├── bot/                    # Bot-related code
│   │   ├── handlers/           # Message and callback handlers
│   │   │   ├── startHandler.ts
│   │   │   ├── languageHandler.ts
│   │   │   ├── calculatorHandler.ts
│   │   │   ├── managerHandler.ts
│   │   │   ├── faqHandler.ts
│   │   │   ├── contactHandler.ts
│   │   │   └── adminHandler.ts
│   │   ├── keyboards.ts        # Inline keyboard layouts
│   │   └── index.ts            # Bot initialization
│   ├── database/               # Database layer
│   │   ├── entities/           # TypeORM entities
│   │   │   ├── User.ts
│   │   │   ├── Conversation.ts
│   │   │   ├── Lead.ts
│   │   │   ├── Session.ts
│   │   │   └── AdminState.ts
│   │   ├── repositories/       # Data access layer
│   │   │   ├── UserRepository.ts
│   │   │   ├── LeadRepository.ts
│   │   │   ├── ConversationRepository.ts
│   │   │   ├── SessionRepository.ts
│   │   │   └── AdminStateRepository.ts
│   │   └── index.ts            # Database connection
│   ├── data/                   # Static data
│   │   ├── prices.ts           # Price tables
│   │   └── translations.ts     # Multi-language texts (bot)
│   ├── services/               # Business logic
│   │   └── PriceCalculator.ts  # Tuition calculation engine
│   ├── server/                 # Web server (mini app)
│   │   └── index.ts            # Express server & API endpoints
│   ├── config/                 # Configuration
│   │   └── index.ts
│   ├── types/                  # TypeScript types
│   │   └── index.ts
│   └── index.ts                # Application entry point
├── public/                     # Mini app frontend
│   ├── index.html              # Main HTML (9-page SPA)
│   ├── images/                 # Campus images and assets
│   │   ├── hero.png
│   │   ├── campus-mu.jpg
│   │   ├── campus-yash.jpg
│   │   └── oxbridge-logo.PNG
│   └── js/
│       ├── app.js              # Mini app logic
│       ├── translations.js     # Translation loader
│       └── translations/       # Language files
│           ├── en.js
│           ├── ru.js
│           ├── uz.js
│           └── tr.js
├── dist/                       # Compiled JavaScript (generated)
├── .env.example                # Environment template
├── package.json
├── tsconfig.json
├── README.md                   # This file
├── MINIAPP_README.md           # Mini app setup guide
├── ADMIN_GUIDE.md              # Admin panel documentation
└── EDITING_TEXT_GUIDE.md       # How to edit mini app text
```

## 💡 Usage

### For Users

**Via Telegram Bot:**
1. Start the bot: `/start`
2. Select your preferred language
3. Choose from the main menu:
   - Calculate tuition
   - Connect with a manager
   - Browse FAQ
   - View contact information

**Via Mini App:**
1. Open the bot in Telegram
2. Tap the menu button (bottom of chat) or use the mini app link
3. Navigate through the 9-page flow:
   - Welcome & Language Selection
   - Value Proposition
   - Personalization Quiz
   - Program Explorer
   - FAQ Hub
   - Enhanced Calculator
   - Next Steps
   - Lead Capture Form
   - Thank You Page

### For Admins

1. Use `/admin` command to access admin panel
2. Available admin features:
   - **Broadcast**: Send messages to all users
   - **Statistics**: View bot usage stats
   - **Intercept Mode**: Monitor all user messages

See [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) for detailed admin documentation.

## 🔧 Price Configuration

To update prices, edit `src/data/prices.ts`:

```typescript
export const PRICES = {
  MU: {
    IB: {
      KG: { period: 'quarter', base: 28875000 },
      PYP1: { period: 'quarter', base: 43257500 },
      // ... more classes
    },
    // ... more programs
  },
  YASH: {
    // ... Yashnobod campus prices
  }
};
```

## 🌍 Adding/Updating Translations

### Bot Translations

Edit `src/data/translations.ts` to add new languages or update existing translations for the bot:

```typescript
export const translations = {
  en: { /* English translations */ },
  ru: { /* Russian translations */ },
  uz: { /* Uzbek translations */ },
  tr: { /* Turkish translations */ },
};
```

### Mini App Translations

Mini app translations are stored in `/public/js/translations.js` and individual language files in `/public/js/translations/`.

**Quick Edit:**
1. Open `/public/js/translations.js` for the main translation loader
2. Edit language files in `/public/js/translations/` (en.js, ru.js, uz.js, tr.js)
3. Changes appear immediately after refresh

See [EDITING_TEXT_GUIDE.md](./EDITING_TEXT_GUIDE.md) for detailed instructions on editing mini app text.

## 📊 Database Schema

The bot uses 5 main tables:

- **users**: Store user information and preferences
- **conversations**: Log all interactions (bot and mini app)
- **leads**: Track potential customers (from both bot and mini app)
- **sessions**: Temporary conversation state
- **admin_states**: Admin panel state management

TypeORM will automatically create these tables when you run the bot in development mode (`synchronize: true`).

## 🔌 API Endpoints

The web server provides the following API endpoints:

### `POST /api/submit-lead`
Submits a lead from the mini app.

**Request Body:**
```json
{
  "applicationData": {
    "campus": "MU",
    "preferredLanguage": "en",
    "startDate": "2025-09",
    "parent": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+998901234567"
    },
    "children": [
      {
        "name": "Jane Doe",
        "program": "IB",
        "grade": "PYP1"
      }
    ],
    "referralSource": "Social Media",
    "campusTourRequested": true,
    "additionalComments": "Interested in scholarship"
  },
  "telegramUser": {
    "id": 123456789,
    "username": "johndoe",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

**Response:**
```json
{
  "success": true,
  "leadId": 42
}
```

### `GET /api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## 🔒 Security Notes

- Never commit `.env` file to version control
- Keep your `BOT_TOKEN` secure
- Restrict admin access by configuring `ADMIN_USER_IDS`
- Use environment variables for all sensitive data

## 🐛 Troubleshooting

### Bot doesn't respond

- Check that `BOT_TOKEN` is correct
- Ensure the bot is running without errors
- Verify database connection
- Check console logs for error messages

### Mini App doesn't open

- Verify `WEB_APP_URL` is HTTPS (required by Telegram)
- Check that URL is registered with BotFather
- Ensure web server is running on the correct port
- For local development, ensure ngrok tunnel is active
- Check browser console for errors (F12)

### CRM notifications not working

- Verify `CRM_CHANNEL_ID` is correct (should start with -100)
- Ensure bot is added as admin to the channel
- Check bot logs for errors
- Verify lead submission endpoint is working

### Database connection errors

- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists
- Check TypeORM connection logs

### Images not loading in mini app

- Verify images exist in `public/images/`
- Check file names match exactly (case-sensitive)
- Ensure proper file permissions
- Check browser console for 404 errors

### Form submission fails

- Check `/api/submit-lead` endpoint logs
- Verify database connection
- Check `CRM_CHANNEL_ID` configuration
- Monitor server console for errors
- Verify request payload format

## 🚦 Development Workflow

```bash
# Install dependencies
npm install

# Run in development mode (auto-reload)
# Starts both bot and web server
npm run dev

# Build for production (TypeScript + CSS)
npm run build

# Run production build
npm start

# Watch CSS changes during development
npm run watch:css

# Build CSS only
npm run build:css

# Lint code
npm run lint

# Format code
npm run format
```

### Development Tips

1. **Hot Reload**: The bot auto-reloads on TypeScript changes. For CSS changes, use `npm run watch:css` in a separate terminal.

2. **Testing Mini App Locally**:
   - Use ngrok to expose local server: `ngrok http 3000`
   - Update `.env` with ngrok HTTPS URL
   - Update BotFather menu button URL
   - Test on mobile device for best experience

3. **Database Changes**: TypeORM will auto-sync schema in development. For production, use migrations.

4. **Debugging**: 
   - Bot logs appear in terminal
   - Mini app logs appear in browser console (F12)
   - Check server logs for API endpoint issues

## 📚 Additional Documentation

- **[MINIAPP_README.md](./MINIAPP_README.md)** - Complete guide for setting up and customizing the Telegram Mini App
- **[ADMIN_GUIDE.md](./ADMIN_GUIDE.md)** - Detailed documentation for admin features, broadcasting, and user management
- **[EDITING_TEXT_GUIDE.md](./EDITING_TEXT_GUIDE.md)** - Step-by-step guide for editing all text content in the mini app

## 📈 Future Enhancements

- Analytics dashboard with charts
- Document upload for admissions
- Payment integration
- Appointment scheduling
- Student portal integration
- Email notifications
- SMS notifications
- Multi-bot support for different schools
- Advanced analytics for mini app usage
- A/B testing for conversion optimization
- Integration with external CRM systems

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 📧 Support

For issues or questions:
- Create an issue on GitHub
- Contact the development team

---

**Made with ❤️ for Oxbridge International School**
