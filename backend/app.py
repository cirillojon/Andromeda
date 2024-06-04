from flask import Flask, request
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect
from dotenv import load_dotenv

import logging
from logging.handlers import TimedRotatingFileHandler
import time
import sys
import os

# Load environment variables from .env file
load_dotenv()

# Initialize Flask application
app = Flask(__name__)

# Configure the SQLAlchemy part of the app instance using environment variables
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

if __name__ != "__main__":
    gunicorn_logger = logging.getLogger("gunicorn.error")
    if len(gunicorn_logger.handlers) > 0:
        gunicorn_logger.removeHandler(gunicorn_logger.handlers[0])
    
    formatter = logging.Formatter('[%(asctime)s] [PID %(process)d] %(levelname)s: %(message)s')

    c_handler = logging.StreamHandler(stream=sys.stdout)
    c_handler.setLevel(logging.INFO)
    c_handler.setFormatter(formatter)

    f_handler = TimedRotatingFileHandler(filename=f"/etc/logs/{os.getpid()}-gunicorn-worker", when="d", interval=1)
    f_handler.setLevel(logging.INFO)
    f_handler.setFormatter(formatter)

    gunicorn_logger.addHandler(f_handler)
    gunicorn_logger.addHandler(c_handler)

    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)

db = SQLAlchemy()

# Not a fan but removes half initialization/early reference error 
# Importing models for db to initialize tables
from src.models.financing_details import FinancingDetail
from src.models.financing_options import FinancingOption
from src.models.installer import Installer
from src.models.form import Form, FormData
from src.models.project_step import ProjectStep
from src.models.project import Project
from src.models.task import Task
from src.models.user import User

from src.resources.financing_detail_resource import FinancingDetailResource
from src.resources.financing_option_resource import FinancingOptionResource
from src.resources.form_data_resource import FormDataResource
from src.resources.form_resource import FormResource
from src.resources.hello_resource import HelloResource
from src.resources.installer_resource import InstallerResource
from src.resources.project_resource import ProjectResource
from src.resources.project_step_resource import ProjectStepResource
from src.resources.task_resource import TaskResource
from src.resources.user_resource import UserResource

# initialization of db before continuing running server
with app.app_context():
    try:
        # Create database tables for all models
        db.init_app(app)
        db.create_all()
        app.logger.info(f"Connected to: {app.config['SQLALCHEMY_DATABASE_URI']}")
        inspector = inspect(db.engine)
        tables = inspector.get_table_names(schema="public")
        app.logger.info(f"Tables in the database: {tables}")
    except Exception as e:
        app.logger.error(f"Failed trying to creating all for Worker {os.getpid()}")
        app.logger.error("Error during table creation", exc_info=e)

# Initialize migrate
migrate = Migrate(app, db)

# Initialize Flask-RESTful API
api = Api(app)

# Add the resources to the API
api.add_resource(HelloResource, "/api/hello")
api.add_resource(TaskResource, "/api/task", "/api/task/<int:task_id>")
api.add_resource(UserResource, "/api/user", "/api/user/<string:sso_token>")
api.add_resource(
    FormResource,
    "/api/form",
    "/api/form/<int:form_id>",
    "/api/forms/user/<int:user_id>",
)
api.add_resource(FormDataResource, "/api/form_data", "/api/form_data/<int:form_id>")
api.add_resource(ProjectResource, "/api/project", "/api/project/user/<int:user_id>", "/api/project/<int:project_id>")
api.add_resource(FinancingOptionResource, "/api/financing_option", "/api/financing_option/<int:option_id>")
api.add_resource(FinancingDetailResource, "/api/financing_detail", "/api/financing_detail/project/<int:project_id>")
api.add_resource(InstallerResource, "/api/installer", "/api/installer/<int:installer_id>")
api.add_resource(ProjectStepResource, "/api/project_step", "/api/project_step/<int:step_id>")


# Log all incoming requests
@app.before_request
def log_request_info():
    request.start_time = time.time()
    if request.is_json:
        app.logger.debug(
            f"Request: {request.method} {request.path} - Body: {request.get_json()}"
        )
    else:
        app.logger.debug(f"Request: {request.method} {request.path} - Non-JSON request")


# Log all outgoing responses
@app.after_request
def log_response_info(response):
    duration = time.time() - request.start_time
    text = f"Response: {response.status} - Duration: {duration:.3f}s"
    
    if response.status_code >= 400:
        app.logger.error(text)
    else:
        app.logger.info(text)
        
    return response


if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    app.run(host="0.0.0.0", debug=True)
