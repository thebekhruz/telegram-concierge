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
    const { applicationData, telegramUser } = req.body;

    if (!telegramUser || !telegramUser.id) {
      return res.status(400).json({ success: false, error: 'Invalid Telegram user data' });
    }

    if (!applicationData) {
      return res.status(400).json({ success: false, error: 'Invalid application data' });
    }

    // Find or create user
    const user = await userRepo.findOrCreate(
      telegramUser.id,
      telegramUser.username,
      telegramUser.first_name,
      telegramUser.last_name
    );

    // Update phone number if provided
    if (applicationData.parent && applicationData.parent.phone) {
      await userRepo.setPhoneNumber(user.telegramId, applicationData.parent.phone);
    }

    // Create lead with mini app data
    const lead = await leadRepo.createLead({
      userId: user.id,
      phoneNumber: applicationData.parent?.phone || user.phoneNumber || undefined,
      campus: applicationData.campus,
      programType: applicationData.children?.[0]?.program,
      classLevel: applicationData.children?.[0]?.grade,
      numberOfChildren: applicationData.children?.length || 0,
      year: applicationData.startDate,
    });

    // Send notification to CRM channel if configured
    if (config.crmChannelId) {
      try {
        const bot = new Telegraf(config.botToken);

        let crmMessage = `🎓 New Application from Mini App\n\n`;
        crmMessage += `👤 Parent: ${applicationData.parent.name}\n`;
        if (applicationData.parent.email) {
          crmMessage += `📧 Email: ${applicationData.parent.email}\n`;
        }
        if (applicationData.parent.phone) {
          crmMessage += `📱 Phone: ${applicationData.parent.phone}\n`;
        }
        if (user.username) {
          crmMessage += `🔗 Username: @${user.username}\n`;
        }
        crmMessage += `🆔 Telegram ID: ${user.telegramId}\n`;

        crmMessage += `\n📊 Application Details:\n`;
        crmMessage += `🏫 Campus: ${applicationData.campus}\n`;
        crmMessage += `🌐 Preferred Language: ${applicationData.preferredLanguage}\n`;
        crmMessage += `📅 Start Date: ${applicationData.startDate}\n`;

        if (applicationData.referralSource) {
          crmMessage += `📢 Referral: ${applicationData.referralSource}\n`;
        }

        if (applicationData.campusTourRequested) {
          crmMessage += `🏛️ Tour Requested: Yes\n`;
        }

        // List each child
        if (applicationData.children && applicationData.children.length > 0) {
          crmMessage += `\n👨‍👩‍👧‍👦 Children (${applicationData.children.length}):\n`;
          applicationData.children.forEach((child: any, index: number) => {
            crmMessage += `\n  ${index + 1}. ${child.name}\n`;
            crmMessage += `     Program: ${child.program}\n`;
            crmMessage += `     Grade/Level: ${child.grade}\n`;
          });
        }

        if (applicationData.additionalComments) {
          crmMessage += `\n💬 Comments:\n${applicationData.additionalComments}\n`;
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
