#!/bin/bash

# VPS Setup Script for RDP with xRDP
# Ubuntu/Debian

set -e

echo "=== VPS Setup for Fiverr Review Collector ==="
echo ""

# Update system
echo "1. Updating system..."
sudo apt update && sudo apt upgrade -y

# Install xRDP and XFCE desktop
echo "2. Installing xRDP and XFCE desktop..."
sudo apt install -y xrdp xfce4 xfce4-goodies

# Configure xRDP to use XFCE
echo "3. Configuring xRDP..."
echo xfce4-session > ~/.xsession
sudo systemctl enable xrdp
sudo systemctl start xrdp

# Allow RDP port
echo "4. Configuring firewall..."
sudo ufw allow 3389/tcp

# Install Node.js
echo "5. Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Chrome dependencies
echo "6. Installing Chrome dependencies..."
sudo apt install -y \
  libnss3 \
  libnspr4 \
  libdbus-1-3 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  libxshmfence1 \
  libgtk-3-0

# Install additional utilities
echo "7. Installing additional utilities..."
sudo apt install -y git tmux htop

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "1. Connect via RDP: $HOSTNAME:3389"
echo "2. Navigate to project directory"
echo "3. Run: npm install"
echo "4. Run: npx playwright install chrome"
echo "5. Run: npm run buyer username"
echo ""
echo "Default credentials:"
echo "User: $(whoami)"
echo "Password: (set during OS setup)"
echo ""