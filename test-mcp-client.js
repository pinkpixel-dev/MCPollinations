#!/usr/bin/env node

/**
 * Basic MCP client test for MCPollinations
 */

import { spawn } from 'child_process';

async function testMcpClient() {
  console.log('🧪 Testing MCP Client Connection');
  console.log('='.repeat(40));

  return new Promise((resolve, reject) => {
    const mcpProcess = spawn('node', ['pollinations-mcp-server.js'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    mcpProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    mcpProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    // Send initialize request
    const initializeRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-06-18',
        capabilities: {},
        clientInfo: {
          name: 'test-client',
          version: '1.0.0'
        }
      }
    };

    // Send the request
    mcpProcess.stdin.write(JSON.stringify(initializeRequest) + '\n');

    // Wait for response
    setTimeout(() => {
      mcpProcess.kill();
      
      console.log('📊 Test Results:');
      console.log('Error output:', errorOutput);
      
      if (errorOutput.includes('Running on Node.js version')) {
        console.log('✅ Server started successfully');
        console.log('✅ Node.js compatibility check passed');
        resolve();
      } else {
        console.log('❌ Server startup failed');
        console.log('Output:', output);
        reject(new Error('Server did not start properly'));
      }
    }, 3000);
  });
}

testMcpClient().catch(console.error);