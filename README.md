# Romeo

## Getting Started

### Prerequisites

- Node.js
- Docker (optional, only if running backend locally)

### Setup

1. **Clone the repository:**
    ```bash
    git clone https://github.com/cirillojon/Romeo
    cd Romeo
    ```

2. **Frontend Development:**
    Navigate to the frontend directory, install dependencies, and start the development server:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

    - The Next.js development server runs on port 3000 and is accessible at `http://localhost:3000`.

3. **Backend Development:**

    For backend development, it is HIGHLY recommended to use the `Remote - SSH` extension in VSCode. This allows you to edit files directly on the server.

    The backend is hosted on a Digital Ocean droplet. To access the server:
    ```bash
    ssh root@167.71.165.9
    ```
    The password is shared in the Discord `important-info` channel.

    Once logged in, activate the Python virtual environment:
    ```bash
    source venv/bin/activate
    ```

    Navigate to the backend directory. Note that the server should already be running. Restart the server only if you are making changes:
    ```bash
    gunicorn --workers 3 --bind localhost:8000 app:app
    ```

    To make a new API endpoint accessible by the frontend, update the `next.config.mjs` file with the new endpoint, for example:
    ```javascript
    {
        source: "/api/user",
        destination: "http://167.71.165.9/api/user",
    },
    ```
    To test that the api is working properly, you can simply do: 

    ```bash
    curl http://167.71.165.9/api/hello
    ```
    and verify that you get a valid response:

    ```bash
    {"message": "Hello World"}
    ```

4. **Optional: Local Backend Development**
    To run the backend locally, update the `next.config.mjs` file to point to `http://backend:5000` instead of the server IP.

    Build and start all containers from the root directory:
    ```bash
    docker-compose build
    docker-compose up
    ```

    To stop all running containers:
    ```bash
    docker-compose down
    ```

## Application Structure

### Frontend

The frontend is currently built using **Next.js** and **TypeScript**

Notable libraries:

- **Tailwind CSS**
- **Radix UI**
- **shadcn/ui**

### Backend

Our backend is currently running on a **Ubuntu 24.04 LTS** server running in a digital ocean droplet

- **Python** - Language
- **Flask** - Web framework
- **NGINX** - Reverse proxy
- **Gunicorn** Serves the Flask application on the droplet

### Upcoming Features

- **PostgreSQL**: Database
- **Vercel**: May use for hosting frontend