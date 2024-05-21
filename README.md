# Romeo

## Getting Started

### Prerequisites

- Docker
- Docker Compose
- Node.js (optional, only if running frontend locally outside Docker)

### Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/cirillojon/Romeo
    cd Romeo
    ```

2. **Optional: Set up local development environment:**

    If you plan to run or develop the frontend locally outside of Docker, you can follow these steps:

    ```bash
    cd frontend
    npm install
    npm run dev
    ```

    It is not necessary to npm install in frontend unless you want to develop outside of docker.
    

3. **Build the Docker containers:**

    Build all containers using the following command from the root directory:

    ```bash
    docker-compose build
    ```

    This command builds both the frontend and backend containers based on their respective Dockerfiles.

4. **Run the application:**

    Start the application using Docker with the following command:

    ```bash
    docker-compose up
    ```

    This command starts both the frontend and backend services, defined in the `docker-compose.yml`. The frontend serves the Next.js app, and the backend runs the Flask server.

5. **Stop the application:**

    To stop all running containers, use:

    ```bash
    docker-compose down
    ```

### Notes

- The Flask server runs on port 5000 and is accessible at `http://backend:5000` from other Docker services.
- The Next.js development server runs on port 3000 and is accessible at `http://localhost:3000`.
- Ensure your Docker environment is set up correctly before executing commands.
- Use `docker-compose logs` for logging and debugging.
