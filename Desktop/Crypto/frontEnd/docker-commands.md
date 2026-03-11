# Docker Commands for CryptoPeaks

## Build and Run Commands

### Build the Docker images
```bash
# From root directory - builds both frontend and backend
docker-compose build

# Or build individually
docker build -t cryptopeak-frontend ./frontEnd
docker build -t cryptopeak-backend ./backEnd
```

### Using Docker Compose (Recommended)
```bash
# From root directory
# Build and start all services
docker-compose up -d --build

# Start services (if already built)
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f CryptoPeaks        # Frontend logs
docker-compose logs -f cryptopeak-backend # Backend logs

# Rebuild specific service
docker-compose build cryptopeak-frontend
docker-compose build cryptopeak-backend
```

## Development Commands

### Build for development with live reload
```bash
# Frontend development (from frontEnd directory)
cd frontEnd
npm run dev

# Backend development (from backEnd directory)
cd backEnd
./mvnw spring-boot:run
```

### Build production version
```bash
# Frontend
cd frontEnd
npm run build

# Backend
cd backEnd
./mvnw clean package
```

## Container Management

### View running containers
```bash
docker ps
```

### Stop containers
```bash
docker stop CryptoPeaks cryptopeak-backend
```

### Remove containers
```bash
docker rm CryptoPeaks cryptopeak-backend
```

### View container logs
```bash
docker logs CryptoPeaks        # Frontend logs
docker logs cryptopeak-backend # Backend logs
```

### Execute commands in running container
```bash
docker exec -it CryptoPeaks sh        # Frontend container
docker exec -it cryptopeak-backend sh # Backend container
```

## Image Management

### List images
```bash
docker images
```

### Remove images
```bash
docker rmi cryptopeak-frontend
docker rmi cryptopeak-backend
```

### Clean up unused images and containers
```bash
docker system prune -a
```

## Health Check

### Check container health
```bash
docker inspect --format='{{.State.Health.Status}}' CryptoPeaks
docker inspect --format='{{.State.Health.Status}}' cryptopeak-backend
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
  --name CryptoPeaks \
  cryptopeak-frontend
```

## Full Stack Deployment

### Quick Start (from root directory)
```bash
# Build and run everything
docker-compose up -d --build

# Or if images already exist
docker-compose up -d
```

### Manual Build and Run
```bash
# Build both images
docker build -t cryptopeak-frontend ./frontEnd
docker build -t cryptopeak-backend ./backEnd

# Run with docker-compose
docker-compose up -d
```

Access the application:
- **CryptoPeaks App**: http://localhost:4567
- **API Backend**: http://localhost:9876

## Container Names
- **CryptoPeaks** - Main application (frontend)
- **cryptopeak-backend** - Backend API server
- **Images**: cryptopeak-frontend, cryptopeak-backend

## Project Structure
```
CryptoPeak/
├── docker-compose.yml    # Main orchestration file
├── frontEnd/
│   ├── Dockerfile
│   └── ...
├── backEnd/
│   ├── Dockerfile
│   └── ...
└── frontEnd/docker-commands.md  # This file
```