# Deriv API Connection Setup Guide

## Overview
This application connects to the Deriv API to display real-time trading data and charts. This guide will help you set up and troubleshoot the API connection.

## Getting Your API Token

1. **Visit Deriv API Token Page**
   - Go to [https://app.deriv.com/account/api-token](https://app.deriv.com/account/api-token)
   - Log in to your Deriv account

2. **Create a New Token**
   - Click "Create new token"
   - Give it a descriptive name (e.g., "Trading Dashboard")
   - Select scopes:
     - ✅ **Read** (required for market data)
     - ✅ **Trade** (optional, for trading features)
     - ❌ **Payments** (not recommended for security)
     - ❌ **Admin** (not recommended for security)

3. **Copy Your Token**
   - Copy the generated token immediately
   - Store it securely (you won't be able to see it again)

## Setting Up the Connection

### In Settings Page
1. Navigate to **Settings** → **API Connection** tab
2. Paste your API token in the "API Token" field
3. Click "Connect" button
4. Wait for the connection status to show "Connected"

### In Chart Dashboard
1. The Deriv chart is available in the Settings page for testing
2. Enter your API token in the "Deriv API Token" field
3. Click "Test Token" to verify the connection

## Connection Status Indicators

- 🟢 **Connected**: Successfully connected and authenticated
- 🔵 **Connecting**: Attempting to establish connection
- 🟡 **Disconnected**: Not connected (normal initial state)
- 🔴 **Error**: Connection failed (see troubleshooting below)

## Troubleshooting Common Issues

### 1. "API Token Required" Error
**Problem**: No token provided or empty token
**Solution**: Enter a valid Deriv API token

### 2. "Invalid Token Format" Error
**Problem**: Token is too short or contains invalid characters
**Solution**: 
- Ensure you copied the complete token
- Deriv tokens are typically 15+ characters long
- Should contain only letters and numbers

### 3. "Authorization Failed" Error
**Problem**: Token is invalid or expired
**Solutions**:
- Generate a new token from Deriv
- Check if the token has the correct scopes
- Ensure your Deriv account is active

### 4. "Connection Timeout" Error
**Problem**: Cannot reach Deriv servers
**Solutions**:
- Check your internet connection
- Try the "Test Connection" button
- Disable VPN if using one
- Check firewall settings

### 5. "WebSocket Connection Failed" Error
**Problem**: Browser or network blocking WebSocket connections
**Solutions**:
- Try a different browser
- Disable browser extensions
- Check corporate firewall settings
- Try from a different network

## Advanced Troubleshooting

### Network Connectivity Test
1. Go to Settings → API Connection
2. Click "Test Connection" button
3. This tests connectivity to multiple Deriv endpoints

### Browser Console Debugging
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for error messages starting with:
   - `❌ WebSocket error:`
   - `❌ API Error:`
   - `🔌 Connection failed:`

### Multiple Endpoint Fallback
The application automatically tries multiple Deriv endpoints:
- `wss://ws.derivws.com/websockets/v3`
- `wss://ws.binaryws.com/websockets/v3`
- `wss://frontend.derivws.com/websockets/v3`

## Security Best Practices

1. **Token Scope**: Only enable necessary scopes (Read for charts, Trade if needed)
2. **Token Storage**: Tokens are stored locally in your browser only
3. **Token Sharing**: Never share your API token with others
4. **Token Rotation**: Regularly generate new tokens and delete old ones

## API Rate Limits

- Deriv API has rate limits to prevent abuse
- If you see "Rate limit exceeded" errors, wait a few minutes
- Avoid making too many rapid connection attempts

## Support

If you continue to experience issues:

1. **Check Deriv Status**: Visit [status.deriv.com](https://status.deriv.com)
2. **Deriv Support**: Contact Deriv support for account-related issues
3. **Application Issues**: Check the browser console for detailed error messages

## Technical Details

- **Protocol**: WebSocket over TLS (WSS)
- **API Version**: Deriv WebSocket API v3
- **App ID**: 1089 (registered for this application)
- **Endpoints**: Multiple fallback endpoints for reliability
- **Timeout**: 10-15 seconds connection timeout
- **Retry Logic**: Automatic retry with alternative endpoints

## Changelog

### Recent Improvements
- ✅ Enhanced token validation
- ✅ Multiple endpoint fallback
- ✅ Better error messages
- ✅ Improved connection retry logic
- ✅ Network connectivity testing
- ✅ Removed hardcoded demo token
