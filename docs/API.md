# ChandaCollection API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

Tokens are obtained from the login or signup endpoints and expire after 7 days.

## Endpoints

### Authentication Endpoints

#### 1. Sign Up
Create a new user account.

**Endpoint**: `POST /auth/signup`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Validation Rules**:
- `email`: Must be a valid email format, unique in the system
- `password`: Minimum 6 characters
- `firstName`: Required, non-empty
- `lastName`: Required, non-empty

**Success Response** (201):
```json
{
  "message": "User created successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "created_at": "2026-11-26T20:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**:
- `400 Bad Request`: Validation error
  ```json
  {
    "errors": [
      {
        "param": "email",
        "msg": "Invalid value",
        "value": "invalid-email"
      }
    ]
  }
  ```

- `409 Conflict`: Email already registered
  ```json
  {
    "error": "Email already registered"
  }
  ```

- `500 Internal Server Error`: Server error
  ```json
  {
    "error": "Internal server error"
  }
  ```

---

#### 2. Login
Authenticate a user and get a JWT token.

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Validation Rules**:
- `email`: Must be a valid email format
- `password`: Required, non-empty

**Success Response** (200):
```json
{
  "message": "Login successful",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**:
- `400 Bad Request`: Validation error
  ```json
  {
    "errors": [
      {
        "param": "email",
        "msg": "Invalid value"
      }
    ]
  }
  ```

- `401 Unauthorized`: Invalid credentials
  ```json
  {
    "error": "Invalid credentials"
  }
  ```

---

#### 3. Get Profile
Retrieve the current user's profile information.

**Endpoint**: `GET /auth/profile`

**Headers Required**:
```
Authorization: Bearer <jwt_token>
```

**Success Response** (200):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+919876543210",
  "language": "en",
  "created_at": "2026-11-26T20:00:00Z"
}
```

**Error Responses**:
- `401 Unauthorized`: No token or invalid token
  ```json
  {
    "error": "No authorization header"
  }
  ```
  or
  ```json
  {
    "error": "Invalid or expired token"
  }
  ```

- `404 Not Found`: User not found
  ```json
  {
    "error": "User not found"
  }
  ```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 404 | Not Found |
| 409 | Conflict (duplicate email) |
| 500 | Internal Server Error |

---

## Error Handling

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

or for validation errors:

```json
{
  "errors": [
    {
      "param": "field_name",
      "msg": "Error description",
      "value": "provided_value"
    }
  ]
}
```

---

## Rate Limiting

Currently, there is no rate limiting in place. This should be added in production.

---

## Token Format

JWTs contain:
- `id`: User UUID
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp (7 days)

Decode at [jwt.io](https://jwt.io) for debugging.

---

## Examples

### Using cURL

**Sign Up**:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePass123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Login**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePass123"
  }'
```

**Get Profile**:
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Using JavaScript (Fetch API)

**Sign Up**:
```javascript
const response = await fetch('http://localhost:5000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'securePass123',
    firstName: 'John',
    lastName: 'Doe',
  }),
});
const data = await response.json();
console.log(data.token);
```

---

## Upcoming Endpoints (Phase 2)

- `POST /groups` - Create a group
- `GET /groups` - List user's groups
- `POST /groups/:groupId/members` - Add member to group
- `POST /campaigns` - Create a campaign
- `POST /payments` - Record a payment
- `POST /expenses` - Add an expense
- And more...
