#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

# Define Colors for Beautiful Console Output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}   Pharma Sales Intelligence Platform Launcher    ${NC}"
echo -e "${BLUE}==================================================${NC}"

# 1. Check if Node dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}[!] node_modules not found. Installing dependencies...${NC}"
    npm install
else
    echo -e "${GREEN}[✓] Node dependencies installed.${NC}"
fi

# 2. Check if Virtual Environment exists
if [ ! -d ".venv" ]; then
    echo -e "${RED}[✗] Python virtual environment (.venv) not found!${NC}"
    echo -e "${YELLOW}Please run the following commands to set it up:${NC}"
    echo -e "  python3 -m venv .venv"
    echo -e "  source .venv/bin/activate"
    echo -e "  pip install -r requirements.txt"
    exit 1
else
    echo -e "${GREEN}[✓] Python virtual environment detected.${NC}"
fi

# 3. Check for free ports (Vite: 4200, Django: 8000)
check_port() {
    local port=$1
    local name=$2
    if lsof -Pi :"$port" -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${RED}[✗] Port $port ($name) is already in use!${NC}"
        echo -e "${YELLOW}Please stop the service running on port $port and try again.${NC}"
        exit 1
    fi
}

echo -e "${BLUE}[*] Checking port availability...${NC}"
check_port 4200 "Frontend"
check_port 8000 "Backend"
echo -e "${GREEN}[✓] Ports 4200 and 8000 are available.${NC}"

# 4. Check if PostgreSQL is running and apply database migrations
echo -e "${BLUE}[*] Checking PostgreSQL database connection...${NC}"
if ! lsof -Pi :5432 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${RED}[✗] PostgreSQL database is not running on port 5432!${NC}"
    echo -e "${YELLOW}Please start the database container first by running: ${GREEN}npm run dev:db:run${NC}"
    exit 1
fi

echo -e "${GREEN}[✓] PostgreSQL database is online. Running migrations...${NC}"
.venv/bin/python apps/backend/manage.py migrate

# 5. Start development servers
echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}  Starting Django (Port 8000) and React (Port 4200)${NC}"
echo -e "${GREEN}==================================================${NC}"

# Launch Nx dev target
npx nx run-many -t serve --parallel=true
