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
