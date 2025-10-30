# OpenTelemetry & Jaeger - Quick Start Guide

Get distributed tracing running in 5 minutes! 🚀

## Step 1: Start Jaeger (30 seconds)

```bash
docker-compose up -d
```

**Verify Jaeger is running:**
```bash
docker ps | grep jaeger
```

You should see:
```
madlen-jaeger   jaegertracing/all-in-one:latest   Up   0.0.0.0:16686->16686/tcp, ...
```

## Step 2: Start the Application (10 seconds)

```bash
npm run dev
```

**Look for these messages:**
```
🔍 OpenTelemetry tracing initialized
📊 Traces will be sent to Jaeger at http://localhost:4318/v1/traces
🌐 View traces at http://localhost:16686
🚀 Server is running on http://localhost:8000
```

## Step 3: Generate Traces (1 minute)

Open a new terminal and run these commands:

```bash
# Test 1: Health check
curl http://localhost:8000/health

# Test 2: Get models
curl http://localhost:8000/api/v1/models

# Test 3: Chat with AI (start conversation)
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello! What is AI?"}'

# Copy the sessionId from response, then:

# Test 4: Continue conversation (replace SESSION_ID)
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Can you explain more?",
    "sessionId": "YOUR_SESSION_ID_HERE"
  }'

# Test 5: Get history (replace SESSION_ID)
curl http://localhost:8000/api/v1/chat/history/YOUR_SESSION_ID_HERE
```

## Step 4: View Traces in Jaeger (2 minutes)

1. **Open Jaeger UI:**
   ```
   http://localhost:16686
   ```

2. **Select Service:**
   - Click the "Service" dropdown
   - Select **"madlen-case-study-api"**

3. **Find Traces:**
   - Click **"Find Traces"** button
   - You'll see a list of all your API requests!

4. **Explore a Trace:**
   - Click on any trace
   - See the timeline of operations
   - Expand spans to see details
   - Notice the HTTP call to OpenRouter!

## What You'll See

### Trace Example: Chat Request

```
📊 POST /api/v1/chat (2.3s total)
├── 🟢 Express Router (0.5ms)
├── 🟢 Chat Controller (2.29s)
│   ├── Extract sessionId (0.1ms)
│   ├── Call Chat Service (2.28s)
│   │   ├── Get Session History (1.2ms)
│   │   └── 🌐 HTTP POST to openrouter.ai (2.27s)
│   │       ├── DNS Lookup (12ms)
│   │       ├── TCP Connect (8ms)
│   │       ├── TLS Handshake (45ms)
│   │       └── Wait for Response (2.2s) ⏱️
│   └── Format Response (0.5ms)
└── 🟢 Send Response (1ms)
```

### Key Insights

From this trace, you can see:
- ✅ Most time is spent waiting for OpenRouter API
- ✅ Session lookup is very fast (good!)
- ✅ Local processing is minimal
- 💡 Potential optimization: Add caching for common questions

## Common Trace Patterns

### Fast Request (< 100ms)
```
GET /health (5ms)
└── Express Handler (5ms)
    └── Return JSON (1ms)
```

### Slow Request (> 3s)
```
POST /api/v1/chat (3.5s)
└── OpenRouter timeout or slow model
```

### Failed Request
```
POST /api/v1/chat (Error)
└── 🔴 Error: No endpoints found for model
    └── Check model ID is valid
```

## Useful Jaeger Searches

### Find Slow Requests
- Click "Tags" → Add tag
- Key: `http.status_code` Value: `200`
- Min Duration: `2s`
- Find Traces

### Find Errors
- Tags → `error` = `true`
- Or filter by status code: `http.status_code` = `500`

### Find Specific Endpoint
- Operation dropdown → Select `POST /api/v1/chat`
- Or select `GET /api/v1/models`

### Compare Models
1. Make requests with different models
2. Search traces by operation
3. Compare durations
4. Identify fastest model

## Tips & Tricks

### 1. Live Monitoring
Keep Jaeger UI open while testing - traces appear in real-time!

### 2. Trace Details
Click any span to see:
- Request headers
- Response status
- Timing breakdown
- Error details (if any)

### 3. Trace Timeline
Use the timeline view to:
- Identify sequential vs parallel operations
- Find bottlenecks visually
- Understand request flow

### 4. Export Data
Click "JSON" to export trace for sharing with team.

## Troubleshooting

### No Traces Appearing?

**Check 1: Is Jaeger running?**
```bash
docker ps | grep jaeger
```

**Check 2: Are you making requests?**
```bash
curl http://localhost:8000/health
```

**Check 3: Wait 10-30 seconds**
Traces are batched and exported periodically.

**Check 4: Check app logs**
Look for tracing initialization messages.

### "Service not found"?

Make sure you selected **"madlen-case-study-api"** from the Service dropdown.

### Docker Issues?

```bash
# Restart Docker Desktop, then:
docker-compose down
docker-compose up -d
```

## Stop Everything

```bash
# Stop the app
Ctrl+C in the terminal running npm run dev

# Stop Jaeger
docker-compose down

# Or stop and remove all data
docker-compose down -v
```

## Next Steps

1. ✅ **Read OBSERVABILITY_GUIDE.md** for detailed information
2. ✅ **Try different models** and compare performance
3. ✅ **Test error scenarios** (invalid model, timeout)
4. ✅ **Explore Jaeger features** (filtering, comparison)

## Summary

You now have:
- 🔍 **Full request tracing** - See every operation
- 📊 **Performance metrics** - Identify bottlenecks
- 🐛 **Error tracking** - Debug issues faster
- 📈 **Historical data** - Analyze trends

**Jaeger UI:** http://localhost:16686  
**API Docs:** http://localhost:8000/api-docs  

Happy tracing! 🎉

