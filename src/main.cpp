#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <Adafruit_NeoPixel.h>

// WS2812B LED Configuration
#define LED_PIN 38
#define NUM_LEDS 1
Adafruit_NeoPixel strip(NUM_LEDS, LED_PIN, NEO_GRB + NEO_KHZ800);

// BLE UUIDs
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

BLECharacteristic *pCharacteristic;

// Callback for BLE characteristic writes
class MyCallbacks: public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) {
    String strValue = pCharacteristic->getValue();
    
    if (strValue.length() >= 3) {
      uint8_t r = (uint8_t)strValue[0];
      uint8_t g = (uint8_t)strValue[1];
      uint8_t b = (uint8_t)strValue[2];
      
      Serial.printf("Received RGB: %d, %d, %d\n", r, g, b);
      
      // Update LED color
      strip.setPixelColor(0, strip.Color(r, g, b));
      strip.show();
    }
  }
};

void setup() {
  Serial.begin(115200);
  Serial.println("Starting BLE WS2812B Controller!");

  // Initialize LED strip
  strip.begin();
  strip.setBrightness(50); // Set brightness to 50 (0-255)
  strip.setPixelColor(0, strip.Color(0, 0, 0)); // Start with LED off
  strip.show();

  // Initialize BLE
  BLEDevice::init("ESP32-S3 LED");
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);
  
  pCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE
  );

  pCharacteristic->setCallbacks(new MyCallbacks());
  pCharacteristic->setValue("RGB");
  
  pService->start();
  
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMinPreferred(0x12);
  
  BLEDevice::startAdvertising();
  Serial.println("BLE advertising started. Ready to receive color data!");
}

void loop() {
  delay(2000);
}
