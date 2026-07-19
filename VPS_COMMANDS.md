# Quick VPS Commands

## Linux (xRDP)

### Connect via RDP
```
Host: your-vps-ip
Port: 3389
User: your-username
Password: your-password
```

### Run Scraper
```bash
# Navigate to project
cd /path/to/fiverr-anaylysis

# Run buyer reviews
npm run buyer username1 username2

# Run seller reviews
npm run seller username1 username2

# Run in background
nohup npm run buyer username > scraper.log 2>&1 &

# Check logs
tail -f scraper.log

# Kill background process
pkill -f "npm run"
```

### Using tmux
```bash
# Start tmux session
tmux new -s scraper

# Run scraper
npm run buyer username

# Detach (Ctrl+B, then D)

# Reattach
tmux attach -t scraper

# List sessions
tmux ls
```

### Monitor
```bash
# Check running processes
ps aux | grep node

# Monitor resources
htop

# Check disk space
df -h

# Check memory
free -h
```

---

## Windows Server (RDS)

### Connect via RDP
```
Computer: your-vps-ip:3389
User: Administrator
Password: your-password
```

### Run Scraper
```powershell
# Navigate to project
cd C:\path\to\fiverr-anaylysis

# Run buyer reviews
npm run buyer username1 username2

# Run seller reviews
npm run seller username1 username2

# Run in background
Start-Process npm -ArgumentList "run,buyer,username" -NoNewWindow -RedirectStandardOutput "scraper.log" -RedirectStandardError "error.log"
```

### Using PowerShell Job
```powershell
# Start job
Start-Job -ScriptBlock {
    cd C:\path\to\fiverr-anaylysis
    npm run buyer username
} -Name Scraper

# Check job status
Get-Job

# Get job output
Receive-Job -Name Scraper

# Stop job
Stop-Job -Name Scraper
Remove-Job -Name Scraper
```

### Monitor
```powershell
# Check Node processes
Get-Process node

# Monitor resources
Get-Counter

# Check disk space
Get-PSDrive C

# Check memory
Get-WmiObject -Class Win32_OperatingSystem | Select-Object TotalVisibleMemorySize,FreePhysicalMemory
```

---

## Troubleshooting

### Linux
```bash
# Check xRDP status
sudo systemctl status xrdp

# Restart xRDP
sudo systemctl restart xrdp

# Check display
echo $DISPLAY
export DISPLAY=:0

# Kill stuck Chrome processes
pkill -9 chrome

# Clear Chrome profile if issues
rm -rf profiles/chrome/*
```

### Windows
```powershell
# Check RDS service
Get-Service TermService

# Restart RDS service
Restart-Service TermService

# Kill stuck Chrome processes
Stop-Process -Name chrome -Force

# Clear Chrome profile if issues
Remove-Item -Recurse -Force profiles\chrome\*
```

---

## Performance Optimization

### Linux
```bash
# Limit CPU usage
cpulimit -l 50 -p $(pgrep node)

# Monitor memory usage
watch -n 1 'ps aux | grep node'

# Set Chrome profile location
export CHROME_PROFILE_PATH="/path/to/profiles/chrome"
```

### Windows
```powershell
# Set Chrome profile location
$env:CHROME_PROFILE_PATH = "C:\path\to\profiles\chrome"

# Monitor performance
Get-Process chrome | Select-Object ProcessName, CPU, WorkingSet

# Set process priority
$process = Get-Process chrome
$process.PriorityClass = "BelowNormal"
```