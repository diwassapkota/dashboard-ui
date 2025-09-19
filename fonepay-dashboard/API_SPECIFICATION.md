# API Specification

This document provides a detailed specification for the backend API, designed to be integrated with an Angular front-end.

## Table of Contents
- [Authentication](#authentication)
- [Dashboard](#dashboard)
- [Chat](#chat)
- [Query](#query)
- [Reports](#reports)
- [Settings](#settings)
- [Data Models (DTOs)](#data-models-dtos)

## Authentication

All endpoints, unless specified otherwise, require a valid JSON Web Token (JWT) to be included in the `Authorization` header of the request.

`Authorization: Bearer <your_jwt_token>`

### Endpoints

#### 1. Register a new user

*   **Endpoint:** `POST /api/auth/register`
*   **Description:** Creates a new user account.
*   **Authentication:** None required.
*   **Request Body:** `application/json`

    ```json
    {
      "name": "string",
      "email": "string (email format)",
      "password": "string",
      "role": "string (Enum: 'ROLE_USER', 'ROLE_ADMIN')"
    }
    ```
*   **Response Body:** `application/json`

    On success (200 OK):
    ```json
    {
      "token": "string (JWT)"
    }
    ```
*   **Example `curl`:**
    ```bash
    curl -X POST http://localhost:8080/api/auth/register \\
      -H "Content-Type: application/json" \\
      -d '{
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123",
        "role": "ROLE_USER"
      }'
    ```

#### 2. Log in a user

*   **Endpoint:** `POST /api/auth/login`
*   **Description:** Authenticates a user and returns a JWT.
*   **Authentication:** None required.
*   **Request Body:** `application/json`

    ```json
    {
      "email": "string (email format)",
      "password": "string"
    }
    ```
*   **Response Body:** `application/json`

    On success (200 OK):
    ```json
    {
      "token": "string (JWT)"
    }
    ```
*   **Example `curl`:**
    ```bash
    curl -X POST http://localhost:8080/api/auth/login \\
      -H "Content-Type: application/json" \\
      -d '{
        "email": "test@example.com",
        "password": "password123"
      }'
    ```

---

## Dashboard

### Endpoints

#### 1. Get Dashboard Metrics

*   **Endpoint:** `GET /api/dashboard/metrics`
*   **Description:** Retrieves key metrics for the dashboard.
*   **Authentication:** Required.
*   **Response Body:** `application/json`

    On success (200 OK):
    ```json
    {
      "totalTransactions": "long",
      "successfulTransactions": "long",
      "failedTransactions": "long",
      "transactionVolumeLast30Days": "long",
      "transactionSuccessRateLast30Days": "double"
    }
    ```
*   **Example `curl`:**
    ```bash
    export JWT_TOKEN="your_jwt_token_here"
    curl -X GET http://localhost:8080/api/dashboard/metrics \\
      -H "Authorization: Bearer $JWT_TOKEN"
    ```

---

## Chat

### Endpoints

#### 1. Send a chat message

*   **Endpoint:** `POST /api/chat/send`
*   **Description:** Sends a message to a conversation. The authenticated user is the sender.
*   **Authentication:** Required.
*   **Request Body:** `application/json`

    ```json
    {
      "conversationId": "long",
      "message": "string"
    }
    ```
*   **Response Body:** `application/json`

    On success (200 OK), returns the created message:
    ```json
    {
      "id": "long",
      "conversationId": "long",
      "sender": "string",
      "message": "string",
      "userId": "long",
      "timestamp": "string (ISO 8601 DateTime)"
    }
    ```
*   **Example `curl`:**
    ```bash
    export JWT_TOKEN="your_jwt_token_here"
    curl -X POST http://localhost:8080/api/chat/send \\
      -H "Authorization: Bearer $JWT_TOKEN" \\
      -H "Content-Type: application/json" \\
      -d '{
        "conversationId": 1,
        "message": "Hello, this is a test message."
      }'
    ```

#### 2. Get conversation history

*   **Endpoint:** `GET /api/chat/history/{conversationId}`
*   **Description:** Retrieves the message history for a specific conversation.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `conversationId` (long): The ID of the conversation to retrieve.
*   **Response Body:** `application/json`

    On success (200 OK), returns a list of chat messages:
    ```json
    [
      {
        "id": "long",
        "conversationId": "long",
        "sender": "string",
        "message": "string",
        "userId": "long",
        "timestamp": "string (ISO 8601 DateTime)"
      }
    ]
    ```
*   **Example `curl`:**
    ```bash
    export JWT_TOKEN="your_jwt_token_here"
    curl -X GET http://localhost:8080/api/chat/history/1 \\
      -H "Authorization: Bearer $JWT_TOKEN"
    ```

---

## Query

### Endpoints

#### 1. Execute a query

*   **Endpoint:** `POST /api/query/execute`
*   **Description:** Executes a database query. The query is logged for the authenticated user.
*   **Authentication:** Required.
*   **Request Body:** `application/json`

    ```json
    {
      "query": "string"
    }
    ```
*   **Response Body:** `application/json`

    On success (200 OK):
    ```json
    {
      "results": [
        {
          "columnName1": "value1",
          "columnName2": "value2"
        }
      ],
      "error": null
    }
    ```
    On error:
    ```json
    {
      "results": null,
      "error": "string (Error message)"
    }
    ```
*   **Example `curl`:**
    ```bash
    export JWT_TOKEN="your_jwt_token_here"
    curl -X POST http://localhost:8080/api/query/execute \\
      -H "Authorization: Bearer $JWT_TOKEN" \\
      -H "Content-Type: application/json" \\
      -d '{
        "query": "SELECT * FROM users;"
      }'
    ```

#### 2. Get query history

*   **Endpoint:** `GET /api/query/history`
*   **Description:** Retrieves the query history for the authenticated user.
*   **Authentication:** Required.
*   **Response Body:** `application/json`

    On success (200 OK), returns a list of query logs:
    ```json
    [
      {
        "id": "long",
        "queryText": "string",
        "resultSummary": "string",
        "userId": "long",
        "executedAt": "string (ISO 8601 DateTime)"
      }
    ]
    ```
*   **Example `curl`:**
    ```bash
    export JWT_TOKEN="your_jwt_token_here"
    curl -X GET http://localhost:8080/api/query/history \\
      -H "Authorization: Bearer $JWT_TOKEN"
    ```

---

## Reports

### Endpoints

#### 1. Get all reports

*   **Endpoint:** `GET /api/reports`
*   **Description:** Retrieves a list of all reports.
*   **Authentication:** Required.
*   **Response Body:** `application/json`

    On success (200 OK), returns a list of reports:
    ```json
    [
      {
        "id": "long",
        "title": "string",
        "type": "string",
        "filePath": "string",
        "userId": "long",
        "createdAt": "string (ISO 8601 DateTime)"
      }
    ]
    ```
*   **Example `curl`:**
    ```bash
    export JWT_TOKEN="your_jwt_token_here"
    curl -X GET http://localhost:8080/api/reports \\
      -H "Authorization: Bearer $JWT_TOKEN"
    ```

#### 2. Create a new report

*   **Endpoint:** `POST /api/reports`
*   **Description:** Creates a new report.
*   **Authentication:** Required.
*   **Request Body:** `application/json`

    ```json
    {
      "title": "string",
      "type": "string",
      "filePath": "string (optional)"
    }
    ```
*   **Response Body:** `application/json`

    On success (200 OK), returns the created report:
    ```json
    {
      "id": "long",
      "title": "string",
      "type": "string",
      "filePath": "string",
      "userId": "long",
      "createdAt": "string (ISO 8601 DateTime)"
    }
    ```
*   **Example `curl`:**
    ```bash
    export JWT_TOKEN="your_jwt_token_here"
    curl -X POST http://localhost:8080/api/reports \\
      -H "Authorization: Bearer $JWT_TOKEN" \\
      -H "Content-Type: application/json" \\
      -d '{
        "title": "Quarterly Sales Report",
        "type": "Sales"
      }'
    ```

#### 3. Get a report by ID

*   **Endpoint:** `GET /api/reports/{id}`
*   **Description:** Retrieves a single report by its ID.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (long): The ID of the report to retrieve.
*   **Response Body:** `application/json`

    On success (200 OK):
    ```json
    {
      "id": "long",
      "title": "string",
      "type": "string",
      "filePath": "string",
      "userId": "long",
      "createdAt": "string (ISO 8601 DateTime)"
    }
    ```
    On error (404 Not Found) if the report does not exist.
*   **Example `curl`:**
    ```bash
    export JWT_TOKEN="your_jwt_token_here"
    curl -X GET http://localhost:8080/api/reports/1 \\
      -H "Authorization: Bearer $JWT_TOKEN"
    ```

#### 4. Delete a report

*   **Endpoint:** `DELETE /api/reports/{id}`
*   **Description:** Deletes a report by its ID.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `id` (long): The ID of the report to delete.
*   **Response:**
    *   `204 No Content`: On successful deletion.
*   **Example `curl`:**
    ```bash
    export JWT_TOKEN="your_jwt_token_here"
    curl -X DELETE http://localhost:8080/api/reports/1 \\
      -H "Authorization: Bearer $JWT_TOKEN"
    ```

---

## Settings

### Endpoints

#### 1. Get user settings

*   **Endpoint:** `GET /api/settings`
*   **Description:** Retrieves the settings for the authenticated user.
*   **Authentication:** Required.
*   **Response Body:** `application/json`

    On success (200 OK):
    ```json
    {
      "id": "long",
      "userId": "long",
      "theme": "string",
      "preferences": "string (JSON)",
      "updatedAt": "string (ISO 8601 DateTime)"
    }
    ```
*   **Example `curl`:**
    ```bash
    export JWT_TOKEN="your_jwt_token_here"
    curl -X GET http://localhost:8080/api/settings \\
      -H "Authorization: Bearer $JWT_TOKEN"
    ```

#### 2. Update user settings

*   **Endpoint:** `PUT /api/settings`
*   **Description:** Updates the settings for the authenticated user.
*   **Authentication:** Required.
*   **Request Body:** `application/json`

    ```json
    {
      "theme": "string",
      "preferences": "string (JSON)"
    }
    ```
*   **Response Body:** `application/json`

    On success (200 OK), returns the updated settings object:
    ```json
    {
      "id": "long",
      "userId": "long",
      "theme": "string",
      "preferences": "string (JSON)",
      "updatedAt": "string (ISO 8601 DateTime)"
    }
    ```
*   **Example `curl`:**
    ```bash
    export JWT_TOKEN="your_jwt_token_here"
    curl -X PUT http://localhost:8080/api/settings \\
      -H "Authorization: Bearer $JWT_TOKEN" \\
      -H "Content-Type: application/json" \\
      -d '{
        "theme": "dark",
        "preferences": "{\\"notifications\\": true}"
      }'
    ```

---

## Data Models (DTOs)

This section details the structure of the data transfer objects used in the API requests and responses.

### `RegisterRequest`
```json
{
  "name": "string",
  "email": "string (email format)",
  "password": "string",
  "role": "string (Enum: 'ROLE_USER', 'ROLE_ADMIN')"
}
```

### `LoginRequest`
```json
{
  "email": "string (email format)",
  "password": "string"
}
```

### `LoginResponse`
```json
{
  "token": "string (JWT)"
}
```

### `DashboardMetricsDTO`
```json
{
  "totalTransactions": "long",
  "successfulTransactions": "long",
  "failedTransactions": "long",
  "transactionVolumeLast30Days": "long",
  "transactionSuccessRateLast30Days": "double"
}
```

### `SendChatMessageRequest`
```json
{
  "conversationId": "long",
  "message": "string"
}
```

### `ChatMessageDTO`
```json
{
  "id": "long",
  "conversationId": "long",
  "sender": "string",
  "message": "string",
  "userId": "long",
  "timestamp": "string (ISO 8601 DateTime)"
}
```

### `QueryRequest`
```json
{
  "query": "string"
}
```

### `QueryResponse`
```json
{
  "results": [
    {
      "columnName1": "value1",
      "columnName2": "value2"
    }
  ],
  "error": "string (nullable)"
}
```

### `QueryLogDTO`
```json
{
  "id": "long",
  "queryText": "string",
  "resultSummary": "string",
  "userId": "long",
  "executedAt": "string (ISO 8601 DateTime)"
}
```

### `CreateReportRequest`
```json
{
  "title": "string",
  "type": "string",
  "filePath": "string (optional)"
}
```

### `ReportDTO`
```json
{
  "id": "long",
  "title": "string",
  "type": "string",
  "filePath": "string",
  "userId": "long",
  "createdAt": "string (ISO 8601 DateTime)"
}
```

### `UpdateUserSettingsRequest`
```json
{
  "theme": "string",
  "preferences": "string (JSON)"
}
```

### `UserSettingsDTO`
```json
{
  "id": "long",
  "userId": "long",
  "theme": "string",
  "preferences": "string (JSON)",
  "updatedAt": "string (ISO 8601 DateTime)"
}
```
