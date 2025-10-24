const API_BASE = 'http://localhost:5000';

async function testLoginWithTestAdmin() {
  console.log('🧪 Testing Login with Test Admin...');

  const loginData = {
    email: 'testadmin@univoice.com',
    password: 'test123'
  };

  try {
    console.log('🔐 Attempting login with:', loginData);
    console.log('📋 Full request URL:', `${API_BASE}/api/admin/login`);

    const response = await fetch(`${API_BASE}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    console.log('📋 Response status:', response.status);
    console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));

    const result = await response.json();
    console.log('📋 Response body:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('✅ Admin login successful!');
      console.log('📋 Token received:', result.token ? 'YES' : 'NO');
      console.log('📋 User data:', result.user ? 'YES' : 'NO');
      return result;
    } else {
      console.log('❌ Admin login failed:', result.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
    console.log('❌ Full error:', error);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting Login Test with Test Admin...\n');
  await testLoginWithTestAdmin();
  console.log('\n🏁 Test completed!');
}

runTests();
