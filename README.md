# 📁 File Upload Platform

A modern file upload platform built with SvelteKit, featuring content management with metadata collection and cloud storage integration.

## 🚀 Quick Start

### Development Environment

Get up and running in minutes! 

```bash
# Install dependencies
npm i

# Generate Prisma client
npx prisma generate

# Start development server
npx sst dev
```

That's it! Your dev environment should be running at `http://localhost:5173` 🎉

### Database Migration (Dev)

When you need to update your database schema:

```bash
# Open tunnel for database access
npx sst tunnel

# In another terminal, run migrations
npx sst shell --stage dev --target Prisma -- npx prisma migrate dev
```

## 🌐 Production Deployment

### Deploy to Production

```bash
# Deploy to production
npx sst deploy --stage production
```

### Production Database Migration

```bash
# Open tunnel for production database
npx sst tunnel

# In another terminal, apply production migrations
npx sst shell --stage production --target Prisma -- npx prisma migrate deploy
```

## ⚙️ Docker Configuration

**Important**: Due to how AWS ELB (Elastic Load Balancer) works, make sure your Dockerfile includes these environment variables:

```dockerfile
ENV PROTOCOL_HEADER=x-forwarded-proto
ENV HOST_HEADER=x-forwarded-host
ENV ORIGIN=http://origin-behind-load-balancer.aws.com
```

These ensure proper request forwarding and origin handling behind the load balancer.

## 📋 Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npx sst dev` | Start SST development environment |
| `npx sst deploy` | Deploy to default stage |
| `npx sst deploy --stage production` | Deploy to production |
| `npx sst remove` | Remove deployed resources |
| `npx prisma studio` | Open Prisma database browser |

## 🏗️ Tech Stack

- **Frontend**: SvelteKit + TypeScript
- **Backend**: SvelteKit API routes
- **Database**: PostgreSQL (via Prisma)
- **Infrastructure**: AWS (via SST v3)
- **File Storage**: AWS S3
- **Deployment**: Docker + AWS ECS/Lambda

## 📝 About This Project

This platform was built as a recruitment challenge to demonstrate:

- **File Upload Management**: Upload various file types (PDF, videos, slides, etc.)
- **Metadata Collection**: Capture rich information about uploaded content
- **Content Organization**: Categorize and filter uploaded files
- **Cloud Integration**: Secure file storage with AWS S3
- **Modern Stack**: SvelteKit + SST for full-stack TypeScript development

### Core Features

✅ **File Upload Form** with validation  
✅ **Content Table** with sorting and filtering  
✅ **File Preview/Download** functionality  
✅ **Metadata Management** (title, description, category, language, provider, roles)  
✅ **Cloud Storage** integration  
✅ **Responsive Design** following provided mockups  

## 🔧 Development Notes

- The project uses SST v3 for infrastructure as code
- Prisma handles database schema and migrations
- File uploads are processed and stored in S3
- The application supports multiple file formats and metadata fields
- Docker ensures consistent deployment across environments

## 🤝 Need Help?

If you encounter any issues:

1. Make sure all dependencies are installed: `npm i`
2. Ensure Prisma client is generated: `npx prisma generate`
3. Check that your AWS credentials are configured
4. Verify database connections with `npx sst tunnel`

Happy coding! 💻✨