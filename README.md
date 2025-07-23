# 📁 File Upload Platform

A modern file upload platform built with [SvelteKit](https://kit.svelte.dev), featuring content management with metadata collection and cloud storage integration using [SST](https://docs.sst.dev/) and [AWS](https://aws.amazon.com/).

> ⚠️ **AWS is required** for both development and production.  
> This project relies on live AWS infrastructure (e.g., RDS, S3) even during local development via [SST tunnels](https://docs.sst.dev/docs/environment/tunnel).

## 🚀 Quick Start

### Development Environment

Get up and running in minutes! 

```bash
# Install dependencies
npm i

# Generate Prisma client
npx prisma generate

# Start development server (requires AWS credentials)
npx sst dev
```

That's it! Your dev environment should be running at `http://localhost:5173` 🎉

### Database Migration (Dev)

When you need to update your database schema:

```bash
# Open tunnel for database access (uses live RDS on AWS)
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

- **Frontend**: [SvelteKit](https://kit.svelte.dev) + [TypeScript](https://www.typescriptlang.org/)
- **Backend**: SvelteKit API routes
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Prisma](https://www.prisma.io/docs))
- **Infrastructure**: [AWS](https://aws.amazon.com/) (via [SST v3](https://docs.sst.dev))
- **File Storage**: [Amazon S3](https://docs.aws.amazon.com/s3/)
- **Deployment**: Docker + AWS ECS or Lambda

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

## 🔧 Development Notes

- The project uses **SST v3** for infrastructure as code  
- **Prisma** handles database schema and migrations  
- File uploads are processed and stored in **S3**  
- The application supports multiple file formats and metadata fields  
- **Docker** ensures consistent deployment across environments

## 💔 Known Limitations & Possible Improvements

- In-platform **file previewer**
- Any form of **testing** was not taken into consideration due to the limited timeframe of the assignment 😔
- Use of **environment variables for deployment in Dockerfile** is not ideal, but passable given the scope
- File handling could be improved (**virus scanning**, MIME type restrictions, **execution prevention**)
- DB structure could be **normalized** and extended for **future-proofing**
- The current implementation does not include **observability** tools, **logging** is limited and not effective

## 📚 Further Reading

- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [SST v3 Docs](https://docs.sst.dev/)
- [Prisma Docs](https://www.prisma.io/docs)
- [AWS Documentation](https://docs.aws.amazon.com/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

## 🤝 Need Help?

If you encounter any issues:

1. Make sure all dependencies are installed: `npm i`
2. Ensure Prisma client is generated: `npx prisma generate`
3. Check that your **AWS credentials** are configured
4. Verify database connections with `npx sst tunnel`

Happy coding! 💻✨