# ESP32-S3 WS2812B LED Controller via Web Bluetooth

Control a WS2812B LED connected to your ESP32-S3 using Web Bluetooth from any browser!

## 🚀 Live Demo

Visit the web app: [WebApp](https://optifysudarshanpatil.github.io/esp32-s3-web-ble-ws2812b/)

## ✨ Features

- 🎨 Real-time color picker
- 📱 Works on desktop and mobile browsers
- 🔌 Wireless control via Bluetooth Low Energy (BLE)
- 🌐 No app installation required - runs in browser
- 💡 Controls WS2812B LED strip

## 🛠️ Hardware Requirements

- ESP32-S3 Development Board
- WS2812B LED (or NeoPixel)
- Connecting wires

### Wiring

- WS2812B Data Pin → ESP32-S3 GPIO 38
- WS2812B VCC → 5V
- WS2812B GND → GND

## 📦 Software Requirements

### For ESP32-S3:
- PlatformIO IDE
- Adafruit NeoPixel library (already in platformio.ini)

### For Web App:
- Modern browser with Web Bluetooth support:
  - Chrome (Desktop & Android)
  - Edge
  - Opera
- HTTPS connection (automatically provided by GitHub Pages)

## 🔧 Setup Instructions

### 1. Flash ESP32-S3

1. Open this project in PlatformIO
2. Connect your ESP32-S3 via USB
3. Upload the code: `platformio run --target upload`
4. Monitor serial output: `platformio device monitor`

### 2. Deploy Web App to GitHub Pages

1. Push this repository to GitHub
2. Go to repository Settings → Pages
3. Set Source to: `Deploy from a branch`
4. Select branch: `main` and folder: `/app`
5. Click Save
6. Your app will be available at: `https://[username].github.io/[repo-name]/`

### 3. Use the Web App

1. Open the deployed GitHub Pages URL in a supported browser
2. Click "Connect" button
3. Select "ESP32-S3 LED" from the Bluetooth device list
4. Choose a color using the color picker
5. Watch your LED change color in real-time!

## 🔐 Security Note

Web Bluetooth API requires HTTPS for security. GitHub Pages automatically provides HTTPS, making it perfect for hosting this app.

## 📝 How It Works

1. **ESP32-S3** advertises as a BLE peripheral with a custom service
2. **Web App** connects to the ESP32-S3 via Web Bluetooth API
3. **Color Selection** sends RGB values (3 bytes) to the BLE characteristic
4. **ESP32-S3** receives the RGB data and updates the WS2812B LED

## 🎯 BLE Service Details

- Service UUID: `4fafc201-1fb5-459e-8fcc-c5c9c331914b`
- Characteristic UUID: `beb5483e-36e1-4688-b7f5-ea07361b26a8`
- Data Format: 3 bytes (R, G, B) with values 0-255

## 🐛 Troubleshooting

**Cannot find Bluetooth device:**
- Ensure ESP32-S3 is powered on and code is running
- Check serial monitor for "BLE advertising started" message
- Ensure Bluetooth is enabled on your device
- Try refreshing the browser page

**Web Bluetooth not supported:**
- Use Chrome, Edge, or Opera browser
- Ensure you're accessing via HTTPS (http:// won't work)
- iOS Safari doesn't support Web Bluetooth (use Chrome on Android instead)

**LED not changing color:**
- Verify wiring connections
- Check LED is connected to GPIO 38
- Ensure LED has proper power supply (5V)
- Check serial monitor for received RGB values

## 📄 License

MIT License - Feel free to use and modify!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
