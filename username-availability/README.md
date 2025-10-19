# Username Availability System Design

_Building a scalable system to check if a username is already taken_

## Problem Statement

Design a system that can efficiently determine if a username is already taken when billions of users exist. The system should:

- Handle high read/write throughput
- Minimize false positives/negatives
- Scale horizontally
- Provide low latency responses
- Support username suggestions

## System Requirements

### Functional Requirements

- ✅ Check if username exists
- ✅ Register new username
- ✅ Suggest alternative usernames
- ✅ Handle case-insensitive lookups
- ✅ Support username validation rules

### Non-Functional Requirements

- **Scale**: Handle billions of usernames
- **Latency**: < 100ms response time
- **Throughput**: 100K+ requests per second
- **Availability**: 99.9% uptime
- **Consistency**: Eventually consistent is acceptable

## Data Storage Solutions Comparison

### 1. Redis HashMap

**Use Case**: Primary storage for exact lookups

**Pros:**

- ⚡ In-memory performance (sub-millisecond lookup)
- 🔄 Simple key-value operations
- 📈 Excellent for high-frequency reads
- 🛠️ Built-in expiration and clustering

**Cons:**

- 💰 Expensive for billions of records
- ❌ Limited username suggestion capabilities
- 🔧 Requires careful memory management

**Time Complexity**: O(1)

### 2. Trie (Prefix Trees)

**Use Case**: Username suggestions and autocomplete

**Pros:**

- 🔍 Excellent for prefix-based searches
- ⚡ Fast autocomplete functionality
- 📝 Natural username suggestion generation
- 🎯 Efficient prefix matching

**Cons:**

- 💾 High memory consumption without compression
- 🔧 Complex implementation for distributed systems
- 📊 Memory usage scales with alphabet size

**Time Complexity**: O(m) where m = string length

### 3. B+ Trees

**Use Case**: Persistent storage in relational databases

**Pros:**

- 🔒 ACID compliance and strong consistency
- 📊 Efficient range queries
- 💾 Disk-optimized storage
- ❌ Zero false positives

**Cons:**

- 🐌 Slower than in-memory solutions
- 📈 Challenging to scale horizontally
- 🔧 Complex sharding for billions of records

**Time Complexity**: O(log n)

### 4. Bloom Filters

**Use Case**: Pre-filtering to reduce database lookups

**Pros:**

- 🚀 Extremely space-efficient
- ⚡ Constant time operations O(1)
- ❌ **Never gives false negatives**
- ✅ **May give false positives**
- 💾 Minimal memory footprint

**Cons:**

- 🎯 Cannot eliminate false positives
- ❌ Cannot delete elements (use Counting Bloom Filters)
- 🔧 Requires careful tuning of hash functions

**Time Complexity**: O(k) where k = number of hash functions

## Recommended Architecture

