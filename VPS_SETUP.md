# VPS Setup Guide (RDP)

## Prerequisites

- VPS with Windows Server or Linux with RDP access
- At least 2GB RAM
- 10GB+ storage

## Windows Server (RDS)

### 1. Install Node.js
Download and install Node.js LTS from: https://nodejs.org/

### 2. Install Dependencies
```powershell
# Navigate to project directory
cd C:\path\to\fiverr-anaylysis

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chrome
```

### 3. Run via RDP
```powershell
# Run buyer reviews
npm run buyer username

# Run seller reviews  
npm run seller username
```

### 4. RDP Configuration
- Ensure Remote Desktop Session Host is enabled
- Allow user RDP access
- Connect via RDP client
- Browser will open in your RDP session

---

## Linux with xRDP (RDP Access)

### 1. Install Desktop Environment
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y xrdp xfce4 xfce4-goodies

# Start xrdp
sudo systemctl enable xrdp
sudo systemctl start xrdp

# Allow firewall
sudo ufw allow 3389/tcp
```

### 2. Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 3. Install Chrome Dependencies
```bash
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
  libasound2
```

### 4. Setup Project
```bash
# Navigate to project directory
cd /path/to/fiverr-anaylysis

# Install dependencies
npm install

# Install Playwright Chrome
npx playwright install chrome
```

### 5. Connect via RDP
- Use RDP client (Windows: mstsc, Mac: Microsoft Remote Desktop)
- Connect to `your-vps-ip:3389`
- Login with your credentials
- Open terminal and run the scraper

### 6. Run Application
```bash
# Run buyer reviews
npm run buyer username

# Run seller reviews
npm run seller username
```

---

## Important Notes

### Browser Visibility
- Browser opens in your RDP session (headless: false)
- You can interact with it for manual login
- Session persists in `profiles/chrome/`

### Background Running
To run in background after login:
```bash
# Using nohup
nohup npm run buyer username > scraper.log 2>&1 &

# Or using tmux
tmux new -s scraper
npm run buyer username
# Press Ctrl+B then D to detach
```

### Profile Persistence
- Chrome profile stored in `profiles/chrome/`
- Survives reboots and RDP disconnections
- Only need to login once

### Troubleshooting

**Browser not visible:**
```bash
# Check display
echo $DISPLAY

# If empty, export display
export DISPLAY=:0
```

**Chrome won't start:**
```bash
# Install missing dependencies
sudo apt install -y libxshmfence1 libgtk-3-0
```

**RDP connection issues:**
```bash
# Check xrdp status
sudo systemctl status xrdp

# Restart if needed
sudo systemctl restart xrdp
```

---

## Performance Tips

1. **Use tmux/screen** for persistent sessions
2. **Monitor resources**: `htop`
3. **Set appropriate delays** to avoid rate limiting
4. **Use VPN/proxy** if scraping many profiles
5. **Limit concurrent profiles** to 5-10 per batch

---

## Security

- Use SSH keys for SSH access
- Configure firewall rules
- Use strong passwords for RDP
- Consider VPN for additional security
- Don't share credentials or session data