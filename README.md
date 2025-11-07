### 🧠 Whiteboard Drawing Application

A full-stack collaborative whiteboard tool that lets users draw shapes, write text, and manage multiple pages.
The backend provides a REST API for storing shapes and pages, while the frontend (React + Vite + TypeScript) offers an interactive canvas with a smooth drawing experience.

---

### ⚙️ Tech Stack

1.Frontend

* React 19 (TypeScript)

* Vite

* HTML5 Canvas API

* Tailwind / Inline CSS for layout

2.Backend

* Node.js + Express

* MongoDB (optional, used if MONGO_URI is provided)

* REST API endpoints for shapes and pages

* CORS + Morgan + dotenv for middleware & configuration

---

### 📑 API Documentation

All endpoints are prefixed with:
 /api

#### 1.Shapes

#### GET /api/shapes

Fetch all shapes currently stored on the backend.

Response
```

[
  {
    "id": "pencil_123456",
    "type": "pencil",
    "x": 20,
    "y": 30,
    "points": [{ "x": 20, "y": 30 }, { "x": 25, "y": 35 }],
    "pageId": "page_1730900"
  }
]

```

#### POST /api/shapes

Create and save a new shape.

Request Body

```

{
  "id": "circle_1730800",
  "type": "circle",
  "x": 100,
  "y": 120,
  "radius": 45,
  "strokeColor": "#000",
  "pageId": "page_1730900"
}

```

Response

```
{ "message": "Shape created successfully" }

```


#### PUT /api/shapes/:id

Update an existing shape’s details (e.g. position, color, etc.)

Request Body

```
{
  "x": 150,
  "y": 180
}

```

Response

```
{ "message": "Shape updated successfully" }

```


#### DELETE /api/shapes/:id

Delete a shape by its ID.

Response

```
{ "message": "Shape deleted" }

```

### 2.Pages

#### GET /api/pages

Fetch all whiteboard pages.

Response

```
[
  { "id": "page_1730900", "name": "Page 1" },
  { "id": "page_1730912", "name": "Page 2" }
]

```

#### POST /api/pages

Create a new whiteboard page.

Request Body

```
{ "name": "Page 2" }

```

Response

```
{ "id": "page_1730912", "name": "Page 2" }

```
#### PUT /api/pages/:id

Rename an existing page.

Request Body

```
{ "name": "Updated Page" }

```

Response

```
{ "message": "Page renamed successfully" }

```

#### DELETE /api/pages/:id

Delete a page by its ID.

Response

```
{ "message": "Page deleted" }

```

---

### 🖌️ Core Features

- Draw shapes — pencil, line, circle, arrow

- Add and edit text directly on the canvas

- Manage multiple pages

- Drag and move shapes using select mode

- Auto-save to backend (if connected)

- Clean, minimal toolbar and responsive layout

---

### 🧩 Assumptions Made

- Each shape belongs to a single page (pageId).

- MongoDB connection is optional — if not provided, data is stored in-memory.

- The project is focused on the core drawing logic, not real-time collaboration.

- Authentication and user management are not included .

- Text editing and shape drawing are handled locally before API sync for smooth UX.

- The backend returns JSON responses for all routes.

--- 

### 🧾 Notes

- The backend logs all API activity via Morgan for debugging.

- The frontend communicates with backend APIs through a unified api.ts service.

- The drawing logic uses native Canvas APIs — no third-party drawing libraries.