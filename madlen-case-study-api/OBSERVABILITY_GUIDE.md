# Observability with OpenTelemetry & Jaeger

This guide explains how to use distributed tracing to monitor and debug the Madlen Case Study API.

## Overview

The application is instrumented with **OpenTelemetry**, an open-source observability framework that provides:

- 🔍 **Distributed Tracing** - Track requests across services
- 📊 **Performance Monitoring** - Identify bottlenecks
- 🐛 **Debugging** - Understand request flow
- 📈 **Metrics** - Track application health

Traces are exported to **Jaeger**, a distributed tracing platform for visualization and analysis.

## Architecture

```
┌─────────────────┐
│   Client        │
│  (Browser/curl) │
└────────┬────────┘
         │ HTTP Request
         ▼
┌─────────────────────────┐
│  Express Server         │
│  + OpenTelemetry SDK    │
│  (Auto-instrumentation) │
└────────┬────────────────┘
         │ Traces
         ▼
┌─────────────────────────┐
│  Jaeger Collector       │
│  (Port 4318 - OTLP)     │
└────────┬────────────────┘
         │ Store
         ▼
┌─────────────────────────┐
│  Jaeger UI              │
│  (Port 16686)           │
└─────────────────────────┘
```

## Quick Start

### 1. Start Jaeger

```bash
docker-compose up -d
```

This starts Jaeger in the background. Verify it's running:
```bash
docker ps | grep jaeger
```

### 2. Start the Application

```bash
npm run dev
```

You'll see tracing initialization messages:
```
🔍 OpenTelemetry tracing initialized
📊 Traces will be sent to Jaeger at http://localhost:4318/v1/traces
🌐 View traces at http://localhost:16686
```

### 3. Generate Some Traffic

Make API requests to generate traces:

```bash
# Health check
curl http://localhost:8000/health

# Get models
curl http://localhost:8000/api/v1/models

# Send chat message
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}'
```

### 4. View Traces in Jaeger

Open your browser:
```
http://localhost:16686
```

1. Select **"madlen-case-study-api"** from the Service dropdown
2. Click **"Find Traces"**
3. Click on any trace to see detailed information

## What's Being Traced?

### Automatic Instrumentation

OpenTelemetry auto-instruments:

- ✅ **HTTP Requests** - All Express routes
- ✅ **HTTP Responses** - Status codes, timing
- ✅ **External HTTP Calls** - Axios requests to OpenRouter
- ✅ **DNS Lookups** - Network resolution
- ✅ **TCP Connections** - Socket operations

### Trace Details

Each trace includes:

- **Trace ID** - Unique identifier for the entire request
- **Span ID** - Identifier for each operation
- **Service Name** - `madlen-case-study-api`
- **Operation Name** - HTTP method + path (e.g., `POST /api/v1/chat`)
- **Duration** - How long the operation took
- **Status** - Success/Error
- **Attributes** - Request details (headers, body, etc.)

## Understanding Jaeger UI

### Main Screen

- **Service** - Select your service
- **Operation** - Filter by endpoint
- **Tags** - Filter by attributes (e.g., `http.status_code=200`)
- **Lookback** - Time range for traces

### Trace Detail View

When you click on a trace, you see:

1. **Trace Timeline** - Visual representation of spans
2. **Span List** - All operations in chronological order
3. **Span Details** - Attributes, events, logs
4. **Service Map** - (if multiple services)

### Example Trace Structure

```
POST /api/v1/chat (200ms total)
├── Express Route Handler (5ms)
├── Chat Controller (195ms)
│   ├── Validate Request (1ms)
│   ├── Generate Session ID (1ms)
│   ├── Call Chat Service (190ms)
│   │   ├── Get Session History (2ms)
│   │   └── HTTP POST to OpenRouter (185ms)
│   │       ├── DNS Lookup (10ms)
│   │       ├── TCP Connect (5ms)
│   │       ├── TLS Handshake (20ms)
│   │       ├── Send Request (5ms)
│   │       └── Receive Response (145ms)
│   └── Format Response (3ms)
```

## Common Use Cases

### 1. Performance Analysis

**Question:** Why is my chat endpoint slow?

**Steps:**
1. Go to Jaeger UI
2. Filter for `POST /api/v1/chat`
3. Sort by duration (longest first)
4. Click on a slow trace
5. Identify which span takes the most time

**Common Findings:**
- OpenRouter API response time
- Session history retrieval
- Database queries (if added)

### 2. Error Debugging

**Question:** Why are some requests failing?

**Steps:**
1. Filter traces by tags: `error=true`
2. Click on failed traces
3. Look at span events and logs
4. Check error attributes

**Example Error Attributes:**
```json
{
  "error": true,
  "error.type": "AxiosError",
  "error.message": "Request timeout",
  "http.status_code": 504
}
```

