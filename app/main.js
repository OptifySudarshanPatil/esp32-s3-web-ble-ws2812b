const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

let bleDevice = null;
let bleCharacteristic = null;

// DOM Elements
const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const statusDiv = document.getElementById('status');
const colorPicker = document.getElementById('colorPicker');
const colorDisplay = document.getElementById('colorDisplay');
const rgbValue = document.getElementById('rgbValue');

// Connect to BLE device
async function connectBLE() {
    try {
        statusDiv.textContent = 'Scanning for BLE devices...';
        statusDiv.className = 'status';
        
        bleDevice = await navigator.bluetooth.requestDevice({
            filters: [{ services: [SERVICE_UUID] }]
        });
        
        statusDiv.textContent = 'Connecting...';
        
        const server = await bleDevice.gatt.connect();
        const service = await server.getPrimaryService(SERVICE_UUID);
        bleCharacteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);
        
        bleDevice.addEventListener('gattserverdisconnected', onDisconnected);
        
        statusDiv.textContent = `Connected to ${bleDevice.name}`;
        statusDiv.className = 'status connected';
        connectBtn.disabled = true;
        disconnectBtn.disabled = false;
        colorPicker.disabled = false;
        
    } catch (error) {
        statusDiv.textContent = `Error: ${error.message}`;
        statusDiv.className = 'status error';
        console.error('Connection error:', error);
    }
}

// Disconnect from BLE device
function disconnectBLE() {
    if (bleDevice && bleDevice.gatt.connected) {
        bleDevice.gatt.disconnect();
    }
}

// Handle disconnection
function onDisconnected() {
    statusDiv.textContent = 'Disconnected';
    statusDiv.className = 'status';
    connectBtn.disabled = false;
    disconnectBtn.disabled = true;
    colorPicker.disabled = true;
    bleCharacteristic = null;
}

// Send color to ESP32
async function sendColor(hexColor) {
    if (!bleCharacteristic) return;
    
    // Convert hex to RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    
    try {
        const data = new Uint8Array([r, g, b]);
        await bleCharacteristic.writeValue(data);
        
        colorDisplay.style.backgroundColor = hexColor;
        rgbValue.textContent = `RGB(${r}, ${g}, ${b})`;
        
        console.log(`Sent color: RGB(${r}, ${g}, ${b})`);
    } catch (error) {
        console.error('Error sending color:', error);
        statusDiv.textContent = `Error sending color: ${error.message}`;
        statusDiv.className = 'status error';
    }
}

// Event Listeners
connectBtn.addEventListener('click', connectBLE);
disconnectBtn.addEventListener('click', disconnectBLE);
colorPicker.addEventListener('input', (e) => sendColor(e.target.value));

// Check Web Bluetooth support
if (!navigator.bluetooth) {
    statusDiv.textContent = 'Web Bluetooth is not supported in this browser';
    statusDiv.className = 'status error';
    connectBtn.disabled = true;
}
