# Test Service
```bash
curl http://localhost:4000/api/health
```


# Streming response
```bash
curl -s -N -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Show me all my todos",
    "threadId": "test-session"
}'
```