// Test script for API keys
import Anthropic from '@anthropic-ai/sdk';
import { OpenAI } from 'openai';
import 'dotenv/config';

async function testAnthropicKey() {
  try {
    console.log("Testing Anthropic API key...");
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 100,
      messages: [
        { role: "user", content: "Hello, please respond with a short greeting." }
      ],
    });
    
    console.log("Anthropic API key is valid!");
    console.log("Sample response:", response.content[0].text);
    return true;
  } catch (error) {
    console.error("Anthropic API key test failed:");
    console.error(error.message);
    return false;
  }
}

async function testOpenAIKey() {
  try {
    console.log("Testing OpenAI API key...");
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "user", content: "Hello, please respond with a short greeting." }
      ],
      max_tokens: 100
    });
    
    console.log("OpenAI API key is valid!");
    console.log("Sample response:", response.choices[0].message.content);
    return true;
  } catch (error) {
    console.error("OpenAI API key test failed:");
    console.error(error.message);
    return false;
  }
}

async function runTests() {
  console.log("API Key Validation Test");
  console.log("======================");
  
  const anthroResult = await testAnthropicKey();
  console.log("\n"); // spacing
  
  const openaiResult = await testOpenAIKey();
  console.log("\n"); // spacing
  
  console.log("Test Results:");
  console.log(`Anthropic API: ${anthroResult ? 'PASSED ✓' : 'FAILED ✗'}`);
  console.log(`OpenAI API: ${openaiResult ? 'PASSED ✓' : 'FAILED ✗'}`);
}

runTests().catch(console.error);