import fetch from 'node-fetch';

async function testLogin() {
  try {
    // Test login with our admin credentials
    console.log('Testing login with admin credentials...');
    const loginRes = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'password123',
      }),
    });

    // Get the response text first to see what's being returned
    const responseText = await loginRes.text();
    console.log('Login Response Status:', loginRes.status);
    console.log('Login Response Text:', responseText);
    
    let loginData;
    try {
      loginData = JSON.parse(responseText);
      console.log('Login Data (parsed):', loginData);
    } catch (e) {
      console.log('Could not parse JSON response:', e.message);
    }

    if (loginRes.ok && loginData.token) {
      // Test /api/me endpoint with the token
      console.log('\nTesting /api/me with token...');
      const meRes = await fetch('http://localhost:5000/api/me', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
        },
      });

      const userData = await meRes.json();
      console.log('User Data Response:', meRes.status);
      console.log('User Data:', userData);
    }
  } catch (error) {
    console.error('Test Error:', error);
  }
}

testLogin();