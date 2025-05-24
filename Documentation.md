```markdown
# Hostel Mess Management API Documentation

_All endpoints are prefixed with_  
```

http\://<your-domain-or-localhost>:<PORT>/api

```

In development, if running locally on port 5000:  
```

[http://localhost:5000/api](http://localhost:5000/api)

```

All **protected** endpoints require the HTTP header:  
```

Authorization: Bearer \<JWT\_TOKEN>

````

---

## 1. Authentication

### **POST** `/auth/login`

Authenticate a user and receive a JSON Web Token.

**Request Body**

| Field      | Type     | Required | Description        |
| ---------- | -------- | -------- | ------------------ |
| `email`    | `string` | yes      | User’s email       |
| `password` | `string` | yes      | Plaintext password |

**Responses**

- **200 OK**

  ```json
  {
    "token": "<jwt-token>",
    "user": {
      "id": "<mongo-object-id>",
      "email": "resident_1@jubileehall.com",
      "name": "Debanik Panda",
      "role": "resident"
    }
  }
````

* **401 Unauthorized**

  ```json
  { "message": "Invalid credentials" }
  ```

* **500 Internal Server Error** on unexpected errors

---

## 2. Users

> **Protected**: requires valid JWT.
> **Role**: only `admin` users may create/update/delete.

### **GET** `/users`

List all users.

**Headers**

```
Authorization: Bearer <JWT_TOKEN>
```

**200 OK**

```json
[
  {
    "_id": "60e6a7e2f1a4b23a4c8d1e77",
    "email": "admin@jubileehall.com",
    "name": "Admin User",
    "role": "admin",
    "createdAt": "2025-05-22T12:00:00.000Z",
    "updatedAt": "2025-05-22T12:00:00.000Z"
  },
  { /* … */ }
]
```

### **POST** `/users`

Create a new user.

**Headers**

```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body**

| Field      | Type     | Required | Description                  |
| ---------- | -------- | -------- | ---------------------------- |
| `id`       | `number` | yes      | (Optional) legacy numeric ID |
| `email`    | `string` | yes      | Unique email                 |
| `name`     | `string` | yes      | Full user name               |
| `role`     | `string` | yes      | `resident` or `admin`        |
| `password` | `string` | yes      | Plaintext password (hashed)  |

**201 Created**

```json
{
  "_id": "60e6b8c9f1b4a330c83a2d11",
  "email": "resident_2@jubileehall.com",
  "name": "Kumar Abhishek",
  "role": "resident",
  "createdAt": "2025-05-22T12:05:00.000Z",
  "updatedAt": "2025-05-22T12:05:00.000Z"
}
```

### **PUT** `/users/:id`

Update an existing user.

**Headers**

```
Authorization: Bearer <JWT_TOKEN>
```

**URL Params**

* `id`: MongoDB `_id`

**Request Body**

Any subset of `{ email, name, role, password }`
(if `password` provided, it will be hashed)

**200 OK**

```json
{
  "_id": "60e6a7e2f1a4b23a4c8d1e77",
  "email": "updated@jubileehall.com",
  "name": "Updated Name",
  "role": "resident",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### **DELETE** `/users/:id`

Remove a user.

**Headers**

```
Authorization: Bearer <JWT_TOKEN>
```

**URL Params**

* `id`: MongoDB `_id`

**204 No Content**

---

## 3. Resident Bookings

> **Protected**

### **GET** `/bookings`

Fetch all resident bookings.

**Headers**

```
Authorization: Bearer <JWT_TOKEN>
```

**200 OK**

```json
[
  {
    "_id": "60e6b8c9f1b4a330c83a2d11",
    "userId": "60e6a7e2f1a4b23a4c8d1e77",
    "userName": "Aryan Shukla",
    "contactNumber": "9876543210",
    "mealType": "lunch",
    "date": "2025-05-23T00:00:00.000Z",
    "quantities": { "rice": 2, "dal": 1, "roti": 2 },
    "hasDiscount": false,
    "status": "pending",
    "timestamp": "2025-05-22T18:57:23.595Z"
  },
  { /* … */ }
]
```

### **POST** `/bookings`

Create a new resident booking.

**Headers**

```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body**

| Field           | Type                | Required | Description                           |
| --------------- | ------------------- | -------- | ------------------------------------- |
| `userId`        | `string` (ObjectId) | yes      | Mongo `_id` of resident               |
| `userName`      | `string`            | yes      | Resident’s full name                  |
| `contactNumber` | `string`            | yes      | Phone number                          |
| `mealType`      | `string` enum       | yes      | `breakfast` / `lunch` / `dinner`      |
| `date`          | `string` (ISO Date) | yes      | YYYY-MM-DD                            |
| `quantities`    | `object`            | yes      | Map: dish → qty                       |
| `hasDiscount`   | `boolean`           | no       | Defaults to `false`                   |
| `status`        | `string` enum       | no       | `pending` / `confirmed` / `cancelled` |
| `timestamp`     | `string` (ISO Date) | no       | Defaults to now                       |

**201 Created** → booking object

### **PUT** `/bookings/:id`

Update a booking (e.g. status).

**Headers**

```
Authorization: Bearer <JWT_TOKEN>
```

**URL Params**

* `id`: Mongo `_id` of the booking

**Request Body**

Subset of booking fields, e.g. `{ "status": "confirmed" }`

**200 OK** → updated booking object

### **DELETE** `/bookings/:id`

Remove a booking.

**Headers**

```
Authorization: Bearer <JWT_TOKEN>
```

**URL Params**

* `id`: Mongo `_id`

**204 No Content**

---

## 4. Guest Bookings

> **Protected**

### **GET** `/guest-bookings`

List all guest bookings.

### **POST** `/guest-bookings`

Create a guest booking.

**Request Body**

| Field           | Type                | Required | Description                       |
| --------------- | ------------------- | -------- | --------------------------------- |
| `id`            | `string`            | yes      | Unique booking identifier         |
| `userName`      | `string`            | yes      | Guest’s name                      |
| `contactNumber` | `string`            | yes      | Phone number                      |
| `mealType`      | `string` enum       | yes      | `breakfast`/`lunch`/`dinner`      |
| `date`          | `string` (ISO Date) | yes      | YYYY-MM-DD                        |
| `quantities`    | `object`            | yes      | Map: dish → qty                   |
| `hasDiscount`   | `boolean`           | no       | Defaults to `false`               |
| `status`        | `string` enum       | no       | `pending`/`confirmed`/`cancelled` |
| `timestamp`     | `string` (ISO Date) | no       | Defaults to now                   |

**201 Created** → guest-booking object

### **PUT** `/guest-bookings/:id`

Update guest booking by `id`.

### **DELETE** `/guest-bookings/:id`

Delete guest booking by `id`.

---

## 5. Menu

> **Protected**

### **GET** `/menu`

Fetch the current full-week menu.

**200 OK**

```json
{
  "_id": "...",
  "monday":   { "breakfast": [...], "lunch": [...], "dinner": [...] },
  /* … through sunday */
}
```

### **PUT** `/menu`

Create or overwrite the menu.

**Request Body**

```json
{
  "monday":   { "breakfast": ["…"], "lunch": ["…"], "dinner": ["…"] },
  /* … through sunday */
}
```

**200 OK** → updated menu

---

## 6. Off-Days

> **Protected**

### **GET** `/off-days`

List all kitchen off-days.

**200 OK**

```json
[
  { "_id": "...", "date": "2025-01-01T00:00:00.000Z", "reason": "New Year Holiday" },
  /* … */
]
```

### **POST** `/off-days`

Add an off-day.

**Request Body**

| Field    | Type                | Required | Description         |
| -------- | ------------------- | -------- | ------------------- |
| `date`   | `string` (ISO Date) | yes      | YYYY-MM-DD          |
| `reason` | `string`            | yes      | Holiday description |

**201 Created** → off-day object

### **PUT** `/off-days/:id`

Update an off-day by Mongo `_id`.

### **DELETE** `/off-days/:id`

Delete an off-day by Mongo `_id`.

---

## 7. Rebates

> **Protected**

### **GET** `/rebates`

List all rebate requests.

### **POST** `/rebates`

Apply for a rebate.

**Request Body**

| Field       | Type                | Required | Description              |
| ----------- | ------------------- | -------- | ------------------------ |
| `id`        | `string`            | yes      | Unique rebate identifier |
| `userId`    | `string` (ObjectId) | yes      | Mongo `_id` of resident  |
| `userName`  | `string`            | yes      | Resident’s name          |
| `startDate` | `string` (ISO Date) | yes      | First day of rebate      |
| `endDate`   | `string` (ISO Date) | yes      | Last day of rebate       |
| `reason`    | `string`            | yes      | Reason for rebate        |
| `status`    | `string` enum       | no       | Defaults to `pending`    |
| `appliedAt` | `string` (ISO Date) | no       | Defaults to now          |

**201 Created** → rebate object

### **PUT** `/rebates/:id`

Update rebate status by unique `id`.

### **DELETE** `/rebates/:id`

Delete a rebate request by unique `id`.

---

## Error Responses

All errors are returned as JSON:

```json
{
  "message": "<error description>",
  "stack": "<stack trace or null in production>"
}
```

* **400 Bad Request** – invalid or missing parameters
* **401 Unauthorized** – missing/invalid token or bad credentials
* **403 Forbidden** – valid token but insufficient permissions
* **404 Not Found** – resource not found
* **500 Internal Server Error** – unexpected server error

---

## Example Usage

1. **Login**

   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
        -H "Content-Type: application/json" \
        -d '{"email":"admin@jubileehall.com","password":"admin123"}'
   ```

2. **Fetch Bookings**

   ```bash
   curl http://localhost:5000/api/bookings \
        -H "Authorization: Bearer <JWT_TOKEN>"
   ```

3. **Add Guest Booking**

   ```bash
   curl -X POST http://localhost:5000/api/guest-bookings \
        -H "Authorization: Bearer <JWT_TOKEN>" \
        -H "Content-Type: application/json" \
        -d '{
          "id":"GB1001",
          "userName":"John Doe",
          "contactNumber":"1234567890",
          "mealType":"dinner",
          "date":"2025-05-24",
          "quantities":{ "rice":2, "dal":1 },
          "hasDiscount":false
        }'
   ```

```
```
