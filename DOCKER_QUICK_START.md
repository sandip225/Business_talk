# 🚀 Docker Quick Start Guide

## One-Line Deployment

```bash
chmod +x deploy-ec2.sh && ./deploy-ec2.sh
```

## Prerequisites Checklist

- [ ] AWS EC2 instance running
- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] Ports 80, 443, 5000 open in security group
- [ ] `.env` file configured

## 3-Step Manual Setup

### Step 1: Environment Setup
```bash
cp docker.env.example .env
nano .env  # Edit with your values
```

### Step 2: Build & Deploy
```bash
docker-compose build
docker-compose up -d
```

### Step 3: Verify
```bash
docker-compose ps
curl http://localhost:5000/api/health
curl http://localhost:80
```

## Essential Commands

| Task | Command |
|------|---------|
| **Start** | `docker-compose up -d` |
| **Stop** | `docker-compose down` |
| **Restart** | `docker-compose restart` |
| **Logs** | `docker-compose logs -f` |
| **Status** | `docker-compose ps` |
| **Update** | `git pull && docker-compose up -d --build` |
| **Backup DB** | `docker exec business-talk-mongodb mongodump -u admin -p yourpass --gzip --archive=/data/backup.gz` |

## Troubleshooting One-Liners

```bash
# Container won't start?
docker-compose logs [service-name]

# Port conflict?
sudo lsof -i :80

# Out of space?
docker system prune -a

# Reset everything?
docker-compose down -v && docker-compose up -d
```

## Environment Variables Required

```env
MONGO_ROOT_PASSWORD=<strong-password>
JWT_SECRET=<32-char-random-string>
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
MONGODB_URI=mongodb://admin:<password>@mongodb:27017/business-talk?authSource=admin
```

## Service URLs

- **Frontend**: `http://your-ec2-ip:80`
- **Backend**: `http://your-ec2-ip:5000`
- **API Health**: `http://your-ec2-ip:5000/api/health`

## Production Deployment

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Full Documentation

📖 See `EC2_DEPLOYMENT_GUIDE.md` for complete instructions
📖 See `DOCKER_README.md` for detailed commands

## Support

🐛 Issues: https://github.com/dipakbipinbhatt/Business_talk/issues

---

**Last Updated**: January 2026

