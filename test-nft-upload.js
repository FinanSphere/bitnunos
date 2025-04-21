// Test script for NFT uploads to IPFS
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testNftUpload() {
  try {
    console.log('Testing NFT Upload to IPFS...');
    
    // Login first to get authentication
    const loginResponse = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'password123',
      }),
    });
    
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.statusText}`);
    }
    
    const loginData = await loginResponse.json();
    console.log('Logged in successfully, token:', loginData.token);
    
    // Create a test NFT collection
    const collectionResponse = await fetch('http://localhost:3000/api/nft/collections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`,
      },
      body: JSON.stringify({
        name: 'Test Collection',
        symbol: 'TEST',
        description: 'A test collection',
        network: 'ethereum',
        isTestnet: true,
      }),
    });
    
    if (!collectionResponse.ok) {
      throw new Error(`Failed to create collection: ${collectionResponse.statusText}`);
    }
    
    const collectionData = await collectionResponse.json();
    console.log('Created collection:', collectionData);
    
    // Create a test NFT item with a base64 image
    // Read a sample image file and convert to base64
    const imagePath = path.join(__dirname, 'sample-nft.png');
    let imageBase64;
    
    try {
      const imageBuffer = fs.readFileSync(imagePath);
      imageBase64 = `data:image/png;base64,${imageBuffer.toString('base64')}`;
    } catch (error) {
      console.log('No sample image found, using a placeholder');
      // A tiny 1x1 pixel transparent PNG image
      imageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    }
    
    const nftData = {
      metadata: JSON.stringify({
        name: 'Test NFT',
        description: 'This is a test NFT',
        collectionId: collectionData.id,
        attributes: [
          { trait_type: 'Rarity', value: 'Common' },
          { trait_type: 'Type', value: 'Test' },
        ],
      }),
      image: imageBase64,
    };
    
    const nftResponse = await fetch('http://localhost:3000/api/nft/item/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`,
      },
      body: JSON.stringify(nftData),
    });
    
    if (!nftResponse.ok) {
      throw new Error(`Failed to upload NFT: ${nftResponse.statusText}`);
    }
    
    const nftResponseData = await nftResponse.json();
    console.log('Uploaded NFT:', nftResponseData);
    console.log('IPFS URL:', nftResponseData.ipfs.image.url);
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testNftUpload();