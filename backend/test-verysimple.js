const API_BASE = 'http://localhost:5000';

async function testVerySimpleRegistration() {
  console.log('🧪 Testing Very Simple Admin Registration...');

  const verySimpleAdmin = {
    name: 'Very Simple',
    email: 'verysimple@univoice.com',
    password: 'test123',
    department: 'CSE',
    employeeId: 'VERY001',
    role: 'admin',
    specializations: ['general'],
    branches: ['CSE'],
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    maxCaseLoad: 50
  };

  try {
    console.log('Sending request to:', `${API_BASE}/api/admin/register`);
    console.log('Request body:', JSON.stringify(verySimpleAdmin, null, 2));

    const response = await fetch(`${API_BASE}/api/admin/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verySimpleAdmin)
    });

    console.log('Response status:', response.status);
    const result = await response.json();
    console.log('Response body:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('✅ Very simple admin registration successful!');
      return result;
    } else {
      console.log('❌ Very simple admin registration failed:', result.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting Very Simple Admin Registration Test...\n');
  await testVerySimpleRegistration();
  console.log('\n🏁 Test completed!');
}

runTests();
