# Docker Commands for CryptoPeak Frontend

## Build and Run Commands

### Build the Docker image
```bash
docker build -t cryptopeak-frontend .
```

### Run the container
```bash
docker run -d -p 3000:80 --name cryptopeak-frontend cryptopeak-frontend
```

### Using Docker Compose (Recommended)
```bash
# Build and start all services
docker-compose up -d --build

# Start services (if already built)
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f cryptopeak-frontend

# Rebuild specific service
docker-compose build cryptopeak-frontend
```

## Development Commands

### Build for development with live reload
```bash
# Run development server locally (not in Docker)
npm run dev
```

### Build production version
```bash
npm run build
```

## Container Management

### View running containers
```bash
docker ps
```

### Stop container
```bash
docker stop cryptopeak-frontend
```

### Remove container
```bash
docker rm cryptopeak-frontend
```

### View container logs
```bash
docker logs cryptopeak-frontend
```

### Execute commands in running container
```bash
docker exec -it cryptopeak-frontend sh
```

## Image Management

### List images
```bash
docker images
```

### Remove image
```bash
docker rmi cryptopeak-frontend
```

### Clean up unused images and containers
```bash
docker system prune -a
```

## Health Check

### Check container health
```bash
docker inspect --format='{{.State.Health.Status}}' cryptopeak-frontend
```

### Test health endpoint
```bash
curl http://localhost:3000/health
```

## Environment Variables

Set environment variables in docker-compose.yml or pass them during run:

```bash
docker run -d -p 3000:80 \
  -e NODE_ENV=production \
  --name cryptopeak-frontend \
  cryptopeak-frontend
```

## Full Stack Deployment

To run both frontend and backend together:

1. Build backend image first (from intrenProject directory):
   ```bash
   cd ../intrenProject
   docker build -t cryptopeak-backend .
   ```

2. Run full stack (from frontEnd directory):
   ```bash
   docker-compose up -d --build
   ```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080