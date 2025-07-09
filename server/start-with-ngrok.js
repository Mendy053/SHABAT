const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const ngrok = require('ngrok');

const PORT = process.env.PORT || 3001;
const ENV_FILE = path.join(__dirname, '.env');

async function startServerWithNgrok() {
  console.log('🕯️  SHABAT - מערכת תכנון ארוחות שבת');
  console.log('🚀 Starting SHABAT Server with ngrok...');
  console.log('📱 The app will be accessible from anywhere on the internet!');
  console.log('');
  
  // Start the server
  const server = spawn('node', ['server.js'], {
    stdio: 'inherit',
    cwd: __dirname
  });

  // Wait a bit for server to start
  console.log('⏳ Waiting for server to start...');
  await new Promise(resolve => setTimeout(resolve, 3000));

  try {
    // Start ngrok
    console.log('🌐 Starting ngrok tunnel...');
    const url = await ngrok.connect({
      addr: PORT,
      authtoken: process.env.NGROK_AUTH_TOKEN // Optional: if you have ngrok auth token
    });

    console.log('');
    console.log('🎉 SUCCESS! Your SHABAT app is now live!');
    console.log('='.repeat(50));
    console.log(`🌐 Public URL: ${url}`);
    console.log(`📱 Mobile access: ${url}`);
    console.log(`💻 Local access: http://localhost:3000`);
    console.log('='.repeat(50));
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. Open a new terminal');
    console.log('   2. Run: cd client && npm start');
    console.log('   3. The client will automatically detect ngrok URL');
    console.log('   4. Share the ngrok URL with family members!');
    console.log('');

    // Update .env file with ngrok URL
    updateEnvFile(url);

    // Handle ngrok events
    ngrok.onConnect((url) => {
      console.log(`🔄 ngrok tunnel reconnected: ${url}`);
      updateEnvFile(url);
    });

    ngrok.onDisconnect(() => {
      console.log('❌ ngrok tunnel disconnected');
    });

    ngrok.onError((err) => {
      console.error('❌ ngrok error:', err);
    });

  } catch (error) {
    console.error('❌ Failed to start ngrok:', error.message);
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('   1. Make sure you have internet connection');
    console.log('   2. Try running: npm install -g ngrok');
    console.log('   3. Or use the local version: npm run dev');
    console.log('');
  }

  // Handle server process
  server.on('close', (code) => {
    console.log(`🛑 Server process exited with code ${code}`);
    process.exit(code);
  });

  // Handle process termination
  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down SHABAT...');
    try {
      await ngrok.kill();
      console.log('✅ ngrok tunnel closed');
    } catch (error) {
      console.log('❌ Error closing ngrok:', error.message);
    }
    server.kill('SIGINT');
  });

  process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down SHABAT...');
    try {
      await ngrok.kill();
      console.log('✅ ngrok tunnel closed');
    } catch (error) {
      console.log('❌ Error closing ngrok:', error.message);
    }
    server.kill('SIGTERM');
  });
}

function updateEnvFile(ngrokUrl) {
  try {
    let envContent = '';
    
    // Read existing .env file if it exists
    if (fs.existsSync(ENV_FILE)) {
      envContent = fs.readFileSync(ENV_FILE, 'utf8');
    }

    // Update or add NGROK_URL
    const ngrokUrlLine = `NGROK_URL=${ngrokUrl}`;
    
    if (envContent.includes('NGROK_URL=')) {
      // Replace existing NGROK_URL
      envContent = envContent.replace(/NGROK_URL=.*/g, ngrokUrlLine);
    } else {
      // Add new NGROK_URL
      envContent += (envContent.endsWith('\n') ? '' : '\n') + ngrokUrlLine + '\n';
    }

    // Write back to .env file
    fs.writeFileSync(ENV_FILE, envContent);
    console.log(`📝 Updated .env file with ngrok URL`);
    
  } catch (error) {
    console.error('❌ Error updating .env file:', error.message);
  }
}

// Start the application
startServerWithNgrok().catch(console.error); 