### 3. Request Flow Understanding

**Question:** What happens during a chat request?

**Steps:**
1. Find a successful chat trace
2. Expand all spans
3. Follow the execution path
4. Note timing at each step

### 4. Comparing Models

**Question:** Is Google Gemma faster than Llama?

**Steps:**
1. Make requests with different models
2. Filter traces by model (in attributes)
3. Compare durations
4. Analyze response times

## Advanced Configuration

### Custom Spans (Future Enhancement)

You can add custom spans to track specific operations:

```typescript
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('madlen-case-study-api');

async function someOperation() {
  const span = tracer.startSpan('custom-operation');
  
  try {
    // Your code here
    span.setAttribute('custom.attribute', 'value');
    return result;
  } catch (error) {
    span.recordException(error);
    throw error;
  } finally {
    span.end();
  }
}
```

### Environment Variables

Configure tracing behavior:

```env
# Enable/disable tracing
OTEL_SDK_DISABLED=false

# Set service name
OTEL_SERVICE_NAME=madlen-case-study-api

# Set trace sampling (0.0 to 1.0)
OTEL_TRACES_SAMPLER=parentbased_always_on
```

## Jaeger Ports Reference

| Port | Protocol | Purpose |
|------|----------|---------|
| 16686 | HTTP | Jaeger UI |
| 4318 | HTTP | OTLP Receiver (used by app) |
| 4317 | gRPC | OTLP Receiver (alternative) |

## Troubleshooting

### Traces Not Appearing

**Problem:** No traces in Jaeger UI

**Solutions:**
1. Check Jaeger is running: `docker ps`
2. Verify app shows tracing initialized
3. Make some API requests
4. Wait 10-30 seconds for export
5. Refresh Jaeger UI

### Connection Refused

**Problem:** `ECONNREFUSED localhost:4318`

**Solutions:**
1. Ensure Jaeger is running: `docker-compose up -d`
2. Check port is not blocked by firewall
3. Verify OTLP endpoint in `src/tracing.ts`

### Too Many Traces

**Problem:** Jaeger UI is overwhelming

**Solutions:**
1. Use filters (service, operation, tags)
2. Adjust time range
3. Enable sampling in production:
   ```typescript
   import { TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-base';
   
   const sdk = new NodeSDK({
     sampler: new TraceIdRatioBasedSampler(0.1), // 10% sampling
     // ... rest of config
   });
   ```

### Docker Issues

**Problem:** Docker compose fails

**Solutions:**
1. Ensure Docker Desktop is running
2. Check no other service uses ports 16686/4318
3. Try: `docker-compose down && docker-compose up -d`

## Production Considerations

### Sampling

In production, trace **every request** is expensive:

```typescript
// Sample 10% of requests
const sdk = new NodeSDK({
  sampler: new TraceIdRatioBasedSampler(0.1),
  // ...
});
```

### Security

- Don't log sensitive data in spans
- Sanitize request/response bodies
- Use authentication for Jaeger UI

### Storage

- Jaeger stores traces in memory by default
- For production, use Elasticsearch, Cassandra, or Kafka
- Configure retention policies

### Distributed Systems

If you add more services (frontend, database, cache):
- Use the same Jaeger instance
- Ensure trace context propagation
- All services should use OpenTelemetry

## Commands Reference

```bash
# Start Jaeger
docker-compose up -d

# View Jaeger logs
docker-compose logs -f jaeger

# Stop Jaeger
docker-compose down

# Restart Jaeger (clear data)
docker-compose restart jaeger

# Remove Jaeger (delete data)
docker-compose down -v

# Check Jaeger health
curl http://localhost:16686/
```

## Useful Jaeger Features

### 1. Compare Traces

Select multiple traces and compare side-by-side to identify differences.

### 2. Service Dependencies

View the "System Architecture" tab to see service dependencies.

### 3. Search by Tags

Search for specific traces:
```
http.status_code=500
http.method=POST
error=true
```

### 4. Trace JSON Export

Click "JSON" button to export trace data for analysis.

### 5. Share Traces

Copy trace URL to share with team members.

## Resources

- **OpenTelemetry Docs:** https://opentelemetry.io/docs/
- **Jaeger Docs:** https://www.jaegertracing.io/docs/
- **OTLP Specification:** https://opentelemetry.io/docs/specs/otlp/

## Summary

✅ **Installed** - OpenTelemetry SDK and auto-instrumentations  
✅ **Configured** - Trace export to Jaeger via OTLP  
✅ **Running** - Jaeger in Docker container  
✅ **Instrumented** - All HTTP requests and external calls  
✅ **Visualized** - Traces viewable in Jaeger UI  

You now have full observability into your application! 🎉

