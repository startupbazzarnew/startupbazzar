# StartupBazzar Deployment Guide

## Prerequisites
- Node.js 18 or higher
- npm or yarn
- A Supabase account
- A Razorpay account
- A domain name (e.g., startupbazzar.com)

## Environment Setup

1. Create a `.env.production` file with the following variables:
```env
# Supabase
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key

# Application
VITE_APP_URL=https://startupbazzar.com

# Payment Gateway
RAZORPAY_KEY_ID=your_production_razorpay_key_id
RAZORPAY_KEY_SECRET=your_production_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_production_razorpay_key_id
VITE_RAZORPAY_KEY_ID=your_production_razorpay_key_id
```

## Build and Deploy

1. Install dependencies:
```bash
npm install
```

2. Build the production version:
```bash
npm run build:prod
```

3. Start the production server:
```bash
npm start
```

## Deployment Options

### Option 1: Traditional VPS (e.g., DigitalOcean, AWS EC2)
1. Set up a VPS with Node.js installed
2. Clone the repository
3. Follow the build and deploy steps above
4. Use PM2 or similar to keep the server running:
```bash
npm install -g pm2
pm2 start server/index.js --name startupbazzar
```

### Option 2: Containerized Deployment (Docker)
1. Build the Docker image:
```bash
docker build -t startupbazzar .
```

2. Run the container:
```bash
docker run -p 3000:3000 --env-file .env.production startupbazzar
```

### Option 3: Serverless Deployment (Vercel, Netlify)
1. Connect your repository to the platform
2. Configure environment variables
3. Deploy using the platform's dashboard

## Post-Deployment Checklist

1. Verify all environment variables are set correctly
2. Test the application thoroughly in production
3. Set up SSL/TLS certificates
4. Configure domain DNS settings
5. Set up monitoring and logging
6. Configure backup solutions
7. Test payment gateway integration
8. Verify email functionality
9. Check SEO meta tags and analytics

## Maintenance

1. Regular updates:
```bash
npm update
```

2. Monitor logs:
```bash
pm2 logs startupbazzar
```

3. Restart server if needed:
```bash
pm2 restart startupbazzar
```

## Security Considerations

1. Keep all dependencies updated
2. Use HTTPS only
3. Implement rate limiting
4. Set up proper CORS policies
5. Regular security audits
6. Monitor for suspicious activities
7. Keep environment variables secure
8. Regular backups of database

## Support

For any deployment issues or questions, contact:
- Email: startupbazzarhelp@gmail.com
- Support Portal: https://startupbazzar.com/support 