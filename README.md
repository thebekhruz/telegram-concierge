# 🎓 Oxbridge International School - Telegram Concierge Bot

A comprehensive Telegram bot for Oxbridge International School's admissions office, helping prospective parents calculate tuition fees, get information, and connect with admissions managers.

## ✨ Features

### Version 1.0

- **💰 Price Calculator**
  - Support for both MU and Yashnobod campuses
  - IB, Russian School, and Kindergarten programs
  - Automatic discount calculations (sibling, year, annual payment)
  - Flexible payment periods (monthly, quarterly, annually)
  - Entry fee calculation with applicable discounts

- **🌐 Multi-Language Support**
  - English 🇬🇧
  - Russian 🇷🇺
  - Uzbek 🇺🇿
  - Turkish 🇹🇷

- **👤 Connect with Manager**
  - Collects user information and preferences
  - Sends detailed lead information to CRM channel
  - Direct link for managers to contact users

- **❓ FAQ Section**
  - What's included in tuition
  - School programs overview
  - Admission process
  - School schedule
  - Quick-view messages for better UX

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

## 🏗️ Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Bot Framework**: Telegraf
- **Database**: PostgreSQL with TypeORM
- **Architecture**: Modular handler-based structure

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
git checkout price-calculator
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

# Environment
NODE_ENV=development
```

#### How to get your Telegram User ID:

1. Message [@userinfobot](https://t.me/userinfobot)
2. It will reply with your user ID

#### How to get CRM Channel ID:

1. Create a new Telegram channel
2. Add your bot as an administrator
3. Forward a message from the channel to [@userinfobot](https://t.me/userinfobot)
4. It will show the channel ID (format: -1001234567890)

### 5. Run the bot

**Development mode** (with auto-reload):

```bash
npm run dev
```

**Production mode**:

```bash
npm run build
npm start
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
│   │   └── index.ts            # Database connection
│   ├── data/                   # Static data
│   │   ├── prices.ts           # Price tables
│   │   └── translations.ts     # Multi-language texts
│   ├── services/               # Business logic
│   │   └── PriceCalculator.ts  # Tuition calculation engine
│   ├── config/                 # Configuration
│   │   └── index.ts
│   ├── types/                  # TypeScript types
│   │   └── index.ts
│   └── index.ts                # Application entry point
├── .env.example                # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## 💡 Usage

### For Users

1. Start the bot: `/start`
2. Select your preferred language
3. Choose from the main menu:
   - Calculate tuition
   - Connect with a manager
   - Browse FAQ
   - View contact information

### For Admins

1. Use `/admin` command to access admin panel
2. Available admin features:
   - **Broadcast**: Send messages to all users
   - **Statistics**: View bot usage stats
   - **Intercept Mode**: Monitor all user messages

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

Edit `src/data/translations.ts` to add new languages or update existing translations:

```typescript
export const translations = {
  en: { /* English translations */ },
  ru: { /* Russian translations */ },
  uz: { /* Uzbek translations */ },
  tr: { /* Turkish translations */ },
};
```

## 📊 Database Schema

The bot uses 5 main tables:

- **users**: Store user information and preferences
- **conversations**: Log all interactions
- **leads**: Track potential customers
- **sessions**: Temporary conversation state
- **admin_states**: Admin panel state management

TypeORM will automatically create these tables when you run the bot in development mode (`synchronize: true`).

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

### CRM notifications not working

- Verify `CRM_CHANNEL_ID` is correct (should start with -100)
- Ensure bot is added as admin to the channel
- Check bot logs for errors

### Database connection errors

- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

## 🚦 Development Workflow

```bash
# Install dependencies
npm install

# Run in development mode (auto-reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint

# Format code
npm run format
```

## 📈 Future Enhancements

- Analytics dashboard with charts
- Document upload for admissions
- Online application form
- Payment integration
- Appointment scheduling
- Student portal integration
- Email notifications
- SMS notifications
- Multi-bot support for different schools

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