### Hybrid Approach: Bloom Filter + Redis + Database

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│   Client    │───▶│ Bloom Filter │───▶│    Redis    │───▶│   Database   │
│  Request    │    │   (Fast No)  │    │  (Fast Yes) │    │ (Persistent) │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
```

### System Flow

#### Username Check Flow:

1. **Bloom Filter Check**: If username doesn't exist → return "available" immediately
2. **Redis Cache Check**: If exists in cache → return "taken"
3. **Database Lookup**: Final verification and cache population
4. **Response**: Return availability status

#### Username Registration Flow:

1. **Database Insert**: Add username to persistent storage
2. **Cache Update**: Add to Redis cache
3. **Bloom Filter Update**: Add to Bloom filter
4. **Confirmation**: Return success status

## Implementation Details

### Bloom Filter Configuration

```python
# For 1 billion usernames with 1% false positive rate
expected_items = 1_000_000_000
false_positive_rate = 0.01
optimal_m = -n * ln(p) / (ln(2))^2  # ~9.6 billion bits
optimal_k = (m/n) * ln(2)           # ~7 hash functions
memory_required = ~1.2 GB
```

### Redis Sharding Strategy

```
Shard Key: hash(username) % number_of_shards
Replication: Master-Slave setup for high availability
Memory: Distributed across multiple Redis clusters
```

### Database Schema

```sql
CREATE TABLE usernames (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username)
);
```

## Performance Metrics

| Operation      | Bloom Filter | Redis      | Database    |
| -------------- | ------------ | ---------- | ----------- |
| Lookup Time    | ~1μs         | ~1ms       | ~10ms       |
| Memory/Item    | ~1.2 bytes   | ~100 bytes | ~200 bytes  |
| False Positive | ~1%          | 0%         | 0%          |
| Scalability    | Excellent    | Good       | Challenging |

## Monitoring & Metrics

### Key Performance Indicators

- ⏱️ **Average Response Time**: < 100ms
- 📊 **Cache Hit Ratio**: > 95%
- 🎯 **Bloom Filter Accuracy**: 99%+ true negatives
- 🔄 **System Throughput**: 100K+ RPS
- ⚠️ **Error Rate**: < 0.1%

### Alerting Thresholds

- Response time > 200ms
- Cache hit ratio < 90%
- Error rate > 1%
- Memory usage > 80%

## Scaling Considerations

### Horizontal Scaling

- **Consistent Hashing**: Distribute usernames across shards
- **Load Balancers**: Route traffic efficiently
- **Multi-Region**: Deploy across geographical regions
- **Caching Layers**: CDN for static responses

### Future Enhancements

- 🔄 Real-time username reservations
- 🌐 Unicode username support
- 🎨 Vanity URL integration
- 📱 Mobile-optimized suggestions
- 🔐 Username policy enforcement

## Technology Stack

```yaml
Cache Layer: Redis Cluster
Message Queue: Apache Kafka
Database: PostgreSQL (sharded)
Load Balancer: NGINX/HAProxy
Monitoring: Prometheus + Grafana
Logging: ELK Stack
Container: Docker + Kubernetes
```

## Conclusion

The hybrid approach combining Bloom Filters, Redis, and a persistent database provides an optimal balance of:

- **Performance**: Sub-100ms response times
- **Accuracy**: Zero false negatives with minimal false positives
- **Scalability**: Handle billions of usernames
- **Cost-Effectiveness**: Efficient resource utilization
- **Reliability**: High availability with proper monitoring

This architecture ensures a smooth user experience while maintaining system reliability and performance at scale.

---

## Available Backend APIs

### 1. Check Health

```bash
# Health Check
curl http://localhost:3001/health
```

### 2. Check Username Availability

```bash
# Check if username is available
curl http://localhost:3001/check/testuser
```

### 3. Register Username

```bash
# Register a new username
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "userId": "123"}'
```

### 4. Get Username Suggestions

```bash
# Get suggestions for unavailable usernames
curl http://localhost:3001/suggest/testuser
```

### 5. Get Suggestions with Custom Count

```bash
# Get specific number of suggestions
curl "http://localhost:3001/suggest/user?count=3"
curl "http://localhost:3001/suggest/admin?count=5"
```

## API Testing Script

For comprehensive testing, you can use this complete script:

```bash
#!/bin/bash

# 1. Check health
echo "=== Health Check ==="
curl http://localhost:3001/health
echo -e "\n"

# 2. Check availability before registration
echo "=== Check availability (should be available) ==="
curl http://localhost:3001/check/testuser
echo -e "\n"

# 3. Register the username
echo "=== Register username ==="
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "userId": "123"}'
echo -e "\n"

# 4. Check availability after registration (should be taken)
echo "=== Check availability (should be taken) ==="
curl http://localhost:3001/check/testuser
echo -e "\n"

# 5. Try to register duplicate (should fail)
echo "=== Try duplicate registration ==="
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "userId": "test-456"}'
echo -e "\n"

# 6. Get suggestions for taken username
echo "=== Get suggestions ==="
curl http://localhost:3001/suggest/testuser
echo -e "\n"

# 7. Register a few more users for testing
echo "=== Register more users ==="
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "userId": "alice-001"}'

curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{"username": "bob", "userId": "bob-002"}'

curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{"username": "charlie", "userId": "charlie-003"}'
echo -e "\n"

# 8. Test suggestions with different counts
echo "=== Test suggestions with different counts ==="
curl "http://localhost:3001/suggest/user?count=3"
echo -e "\n"
curl "http://localhost:3001/suggest/admin?count=5"
echo -e "\n"
```
