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

    Navigate to the backend directory.
    (Note that the flask server should already be running via gunicorn on port 8000.)
    (Starting the server *should* be un-needed unless the server is offline for some reason)

   To start the server:
    ```bash
    gunicorn --workers 3 --bind localhost:8000 app:app
    ```
    How to restart server: (Restart the server only if you are making changes)

    ```bash
    To get the running gunicorn process:
    ps aux | grep gunicorn

    To gracefully restart: (Recommended to propogate changes without taking down server)
    kill -HUP <pid>

    To completely stop: 
    kill <pid>
    ```

    Adding a New API Endpoint to `app.py`

    Create a new resource class to handle the API logic. For instance, if you want to add a Task endpoint with GET and POST options:
    ```python
    class Task(Resource):
        def get(self):
            return {"tasks": "List of tasks"}
    
        def post(self):
                data = request.get_json()  # Parses the JSON data
                if not data or 'task' not in data:
                    return {"message": "No task provided"}, 400
                task_description = data['task']
                return {"message": f"Task added: {task_description}"}, 201
    ```

    Add the new resource to your API by updating the api.add_resource() calls:
    ```python
    # Registering the new Task resource
    api.add_resource(Task, '/api/task')
    ```
    
    To test that the api is working properly, you can simply do: 

    For a get request:
    ```bash
    curl http://167.71.165.9/api/task
    ```
    and verify that you get a valid response:
    ```bash
    {
        "tasks": "List of tasks"
    }
    ```

    However for api testing, I highly reccomend using postman
    For example, to test this PUT request in postman:
    in the url field put: `http://167.71.165.9/api/task`
    make it a `PUT` request
    Then in the body, select `raw`, and `json`, and add this:
    ```bash
    {
        "task" : "Test"
    }
    ```
    The correct response for this api should look like:
    ```bash
    {
        "message": "Task added: Test"
    }
    ```

    You can go to the console in postman to see the full details of your request:
    ```bash
    POST /api/task HTTP/1.1
    Content-Type: application/json
    User-Agent: PostmanRuntime/7.37.3
    Accept: */*
    Postman-Token: 7ed648e7-dcb6-47ed-9ae4-5cfa29ef98b3
    Host: 167.71.165.9
    Accept-Encoding: gzip, deflate, br
    Connection: keep-alive
    Content-Length: 27
     
    {
    "task" : "Test"
    }
     
    HTTP/1.1 201 CREATED
    Server: nginx/1.24.0 (Ubuntu)
    Date: Wed, 22 May 2024 23:19:14 GMT
    Content-Type: application/json
    Content-Length: 32
    Connection: keep-alive
     
    {"message": "Task added: Test"}
    ```   

    To make a new API endpoint accessible by the frontend, update the `next.config.mjs` file with the new endpoint, for example:
    ```javascript
    {
        source: "/api/user",
        destination: "http://167.71.165.9/api/user",
    },
    ```

    nginx notes: (this is already done this is just for documentation)

    create file in /etc/nginx/sites-enabled/ called {project-name}
    containing:
    ```javascript
        server {
            listen 80;
            server_name 167.71.165.9;   <--- this will eventually be changed to hold our domain

            location / {
                proxy_pass http://localhost:8000;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
            }
        }
    ```
    nginx commands:
    ```bash
    check nginx conf file syntax:
    sudo nginx -t

    create link to sites-enabled:
    sudo ln -s /etc/nginx/sites-available/home-improvement /etc/nginx/sites-enabled/

    reload nginx once ready:
    sudo systemctl reload nginx
    ```
5. **Optional: Local Backend Development**
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
