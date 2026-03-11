# Docker Commands for CryptoPeak

## Build and Run Commands

### Build the Docker images
```bash
# Frontend image
docker build -t cryptopeak-frontend:v1.0 .

# Backend image (from backEnd directory)
cd ../backEnd
docker build -t cryptopeak-backend:v1.0 .
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
docker-compose logs -f cryptopeak        # Frontend logs
docker-compose logs -f cryptopeak-api    # Backend logs

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

### Stop containers
```bash
docker stop cryptopeak cryptopeak-api
```

### Remove containers
```bash
docker rm cryptopeak cryptopeak-api
```

### View container logs
```bash
docker logs cryptopeak        # Frontend logs
docker logs cryptopeak-api    # Backend logs
```

### Execute commands in running container
```bash
docker exec -it cryptopeak sh        # Frontend container
docker exec -it cryptopeak-api sh    # Backend container
```

## Image Management

### List images
```bash
docker images
```

### Remove images
```bash
docker rmi cryptopeak-frontend:v1.0
docker rmi cryptopeak-backend:v1.0
```

### Clean up unused images and containers
```bash
docker system prune -a
```

## Health Check

### Check container health
```bash
docker inspect --format='{{.State.Health.Status}}' cryptopeak
docker inspect --format='{{.State.Health.Status}}' cryptopeak-api
```

### Test health endpoints
```bash
curl http://localhost:4567/health        # Frontend health
curl http://localhost:9876/actuator/health  # Backend health
```

## Environment Variables

Set environment variables in docker-compose.yml or pass them during run:

```bash
docker run -d -p 4567:80 \
  -e NODE_ENV=production \
  --name cryptopeak \
  cryptopeak-frontend:v1.0
```

## Full Stack Deployment

To run both frontend and backend together:

1. Build both images:
   ```bash
   # Frontend
   docker build -t cryptopeak-frontend:v1.0 .
   
   # Backend (from backEnd directory)
   cd ../backEnd
   docker build -t cryptopeak-backend:v1.0 .
   cd ../frontEnd
   ```

2. Run full stack:
   ```bash
   docker-compose up -d
   ```

Access the application:
- **CryptoPeak App**: http://localhost:4567
- **API Backend**: http://localhost:9876

## Container Names
- **cryptopeak** - Main application (frontend)
- **cryptopeak-api** - Backend API server
- **Images**: cryptopeak-frontend:v1.0, cryptopeak-backend:v1.0