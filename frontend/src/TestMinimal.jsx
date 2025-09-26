import React from 'react';

// Test 1: Can we import AuthContext?
try {
  console.log('🔍 Testing import...');
  const AuthContextModule = await import('./context/AuthContext.jsx');
  console.log('✅ AuthContext imported successfully:', AuthContextModule);
} catch (error) {
  console.error('❌ AuthContext import failed:', error);
}

function TestMinimal() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
      <h1>🧪 Minimal Auth Test</h1>
      <p>Check the browser console for import test results.</p>
      <p>If you see this, React is working.</p>
    </div>
  );
}

export default TestMinimal;
