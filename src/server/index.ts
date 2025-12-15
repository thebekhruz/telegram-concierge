import express, { Request, Response, NextFunction } from 'express';
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
    const {
      leadType,
      parentName,
      parentPhone,
      parentEmail,
      numChildren,
      childAges,
      programInterest,
      specificQuestions,
      language,
      interests,
      telegramUser
    } = req.body;

    // Validate required fields
    if (!parentName || !parentPhone) {
      return res.status(400).json({ success: false, error: 'Parent name and phone are required' });
    }

    // Send notification to CRM channel if configured
    if (config.crmChannelId && config.botToken) {
      try {
        const bot = new Telegraf(config.botToken);

        // Map lead types to friendly names
        const leadTypeNames: Record<string, string> = {
          'tour': '🏫 School Tour Request',
          'openhouse': '🎪 Open House Registration',
          'interview': '💼 Admissions Interview Request'
        };

        const leadTypeName = leadTypeNames[leadType] || '📋 New Application';

        // Format the message
        let crmMessage = `${leadTypeName}\n`;
        crmMessage += `━━━━━━━━━━━━━━━━━━━\n\n`;

        // Parent Information
        crmMessage += `👤 PARENT INFORMATION\n`;
        crmMessage += `Name: ${parentName}\n`;
        crmMessage += `📱 Phone: ${parentPhone}\n`;
        if (parentEmail) {
          crmMessage += `📧 Email: ${parentEmail}\n`;
        }

        // Telegram user info
        if (telegramUser && telegramUser.id) {
          if (telegramUser.username) {
            crmMessage += `🔗 Username: @${telegramUser.username}\n`;
          }
          crmMessage += `🆔 Telegram ID: ${telegramUser.id}\n`;
          if (telegramUser.first_name || telegramUser.last_name) {
            const fullName = [telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(' ');
            crmMessage += `👨‍💼 Telegram Name: ${fullName}\n`;
          }
        }

        // Application Details
        crmMessage += `\n👨‍👩‍👧‍👦 APPLICATION DETAILS\n`;
        crmMessage += `Children Count: ${numChildren}\n`;

        if (childAges && childAges.length > 0) {
          crmMessage += `Ages: ${childAges.join(', ')}\n`;
        }

        if (programInterest) {
          crmMessage += `Program Interest: ${programInterest}\n`;
        }

        // Additional Information
        crmMessage += `\n📊 PREFERENCES\n`;
        crmMessage += `🌐 Language: ${language?.toUpperCase() || 'Not specified'}\n`;

        if (interests && interests.length > 0) {
          crmMessage += `🎯 Interests: ${interests.join(', ')}\n`;
        }

        if (specificQuestions) {
          crmMessage += `\n💬 SPECIFIC QUESTIONS\n`;
          crmMessage += `${specificQuestions}\n`;
        }

        crmMessage += `\n⏰ Submitted: ${new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Tashkent',
          dateStyle: 'medium',
          timeStyle: 'short'
        })}`;

        // Send message with contact button
        const messageOptions: any = {
          parse_mode: 'HTML' as const,
        };

        // Add inline keyboard with contact button if Telegram user ID is available
        if (telegramUser && telegramUser.id) {
          messageOptions.reply_markup = {
            inline_keyboard: [
              [
                {
                  text: '📞 Contact on Telegram',
                  url: `tg://user?id=${telegramUser.id}`,
                },
              ],
            ],
          };
        }

        await bot.telegram.sendMessage(config.crmChannelId, crmMessage, messageOptions);

        console.log('✅ Lead forwarded to Telegram CRM channel');
      } catch (error) {
        console.error('❌ Error sending to CRM channel:', error);
        // Don't fail the request if Telegram sending fails
        // Log the error but continue
      }
    } else {
      console.warn('⚠️ CRM_CHANNEL_ID or BOT_TOKEN not configured. Lead not forwarded to Telegram.');
    }

    // Optionally store in database if repositories are available
    // This is optional for v1.0 - can be enabled later
    try {
      if (telegramUser && telegramUser.id) {
        const user = await userRepo.findOrCreate(
          telegramUser.id,
          telegramUser.username,
          telegramUser.first_name,
          telegramUser.last_name
        );

        if (parentPhone) {
          await userRepo.setPhoneNumber(user.telegramId, parentPhone);
        }

        // Create lead record
        await leadRepo.createLead({
          userId: user.id,
          phoneNumber: parentPhone,
          // campus is optional - not collected in v1.0 form
          // programType and classLevel are also optional - using generic values
          classLevel: childAges && childAges.length > 0 ? childAges[0] : undefined,
          numberOfChildren: parseInt(numChildren) || 0,
          year: new Date().getFullYear().toString(),
        });

        console.log('✅ Lead stored in database');
      }
    } catch (dbError) {
      console.error('❌ Error storing lead in database:', dbError);
      // Continue even if database storage fails
    }

    res.json({ success: true, message: 'Application submitted successfully' });
  } catch (error) {
    console.error('❌ Error submitting lead:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve index.html for all other routes (SPA fallback)
// Use app.use() instead of app.get() for Express 5.x compatibility
app.use((req: Request, res: Response, next: NextFunction) => {
  // Skip if it's an API route or static file request
  if (req.path.startsWith('/api/') || 
      /\.(jpg|jpeg|png|svg|gif|webp|css|js|ico|woff|woff2|ttf|eot)$/i.test(req.path)) {
    return next();
  }
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
