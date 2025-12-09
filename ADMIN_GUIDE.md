# Administrator Guide - Oxbridge Telegram Bot

## Admin Role & Permissions

The administrator role in this bot allows you to manage users, send broadcasts, and handle admissions data.

### How to Become an Admin

Admins are defined in the `.env` file:

```bash
ADMIN_IDS=123456789,987654321
```

Add your Telegram user ID (comma-separated for multiple admins) to this variable.

**How to find your Telegram ID:**
1. Start the bot
2. Send any message
3. Check the bot logs - your ID will be shown
4. Or use [@userinfobot](https://t.me/userinfobot) on Telegram

---

## Broadcasting Messages to All Users

### Method 1: Using the Bot (Recommended)

1. **Start the bot** and ensure you're recognized as an admin
2. **Access Admin Menu**: Use the `/admin` command
3. **Select "Broadcast message"** from the admin menu
4. **Type your message** - supports:
   - Plain text
   - **Markdown formatting** (bold, italic, etc.)
   - Links
   - Images (send photo with caption)
5. **Confirm** - Review and send

The bot will:
- Send to all users who have interacted with the bot
- Track delivery status
- Show you statistics (sent, failed, blocked users)

### Method 2: Using Code Directly

If you want to broadcast programmatically, you can use the broadcast service:

```typescript
import { broadcastService } from './src/bot/services/broadcastService';

// Broadcast to all users
await broadcastService.broadcastToAllUsers(
    bot,
    'Your message here',
    { parse_mode: 'Markdown' }
);

// Broadcast to specific segment
await broadcastService.broadcastToSegment(
    bot,
    'Your message',
    { hasApplied: true },  // Only users who submitted applications
    { parse_mode: 'Markdown' }
);
```

---

## Admin Commands

Once you're set as an admin, you have access to these commands:

### `/admin`
Opens the admin control panel with options:
- 📊 View Statistics
- 📢 Broadcast Message
- 👥 Manage Users
- 📝 View Applications
- ⚙️ Bot Settings

### `/stats`
Quick access to bot statistics:
- Total users
- New users (today/week/month)
- Active applications
- Mini app usage

### `/broadcast`
Direct access to broadcast interface

### `/users`
List and filter users:
- All users
- Active users (used bot recently)
- Inactive users
- Users with pending applications

### `/export`
Export data in CSV format:
- All users
- Applications
- Mini app submissions

---

## User Management

### Viewing User Details

```typescript
// src/bot/repositories/UserRepository.ts
const user = await userRepo.findByTelegramId(telegramId);
```

User data includes:
- Telegram ID and username
- First/last name
- Language preference
- Registration date
- Last active date
- Application status

### Finding Users

```typescript
// Find users by criteria
const activeUsers = await userRepo.findActive(7); // Active in last 7 days
const newUsers = await userRepo.findNewUsers(30); // Registered in last 30 days
```

---

## Broadcasting Best Practices

### 1. **Timing**
- Send during business hours (9 AM - 6 PM Tashkent time)
- Avoid late night/early morning
- Consider time zones if you have international users

### 2. **Frequency**
- Don't spam - max 1-2 broadcasts per week
- Important announcements only
- Use segmentation when possible

### 3. **Message Format**
Good broadcast:
```
🎓 New Academic Year 2025-2026

Dear Parents,

Applications for the 2025-2026 academic year are now open!

✅ Early bird discount: 10% off until March 1st
✅ Limited spaces available
✅ Priority for current families

Apply now: /start

Questions? Contact our admissions team.
```

Bad broadcast:
```
HEY!!! REGISTER NOW!!! LIMITED TIME!!! CLICK HERE!!!
```

### 4. **Personalization**
Use user data when available:

```typescript
const message = `Hello ${user.firstName}! 👋\n\nWe noticed you started an application...`;
```

### 5. **Tracking**
Monitor broadcast metrics:
- Delivery rate
- Click-through rate (if using inline buttons)
- User responses

---

## Broadcast Service Architecture

### How It Works

1. **Queue System**
   - Messages are queued to avoid Telegram rate limits
   - Processes ~30 messages/second
   - Handles errors gracefully

2. **Delivery Tracking**
```typescript
interface BroadcastResult {
    sent: number;
    failed: number;
    blocked: number;
    userIds: {
        sent: number[];
        failed: number[];
        blocked: number[];
    };
}
```

3. **Error Handling**
   - Detects when users have blocked the bot
   - Updates user status accordingly
   - Retries failed messages (configurable)

### Code Location

- **Service**: `src/bot/services/broadcastService.ts`
- **Admin Handler**: `src/bot/handlers/adminHandler.ts`
- **User Repository**: `src/bot/repositories/UserRepository.ts`

---

## Segmented Broadcasting

### By Application Status

```typescript
// Only to users who haven't applied yet
await broadcastService.broadcastToSegment(
    bot,
    'Reminder: Applications close soon!',
    { hasApplied: false }
);
```

### By Language

```typescript
// Send in user's preferred language
const ruUsers = await userRepo.findByLanguage('ru');
for (const user of ruUsers) {
    await bot.telegram.sendMessage(
        user.telegramId,
        'Сообщение на русском...'
    );
}
```

### By Activity

```typescript
// Re-engage inactive users
const inactiveUsers = await userRepo.findInactive(30); // 30 days
for (const user of inactiveUsers) {
    await bot.telegram.sendMessage(
        user.telegramId,
        '👋 We miss you! Come back and complete your application.'
    );
}
```

---

## Monitoring & Analytics

### Key Metrics to Track

1. **User Growth**
   - Daily new users
   - Total active users
   - Retention rate

2. **Application Funnel**
   - Started applications
   - Completed applications
   - Conversion rate

3. **Broadcast Performance**
   - Open rate (based on bot activity after broadcast)
   - Response rate
   - Unsubscribe/block rate

### Database Queries

```sql
-- Total users
SELECT COUNT(*) FROM users;

-- New users this month
SELECT COUNT(*) FROM users
WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE);

-- Active users (last 7 days)
SELECT COUNT(*) FROM users
WHERE last_active >= CURRENT_DATE - INTERVAL '7 days';

-- Applications by status
SELECT status, COUNT(*) FROM leads
GROUP BY status;
```

---

## Safety & Privacy

### Important Notes

1. **GDPR Compliance**
   - Users can request data deletion
   - Implement `/deletemydata` command
   - Store only necessary data

2. **Rate Limits**
   - Telegram limits: 30 messages/second
   - Bot API: Consider using local Bot API for higher limits

3. **User Privacy**
   - Don't share user data
   - Secure admin access
   - Log access to sensitive data

4. **Spam Prevention**
   - Allow users to opt-out
   - Respect block/stop commands
   - Don't re-add users who blocked the bot

---

## Troubleshooting

### "Broadcast not sending"
1. Check Telegram API rate limits
2. Verify bot token is valid
3. Check user IDs are correct
4. Review error logs

### "Some users not receiving"
- User may have blocked the bot
- Telegram account deleted
- Check `blocked` status in database

### "Slow delivery"
- Increase queue processing speed (carefully)
- Use Telegram local Bot API server
- Reduce message size

---

## Quick Reference

### Admin Menu Access
```
/admin → Admin Panel
/stats → Statistics
/broadcast → Send Broadcast
/users → User Management
/export → Export Data
```

### Code Snippets

**Send broadcast:**
```typescript
await broadcastService.broadcastToAllUsers(bot, message);
```

**Get statistics:**
```typescript
const stats = await userRepo.getStatistics();
```

**Find user:**
```typescript
const user = await userRepo.findByTelegramId(id);
```

---

## Need Help?

For technical support or questions about the admin system:
- Check logs in `logs/` directory
- Review source code in `src/bot/`
- Consult Telegram Bot API docs: https://core.telegram.org/bots/api

