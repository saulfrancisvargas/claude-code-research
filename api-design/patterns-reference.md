# API Design Patterns - Extended Reference

This document provides detailed explanations, trade-offs, and implementation guidance for each pattern from the main SKILL.md.

---

## Pattern Deep Dives

### Standard Methods

#### List Method

**Purpose**: Retrieve a collection of resources.

**Implementation**:
```http
GET /users?page_size=25&page_token=abc&filter=status="ACTIVE"&order_by=created_at desc
```

**Request Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `page_size` | integer | Max results (default: 25, max: 1000) |
| `page_token` | string | Opaque pagination token |
| `filter` | string | CEL expression for filtering |
| `order_by` | string | Sort field with optional `desc` |
| `read_mask` | string | Fields to return |

**Response Structure**:
```json
{
  "users": [
    {"name": "users/123", "display_name": "John"},
    {"name": "users/456", "display_name": "Jane"}
  ],
  "next_page_token": "eyJvZmZzZXQiOjI1fQ==",
  "total_size": 150
}
```

**Trade-offs**:
| Approach | Pros | Cons |
|----------|------|------|
| Offset pagination | Simple, random access | Slow on large datasets, inconsistent with concurrent writes |
| Cursor pagination | Fast, consistent | No random access, complex implementation |
| Keyset pagination | Efficient, consistent | Requires sortable unique key |

**Best Practice**: Use cursor/keyset pagination for production APIs.

---

#### Get Method

**Purpose**: Retrieve a single resource by ID.

**Implementation**:
```http
GET /users/123?read_mask=display_name,email
```

**Behavior**:
- Returns 404 if resource doesn't exist
- Returns 404 (not 410) for soft-deleted resources unless `show_deleted=true`
- Supports partial retrieval via `read_mask`

**Trade-offs**:
| Approach | Pros | Cons |
|----------|------|------|
| Return full resource | Simple client code | Bandwidth waste, privacy concerns |
| Field masks | Efficient, privacy-friendly | Complex implementation |

---

#### Create Method

**Purpose**: Create a new resource.

**Implementation**:
```http
POST /users
Content-Type: application/json
X-Request-Id: unique-123

{
  "display_name": "New User",
  "email": "user@example.com"
}
```

**Idempotency Options**:

1. **Server-generated IDs** (default):
   ```json
   POST /users
   {"display_name": "User"}

   Response: {"name": "users/abc123", ...}
   ```

2. **Client-provided IDs**:
   ```json
   POST /users?user_id=my-custom-id
   {"display_name": "User"}

   Response: {"name": "users/my-custom-id", ...}
   ```

3. **Request ID header**:
   ```http
   POST /users
   X-Request-Id: unique-request-123
   ```

**Trade-offs**:
| Approach | Pros | Cons |
|----------|------|------|
| Server IDs | Simple, guaranteed unique | Not idempotent by default |
| Client IDs | Idempotent, predictable | Client must ensure uniqueness |
| Request ID | Idempotent, flexible | Requires server-side storage |

---

#### Update Methods (PUT vs PATCH)

**PUT (Full Update)**:
```http
PUT /users/123
Content-Type: application/json

{
  "display_name": "Updated Name",
  "email": "new@example.com",
  "status": "ACTIVE"
}
```
- Replaces entire resource
- Omitted fields are set to defaults
- Idempotent

**PATCH (Partial Update)**:
```http
PATCH /users/123?update_mask=display_name,email
Content-Type: application/json

{
  "display_name": "Updated Name",
  "email": "new@example.com"
}
```
- Updates only specified fields
- Field mask required for clarity
- Idempotent

**Trade-offs**:
| Method | When to Use |
|--------|-------------|
| PUT | Simple resources, full replacement needed |
| PATCH | Complex resources, bandwidth optimization |

---

#### Delete Method

**Purpose**: Remove a resource.

**Soft Delete** (Recommended):
```http
DELETE /users/123

Response: 204 No Content
```

Resource becomes:
```json
{
  "name": "users/123",
  "delete_time": "2024-01-15T10:00:00Z",
  "expire_time": "2024-02-15T10:00:00Z"
}
```

**Restore**:
```http
POST /users/123:undelete

Response: {"name": "users/123", "delete_time": null, ...}
```

**Hard Delete**:
```http
DELETE /users/123?force=true

Response: 204 No Content (permanent)
```

**Trade-offs**:
| Approach | Pros | Cons |
|----------|------|------|
| Soft delete | Recoverable, audit trail | Storage cost, complexity |
| Hard delete | Clean, simple | Irreversible, no audit |

---

### Long-Running Operations

**When to Use**: Operations taking >10 seconds (exports, imports, ML training, etc.)

**Flow**:

1. **Initiate Operation**:
   ```http
   POST /databases/mydb:export
   {"destination": "gs://bucket/export/"}

   Response:
   {
     "name": "operations/export-xyz",
     "done": false,
     "metadata": {
       "@type": "type.googleapis.com/ExportMetadata",
       "progress_percent": 0
     }
   }
   ```

2. **Poll for Status**:
   ```http
   GET /operations/export-xyz

   Response:
   {
     "name": "operations/export-xyz",
     "done": false,
     "metadata": {"progress_percent": 45}
   }
   ```

