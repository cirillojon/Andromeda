from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
import logging
from sqlalchemy import inspect
import time
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Initialize Flask application
app = Flask(__name__)

# Configure the SQLAlchemy part of the app instance using environment variables
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Create the SQLAlchemy db instance
db = SQLAlchemy(app)

# Set up logging for the application
if __name__ != '__main__':
    gunicorn_logger = logging.getLogger('gunicorn.error')
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)
else:
    logging.basicConfig(level=logging.DEBUG)

# Define the Task model
class Task(db.Model):
    __tablename__ = 'task'
    __table_args__ = {'schema': 'public'}
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)

# Initialize Flask-RESTful API
api = Api(app)

# Define a simple message resource
class Message(Resource):
    def get(self):
        return {"message": "Hello World!"}

# Define a resource for interacting with the Task model
class TaskResource(Resource):
    def get(self):
        tasks = Task.query.all()
        return {"tasks": [{"id": task.id, "description": task.description} for task in tasks]}

    def post(self):
        data = request.get_json()
        if not data or "task" not in data:
            return {"message": "No task provided"}, 400
        task_description = data["task"]
        new_task = Task(description=task_description)
        try:
            db.session.add(new_task)
            db.session.commit()
            app.logger.info(f"Task added: {task_description}")

            # Log the contents of the database
            tasks = Task.query.all()
            tasks_info = [{"id": task.id, "description": task.description} for task in tasks]
            app.logger.info(f"Current tasks in the database: {tasks_info}")

            return {"message": f"Task added: {task_description}"}, 201
        except Exception as e:
            app.logger.exception("Error occurred while adding a task.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    def delete(self, task_id):
        task = Task.query.get(task_id)
        if task is None:
            return {"message": "Task not found"}, 404
        try:
            db.session.delete(task)
            db.session.commit()
            app.logger.info(f"Task deleted: {task_id}")

            # Log the contents of the database
            tasks = Task.query.all()
            tasks_info = [{"id": task.id, "description": task.description} for task in tasks]
            app.logger.info(f"Current tasks in the database: {tasks_info}")

            return {"message": f"Task deleted: {task_id}"}, 200
        except Exception as e:
            app.logger.exception("Error occurred while deleting a task.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

# Add the resources to the API
api.add_resource(Message, "/api/hello")
api.add_resource(TaskResource, "/api/task", "/api/task/<int:task_id>")

# Log all incoming requests
@app.before_request
def log_request_info():
    request.start_time = time.time()
    if request.is_json:
        app.logger.debug(f"Request: {request.method} {request.path} - Body: {request.get_json()}")
    else:
        app.logger.debug(f"Request: {request.method} {request.path} - Non-JSON request")

# Log all outgoing responses
@app.after_request
def log_response_info(response):
    duration = time.time() - request.start_time
    app.logger.debug(f"Response: {response.status} - Duration: {duration:.3f}s")
    return response

# Function to initialize the application
def initialize_app():
    with app.app_context():
        try:
            # Create database tables for all models
            db.create_all()
            app.logger.info(f"Connected to: {app.config['SQLALCHEMY_DATABASE_URI']}")
            inspector = inspect(db.engine)
            tables = inspector.get_table_names(schema='public')
            app.logger.info(f"Tables in the database: {tables}")
        except Exception as e:
            app.logger.error("Error during table creation", exc_info=e)

# Call the initialize_app function to set up the database
initialize_app()

# Run the Flask development server (only if running this script directly)
if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
