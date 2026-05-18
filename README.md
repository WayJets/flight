# 🛩️ Private Flight Tracker - 24/7 ADS-B Monitor

Watch every flight in real-time on your vacuum-mounted tablet! This is a complete personal flight tracking system using ADS-B data.

## ✨ Features

- ✅ **Real-time Flight Tracking** - Updates every 2 seconds
- ✅ **Interactive Map** - See all aircraft positions live
- ✅ **24/7 Monitoring** - Computer stays awake automatically
- ✅ **Network Ready** - Access from any device on your network
- ✅ **Dark Theme** - Easy on the eyes for long viewing
- ✅ **Detailed Aircraft Info** - Altitude, speed, heading, vertical rate
- ✅ **Historical Data** - Track flight paths over time
- ✅ **Docker Containerized** - One-command setup

## 🚀 Quick Start (2 minutes)

### **Step 1: Configure**
```bash
# Copy the environment template
cp .env.example .env

# Edit .env with your ADS-B receiver details
nano .env
```

Example `.env`:
```
ADSB_HOST=192.168.1.100    # Your receiver's IP or hostname
ADSB_PORT=30002             # Default Mode-S port
MAP_LAT=40.7128             # Your latitude
MAP_LON=-74.0060            # Your longitude
```

### **Step 2: Launch**
```bash
# Make script executable
chmod +x launch.sh

# Run the launcher (keeps computer awake + starts tracker)
./launch.sh
```

### **Step 3: Open Your Dashboard**
```
🖥️  Local computer:  http://localhost:3000
📱 Vacuum tablet:    http://[your-computer-ip]:3000
```

## 🛰️ Setting Up Your ADS-B Receiver

### **Option A: Local USB Receiver (Cheapest ~$25)**
```bash
# Install dump1090
sudo apt-get install dump1090

# Start receiver on network
dump1090 --net --net-bind-address 0.0.0.0

# Your tracker config:
ADSB_HOST=localhost
ADSB_PORT=30002
```

### **Option B: Existing Network Receiver**
Just point to your receiver's IP/hostname in `.env`

### **Option C: Raspberry Pi with RTL-SDR**
```bash
# On Pi, start dump1090
dump1090 --net

# On your computer .env:
ADSB_HOST=192.168.1.50    # Your Pi's IP
ADSB_PORT=30002
```

## 📊 What You'll See

| Feature | Description |
|---------|------------|
| **Live Map** | Real-time aircraft positions with markers |
| **Aircraft List** | Sortable list of all active flights |
| **Flight Details** | ICAO, callsign, altitude, speed, heading, vertical rate |
| **Statistics** | Active aircraft count, total tracked, positions logged |
| **24/7 Display** | Perfect for wall-mounted or tablet display |

## 💻 Keeping Your Computer On

The launcher script automatically prevents sleep:

```bash
./launch.sh   # Prevents sleep + starts tracker
```

### Manual prevention (if not using launcher):
```bash
# Linux
gsettings set org.gnome.settings-daemon.plugins.power sleep-inactive-ac-timeout 0

# Mac
caffeinate -i &    # Press Ctrl+C to stop

# Windows
powercfg /change monitor-timeout-ac 0
powercfg /change disk-timeout-ac 0
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Stop everything
docker-compose down

# Stop and remove data
docker-compose down -v
```

## 🔗 API Endpoints

Access the data programmatically:

```bash
# Health check
curl http://localhost:5000/api/health

# All aircraft
curl http://localhost:5000/api/aircraft

# Specific aircraft
curl http://localhost:5000/api/aircraft/a1b2c3

# Statistics
curl http://localhost:5000/api/statistics

# System status
curl http://localhost:5000/api/status
```

## 🎯 Network Access

From other devices on your network:

1. **Find your computer's IP:**
   ```bash
   hostname -I    # Linux/Mac
   ipconfig       # Windows (look for IPv4 Address)
   ```

2. **Access on tablet:**
   ```
   http://192.168.1.100:3000    # Replace with your IP
   ```

## 📱 Vacuum Tablet Setup

1. Mount tablet on vacuum cleaner
2. Open browser to your computer's IP:3000
3. Bookmark for quick access
4. Set to full-screen mode
5. Enjoy 24/7 flight tracking while you clean! 🧹

## 🛠️ Troubleshooting

### Can't connect to receiver
```bash
# Test receiver connection
telnet 192.168.1.100 30002

# Or check with nc
nc -zv 192.168.1.100 30002
```

### Database errors
```bash
# Check PostgreSQL
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d
```

### Empty aircraft list
- Verify ADSB_HOST and ADSB_PORT in `.env`
- Ensure receiver is actually broadcasting
- Check with: `netstat -an | grep 30002`

## 📝 Requirements

- Docker & Docker Compose
- ADS-B receiver (USB stick ~$25 or existing network receiver)
- Your computer stays on 24/7 (use launcher script)
- Network access to receiver

## 🔐 Privacy

- Runs completely locally on your network
- No data sent to external services
- No tracking, analytics, or ads
- Complete control over your data

## 📄 License

MIT - Use freely!

---

**Happy Flight Tracking! ✈️**

Made with ❤️ for aviation enthusiasts