3. **Completed**:
   ```json
   {
     "name": "operations/export-xyz",
     "done": true,
     "response": {
       "@type": "type.googleapis.com/ExportResponse",
       "output_uri": "gs://bucket/export/data.csv"
     }
   }
   ```

4. **Failed**:
   ```json
   {
     "name": "operations/export-xyz",
     "done": true,
     "error": {
       "code": 500,
       "message": "Export failed: disk full"
     }
   }
   ```

**Trade-offs**:
| Approach | Pros | Cons |
|----------|------|------|
| Polling | Simple, stateless | Latency, bandwidth waste |
| Webhooks | Real-time, efficient | Complex, requires endpoint |
| WebSockets | Real-time, bidirectional | Connection management |

---

### Batch Operations

**Batch Get**:
```http
GET /users:batchGet?ids=123,456,789

Response:
{
  "users": [
    {"name": "users/123", ...},
    {"name": "users/456", ...},
    {"name": "users/789", ...}
  ]
}
```

**Batch Create**:
```http
POST /users:batchCreate
{
  "requests": [
    {"user": {"display_name": "User 1"}},
    {"user": {"display_name": "User 2"}}
  ]
}
```

**Atomicity Options**:

| Mode | Behavior |
|------|----------|
| `atomic=true` | All succeed or all fail |
| `atomic=false` | Partial success allowed |

**Response with partial failure**:
```json
{
  "users": [
    {"name": "users/new1", ...},
    null
  ],
  "errors": [
    null,
    {"code": 400, "message": "Invalid email"}
  ]
}
```

---

### Association Resources

**Use Case**: Many-to-many relationships with metadata.

**Example**: Group Memberships

```
GET /groups/123/memberships
GET /groups/123/memberships/456
POST /groups/123/memberships
DELETE /groups/123/memberships/456
```

**Schema**:
```json
{
  "name": "groups/123/memberships/456",
  "user": "users/789",
  "role": "ADMIN",
  "joined_at": "2024-01-01T00:00:00Z",
  "invited_by": "users/111"
}
```

**vs Add/Remove Methods**:

| Approach | When to Use |
|----------|-------------|
| Association resources | Relationship has metadata (role, timestamp) |
| Add/Remove methods | Simple membership, no metadata |

---

### Request Deduplication

**Problem**: Network failures cause duplicate requests.

**Solution 1: Idempotency Key**
```http
POST /payments
Idempotency-Key: payment-abc-123

{"amount": 100, "currency": "USD"}
```

Server behavior:
1. First request: Process and store key + response
2. Duplicate request: Return stored response
3. Key expiry: 24 hours typical

**Solution 2: Client-Provided ID**
```http
POST /orders?order_id=client-order-123

{"items": [...]}
```

**Trade-offs**:
| Approach | Pros | Cons |
|----------|------|------|
| Idempotency key | Works for any request | Server storage required |
| Client ID | Natural deduplication | Client must generate IDs |

---

### Versioning Strategies

**URL Versioning** (Recommended):
```
/v1/users
/v2/users
```

**Header Versioning**:
```http
GET /users
API-Version: 2024-01-01
```

**Query Parameter**:
```http
GET /users?version=2
```

**Compatibility Matrix**:

| Change Type | Backward Compatible? |
|-------------|---------------------|
| Add optional field | Yes |
| Add required field | No |
| Remove field | No |
| Rename field | No |
| Change field type | No |
| Add enum value | Maybe (depends on client) |
| Add new endpoint | Yes |
| Change error format | No |

**Migration Strategy**:
1. Announce deprecation (6+ months notice)
2. Support both versions simultaneously
3. Provide migration guide
4. Set sunset date
5. Return `Deprecation` header

---

## Anti-Patterns to Avoid

### 1. Verbs in URLs
```
# Bad
POST /createUser
GET /getUser/123
POST /deleteUser/123

# Good
POST /users
GET /users/123
DELETE /users/123
```

### 2. Nested Resources Too Deep
```
# Bad (5 levels)
/orgs/1/teams/2/projects/3/tasks/4/comments/5

# Good (max 3 levels)
/projects/3/tasks/4/comments/5
```

### 3. Inconsistent Naming
```
# Bad
/users          (plural)
/product        (singular)
/order-items    (hyphen)
/orderDetails   (camelCase)

# Good (consistent plural, snake_case)
/users
/products
/order_items
/order_details
```

### 4. Exposing Database IDs
```
# Bad (auto-increment exposes info)
/users/1
/users/2
/users/3

# Good (opaque IDs)
/users/abc123xyz
/users/def456uvw
```

### 5. Ignoring Idempotency
```
# Bad (not idempotent)
POST /users/123/increment_counter

# Good (idempotent)
PUT /users/123/counter
{"value": 5}
```

---

## Quick Decision Guide

| Scenario | Pattern |
|----------|---------|
| CRUD operations | Standard methods |
| Non-CRUD action | Custom method (`:verb`) |
| Operation > 10s | Long-running operation |
| Multiple resources at once | Batch operations |
| Many-to-many with metadata | Association resources |
| Many-to-many simple | Add/remove methods |
| Prevent duplicate requests | Request deduplication |
| Data recovery needed | Soft deletion |
| Change tracking | Resource revisions |
| Dry run / preview | Request validation |
