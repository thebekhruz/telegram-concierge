import express, { Request, Response } from 'express';
import path from 'path';
import { config } from '../config';
import { UserRepository } from '../database/repositories/UserRepository';
import { LeadRepository } from '../database/repositories/LeadRepository';
import { Telegraf } from 'telegraf';

const app = express();
const userRepo = new UserRepository();
const leadRepo = new LeadRepository();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../../public')));

// API endpoint to submit lead from mini app
app.post('/api/submit-lead', async (req: Request, res: Response) => {
  try {
    const { userData, telegramUser } = req.body;

    if (!telegramUser || !telegramUser.id) {
      return res.status(400).json({ success: false, error: 'Invalid Telegram user data' });
    }

    // Find or create user
    const user = await userRepo.findOrCreate(
      telegramUser.id,
      telegramUser.username,
      telegramUser.first_name,
      telegramUser.last_name
    );

    // Create lead with mini app data
    const lead = await leadRepo.createLead({
      userId: user.id,
      phoneNumber: user.phoneNumber || undefined,
      campus: userData.campus,
      programType: userData.program,
      classLevel: userData.childAge,
      numberOfChildren: userData.numberOfChildren,
      year: userData.startDate,
    });

    // Send notification to CRM channel if configured
    if (config.crmChannelId) {
      try {
        const bot = new Telegraf(config.botToken);

        let crmMessage = `🎓 New Lead from Mini App\n\n`;
        crmMessage += `👤 Name: ${user.firstName || ''} ${user.lastName || ''}\n`;
        if (user.phoneNumber) {
          crmMessage += `📱 Phone: ${user.phoneNumber}\n`;
        }
        if (user.username) {
          crmMessage += `🔗 Username: @${user.username}\n`;
        }
        crmMessage += `🆔 Telegram ID: ${user.telegramId}\n`;

        crmMessage += `\n📊 Application Details:\n`;
        crmMessage += `🏫 Campus: ${userData.campus}\n`;
        crmMessage += `📚 Program: ${userData.program}\n`;
        crmMessage += `👨‍👩‍👧‍👦 Children: ${userData.numberOfChildren}\n`;
        crmMessage += `👶 Child Age: ${userData.childAge}\n`;
        crmMessage += `📖 Current Level: ${userData.educationLevel}\n`;
        crmMessage += `🌐 Preferred Language: ${userData.preferredLanguage}\n`;
        crmMessage += `📅 Start Date: ${userData.startDate}\n`;

        if (userData.additionalComments) {
          crmMessage += `\n💬 Comments: ${userData.additionalComments}\n`;
        }

        crmMessage += `\n🔗 Lead ID: #${lead.id}`;

        await bot.telegram.sendMessage(config.crmChannelId, crmMessage, {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '📞 Contact Now',
                  url: `tg://user?id=${user.telegramId}`,
                },
              ],
            ],
          },
        });
      } catch (error) {
        console.error('Error sending to CRM channel:', error);
      }
    }

    res.json({ success: true, leadId: lead.id });
  } catch (error) {
    console.error('Error submitting lead:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve index.html for all other routes (SPA fallback)
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

export function startWebServer(port: number = 3000): Promise<void> {
  return new Promise((resolve) => {
    app.listen(port, () => {
      console.log(`🌐 Web server running on port ${port}`);
      console.log(`📱 Mini app URL: http://localhost:${port}`);
      resolve();
    });
  });
}

export default app;
