from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
import logging
from sqlalchemy import inspect, text
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

# Define the PostgreSQL enum type for status
def create_status_enum():
    with db.engine.connect() as conn:
        # Check if the enum type exists
        result = conn.execute(text("SELECT 1 FROM pg_type WHERE typname = 'status_type'")).fetchone()
        if not result:
            # Only create the enum type if it does not exist
            try:
                conn.execute(text("CREATE TYPE status_type AS ENUM ('Pending', 'Approved', 'Rejected')"))
            except Exception as e:
                app.logger.error("Error creating enum type: %s", e)

# Define the User model
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    name = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

# Define the Form model
class Form(db.Model):
    __tablename__ = 'forms'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.Enum('Pending', 'Approved', 'Rejected', name='status_type'), default='Pending')
    last_modified = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

# Define the FormData model
class FormData(db.Model):
    __tablename__ = 'form_data'
    id = db.Column(db.Integer, primary_key=True)
    form_id = db.Column(db.Integer, db.ForeignKey('forms.id'), nullable=False)
    field_name = db.Column(db.String(255), nullable=False)
    field_value = db.Column(db.Text, nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    last_modified = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

# Initialize Flask-RESTful API
api = Api(app)

# Define a simple message resource
class Message(Resource):
    def get(self):
        return {"message": "Hello World!"}

# Define a resource for interacting with the User model
class UserResource(Resource):
    def post(self):
        data = request.get_json()
        if not data or 'email' not in data or 'name' not in data:
            return {"message": "Invalid data"}, 400
        new_user = User(email=data['email'], name=data['name'])
        try:
            db.session.add(new_user)
            db.session.commit()
            return {"message": "User created", "user_id": new_user.id}, 201
        except Exception as e:
            app.logger.exception("Error occurred while creating a user.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    def get(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {"message": "User not found"}, 404
        return {"id": user.id, "email": user.email, "name": user.name, "created_at": user.created_at}

# Define a resource for interacting with the Form model
class FormResource(Resource):
    def post(self):
        data = request.get_json()
        if not data or 'user_id' not in data:
            return {"message": "Invalid data"}, 400
        new_form = Form(user_id=data['user_id'])
        try:
            db.session.add(new_form)
            db.session.commit()
            return {"message": "Form created", "form_id": new_form.id}, 201
        except Exception as e:
            app.logger.exception("Error occurred while creating a form.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    def get(self, form_id):
        form = Form.query.get(form_id)
        if not form:
            return {"message": "Form not found"}, 404
        return {
            "id": form.id,
            "user_id": form.user_id,
            "status": form.status,
            "last_modified": form.last_modified,
            "created_at": form.created_at
        }

# Define a resource for interacting with the FormData model
class FormDataResource(Resource):
    def post(self):
        data = request.get_json()
        if not data or 'form_id' not in data or 'field_name' not in data or 'field_value' not in data:
            return {"message": "Invalid data"}, 400
        new_form_data = FormData(
            form_id=data['form_id'],
            field_name=data['field_name'],
            field_value=data['field_value'],
            created_by=data.get('created_by')
        )
        try:
            db.session.add(new_form_data)
            db.session.commit()
            return {"message": "Form data added", "form_data_id": new_form_data.id}, 201
        except Exception as e:
            app.logger.exception("Error occurred while adding form data.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    def get(self, form_id):
        form_data = FormData.query.filter_by(form_id=form_id).all()
        if not form_data:
            return {"message": "No form data found"}, 404
        return [{"id": data.id, "field_name": data.field_name, "field_value": data.field_value, "created_by": data.created_by, "last_modified": data.last_modified, "created_at": data.created_at} for data in form_data]

# Add the resources to the API
api.add_resource(Message, "/api/hello")
api.add_resource(UserResource, "/api/user", "/api/user/<int:user_id>")
api.add_resource(FormResource, "/api/form", "/api/form/<int:form_id>")
api.add_resource(FormDataResource, "/api/form_data", "/api/form_data/<int:form_id>")

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
            # Create status enum type
            create_status_enum()
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