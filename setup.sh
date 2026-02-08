#!/bin/bash

echo "========================================="
echo "Finance System - Setup Script"
echo "========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "Docker is installed"
echo ""

# Setup backend environment
echo "Setting up backend environment..."
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "Backend .env file created"
else
    echo "Backend .env already exists"
fi

echo ""
echo "Starting Docker containers..."
docker-compose up -d

echo ""
echo "Waiting for MySql to be ready..."
sleep 10

echo ""
echo "Installing backend dependencies..."
docker exec -it finance_backend composer install

echo ""
echo "Generating application key..."
docker exec -it finance_backend php artisan key:generate

echo ""
echo "Running database migrations..."
docker exec -it finance_backend php artisan migrate --seed --force

echo ""
echo "========================================="
echo "Setup completed successfully!"
echo "========================================="
echo ""
echo "You can now access:"
echo "  - Frontend: http://localhost:5173"
echo "  - Backend API: http://localhost:8000"
echo "  - Database: localhost:3306"
echo ""
echo "To stop the containers: docker-compose down"
echo "To view logs: docker-compose logs -f"
echo ""
