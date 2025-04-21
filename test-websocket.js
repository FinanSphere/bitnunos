// WebSocket client test script
import WebSocket from 'ws';

// Connect to the WebSocket server
const ws = new WebSocket('ws://localhost:5000/ws');

// Connection opened
ws.on('open', function() {
  console.log('Connected to WebSocket server');
});

// Listen for messages
ws.on('message', function(data) {
  const message = JSON.parse(data.toString());
  console.log(`Received ${message.type} update with ${message.data ? message.data.length : 0} assets`);
  
  // Print first 3 assets if available
  if (message.data && message.data.length > 0) {
    console.log('Sample assets:');
    for (let i = 0; i < Math.min(3, message.data.length); i++) {
      const asset = message.data[i];
      console.log(`  ${asset.symbol}: $${asset.price} (${asset.change > 0 ? '+' : ''}${asset.change}%)`);
    }
  }
  
  // Close after receiving the first message
  console.log('Test completed successfully');
  ws.close();
});

// Connection closed
ws.on('close', function() {
  console.log('Connection closed');
  process.exit(0);
});

// Error handling
ws.on('error', function(error) {
  console.error('WebSocket error:', error);
  process.exit(1);
});

// Set a timeout to close the connection if no message is received
setTimeout(() => {
  console.error('Timeout: No message received within 5 seconds');
  ws.close();
  process.exit(1);
}, 5000);