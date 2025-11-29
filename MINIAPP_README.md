# Telegram Mini App Setup Guide

This document explains how to set up and use the Telegram Mini App for Oxbridge International School.

## Overview

The Mini App provides a clean, modern interface for prospective parents to:
- Browse campus information with images
- Select educational programs
- Provide student details
- Schedule consultations with admissions managers

## Features

- **Clean & Minimalistic Design**: Fast, mobile-first interface
- **Image Support**: Campus photos to showcase facilities
- **Multi-step Form**: Intuitive information collection
- **Qualifying Questions**: Helps admissions team understand prospects better
- **Direct Manager Connection**: Seamless lead submission to CRM

## Setup Instructions

### 1. Add Campus Images

Place your campus photos in the `public/images/` directory:

```
public/images/
├── campus-hero.png      # Hero banner (1200x500px)
├── campus-mu.jpg        # MU Campus (800x600px)
└── campus-yash.jpg      # Yashnobod Campus (800x600px)
```

**Image Guidelines:**
- Use high-quality, professional photos
- Optimize for web (compress to reduce file size)
- JPG or WebP format recommended
- Show students, facilities, classrooms, outdoor areas

### 2. Environment Variables

Add these to your `.env` file:

```bash
# Mini App Configuration
WEB_APP_URL=https://your-domain.com
WEB_APP_PORT=3000
```

**For production:**
- Use HTTPS URL (required by Telegram)
- Set up SSL certificate
- Configure domain and reverse proxy

**For development:**
- Use ngrok or similar tunneling service
- Example: `WEB_APP_URL=https://abc123.ngrok.io`

### 3. Register Mini App with BotFather

1. Open [@BotFather](https://t.me/botfather) in Telegram
2. Send `/mybots`
3. Select your bot
4. Choose "Bot Settings" → "Menu Button"
5. Choose "Configure menu button"
6. Send the Mini App URL: `https://your-domain.com`
7. Send a description: "Apply to Oxbridge"

### 4. Deploy

**Build the project:**
```bash
npm run build
```

**Start the server:**
```bash
npm start
```

The bot will automatically start both:
- Telegram bot on Telegram servers
- Web server on port 3000 (or WEB_APP_PORT)

## Architecture

### Frontend (Mini App)
- **HTML**: `public/index.html` - Single page app structure
- **CSS**: `public/css/style.css` - Responsive, mobile-first styling
- **JavaScript**: `public/js/app.js` - Client-side logic and Telegram Web App SDK integration

### Backend
- **Express Server**: `src/server/index.ts` - Serves static files and API
- **API Endpoint**: `/api/submit-lead` - Handles form submissions
- **Integration**: Uses existing database repositories and CRM notification system

### Data Flow

1. User opens mini app from Telegram
2. User fills out multi-step form
3. Form data collected in `userData` object
4. On "Connect to Manager" click:
   - Data sent to `/api/submit-lead` endpoint
   - Lead created in database
   - Notification sent to CRM channel
   - Success message shown to user

## Customization

### Branding Colors

Edit `public/css/style.css` CSS variables:

```css
:root {
    --primary-color: #2C5F8D;      /* Main brand color */
    --secondary-color: #D4AF37;     /* Accent/CTA color */
    --accent-color: #1E4266;        /* Dark shade */
}
```

### Form Questions

Modify `public/index.html` step 4 to add/remove qualifying questions:

```html
<div class="form-group">
    <label>Your Question</label>
    <select id="yourField" class="form-control">
        <option value="">Select...</option>
        <option value="option1">Option 1</option>
    </select>
</div>
```

Remember to:
1. Add field to `userData` object in `app.js`
2. Update `displaySummary()` function
3. Add to CRM message in `src/server/index.ts`

### Translations

The mini app currently uses English. To add translations:

1. Create language detection based on `tg.initDataUnsafe.user.language_code`
2. Create translation object similar to `src/data/translations.ts`
3. Update HTML content dynamically based on language

## Testing

### Local Testing

1. Use ngrok to expose local server:
   ```bash
   ngrok http 3000
   ```

2. Update `.env` with ngrok URL:
   ```
   WEB_APP_URL=https://abc123.ngrok.io
   ```

3. Update BotFather with ngrok URL

4. Test in Telegram on mobile device

### Production Testing

- Test on multiple devices (iOS, Android, Desktop)
- Verify image loading
- Check form validation
- Test CRM notifications
- Monitor error logs

## Troubleshooting

### Mini App doesn't open
- Check WEB_APP_URL is HTTPS (required by Telegram)
- Verify URL registered with BotFather
- Check server is running and accessible

### Images not loading
- Verify images exist in `public/images/`
- Check file names match exactly
- Ensure proper file permissions
- Check browser console for 404 errors

### Form submission fails
- Check `/api/submit-lead` endpoint logs
- Verify database connection
- Check CRM_CHANNEL_ID configuration
- Monitor server console for errors

## Security

- Validate Telegram Web App data on server
- Use HTTPS in production
- Sanitize user input
- Rate limit API endpoints
- Monitor for abuse

## Performance

- Compress images (use TinyPNG or similar)
- Enable gzip compression on server
- Use CDN for static assets (optional)
- Minimize JavaScript/CSS

## Support

For issues or questions:
1. Check server logs: `console.log` in terminal
2. Check browser console: F12 in browser
3. Review Telegram documentation: https://core.telegram.org/bots/webapps

## Future Enhancements

Potential improvements:
- Add multi-language support
- Integrate payment gateway
- Add appointment scheduling
- Include virtual tour
- Add live chat widget
- Implement analytics tracking
