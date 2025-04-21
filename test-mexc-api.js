/**
 * MEXC API Test Script
 * This script tests the MEXC API integration with our application.
 * It checks if credentials are configured correctly and performs
 * sample API calls to retrieve market data.
 */

import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
dotenv.config();

// Verify MEXC API credentials
const hasMexcCredentials = () => {
  return !!(process.env.MEXC_API_KEY && process.env.MEXC_API_SECRET);
};

// Test ticker prices endpoint
async function testTickerPrices() {
  try {
    console.log('\n--- Testing MEXC Ticker Prices ---');
    const response = await fetch('http://localhost:5000/api/mexc/tickers?symbol=BTCUSDT');
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('BTCUSDT Price:', data);
    console.log('Test successful ✓');
    return true;
  } catch (error) {
    console.error('Test failed ✗ -', error.message);
    return false;
  }
}

// Test 24h ticker endpoint
async function test24hTicker() {
  try {
    console.log('\n--- Testing MEXC 24h Ticker ---');
    const response = await fetch('http://localhost:5000/api/mexc/ticker24hr?symbol=BTCUSDT');
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('BTCUSDT 24h Data:');
    console.log('  Price:', data.lastPrice);
    console.log('  24h Change:', data.priceChangePercent + '%');
    console.log('  24h High:', data.highPrice);
    console.log('  24h Low:', data.lowPrice);
    console.log('  24h Volume:', data.volume);
    console.log('Test successful ✓');
    return true;
  } catch (error) {
    console.error('Test failed ✗ -', error.message);
    return false;
  }
}

// Test order book endpoint
async function testOrderBook() {
  try {
    console.log('\n--- Testing MEXC Order Book ---');
    const response = await fetch('http://localhost:5000/api/mexc/depth?symbol=BTCUSDT&limit=5');
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('BTCUSDT Order Book:');
    console.log('  Top 5 Asks:', data.asks.slice(0, 5));
    console.log('  Top 5 Bids:', data.bids.slice(0, 5));
    console.log('Test successful ✓');
    return true;
  } catch (error) {
    console.error('Test failed ✗ -', error.message);
    return false;
  }
}

// Test klines endpoint
async function testKlines() {
  try {
    console.log('\n--- Testing MEXC Klines ---');
    const response = await fetch('http://localhost:5000/api/mexc/klines?symbol=BTCUSDT&interval=1d&limit=5');
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('BTCUSDT Daily Klines (Last 5 days):');
    data.forEach((kline, i) => {
      const date = new Date(kline.openTime).toLocaleDateString();
      console.log(`  ${date}: Open ${kline.open}, Close ${kline.close}, High ${kline.high}, Low ${kline.low}`);
    });
    console.log('Test successful ✓');
    return true;
  } catch (error) {
    console.error('Test failed ✗ -', error.message);
    return false;
  }
}

// Test recent trades endpoint
async function testRecentTrades() {
  try {
    console.log('\n--- Testing MEXC Recent Trades ---');
    const response = await fetch('http://localhost:5000/api/mexc/trades?symbol=BTCUSDT&limit=5');
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('BTCUSDT Recent Trades (Last 5):');
    data.forEach((trade, i) => {
      const date = new Date(trade.time).toLocaleTimeString();
      console.log(`  ${date}: Price ${trade.price}, Size ${trade.qty}, Direction ${trade.isBuyerMaker ? 'SELL' : 'BUY'}`);
    });
    console.log('Test successful ✓');
    return true;
  } catch (error) {
    console.error('Test failed ✗ -', error.message);
    return false;
  }
}

// Test search endpoint
async function testSearch() {
  try {
    console.log('\n--- Testing MEXC Search ---');
    const response = await fetch('http://localhost:5000/api/mexc/search?q=BTC');
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Search Results for "BTC" (First 5):');
    data.slice(0, 5).forEach((result, i) => {
      console.log(`  ${i+1}. ${result.symbol}: ${result.price}`);
    });
    console.log('Test successful ✓');
    return true;
  } catch (error) {
    console.error('Test failed ✗ -', error.message);
    return false;
  }
}

// Test token details endpoint
async function testTokenDetails() {
  try {
    console.log('\n--- Testing MEXC Token Details ---');
    const response = await fetch('http://localhost:5000/api/mexc/token/BTCUSDT');
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('BTCUSDT Token Details:');
    console.log('  Price:', data.ticker.lastPrice);
    console.log('  24h Change:', data.ticker.priceChangePercent + '%');
    console.log('  Order Book Depth:', data.orderBook.asks.length + data.orderBook.bids.length);
    console.log('  Recent Trades:', data.recentTrades.length);
    console.log('Test successful ✓');
    return true;
  } catch (error) {
    console.error('Test failed ✗ -', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('=== MEXC API Integration Tests ===');
  
  // Check if credentials are configured
  if (!hasMexcCredentials()) {
    console.error('MEXC API credentials are not set. Tests cannot proceed.');
    console.log('Make sure MEXC_API_KEY and MEXC_API_SECRET are set in your environment.');
    process.exit(1);
  }
  
  console.log('MEXC API credentials found ✓');
  
  // Run all tests
  let testResults = {
    tickerPrices: await testTickerPrices(),
    ticker24h: await test24hTicker(),
    orderBook: await testOrderBook(),
    klines: await testKlines(),
    recentTrades: await testRecentTrades(),
    search: await testSearch(),
    tokenDetails: await testTokenDetails()
  };
  
  // Summary
  console.log('\n=== Test Summary ===');
  let allPassed = true;
  for (const [test, result] of Object.entries(testResults)) {
    console.log(`${test}: ${result ? '✓ Passed' : '✗ Failed'}`);
    if (!result) allPassed = false;
  }
  
  console.log('\nOverall Result:', allPassed ? '✓ All tests passed' : '✗ Some tests failed');
}

// Execute all tests
runAllTests().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});