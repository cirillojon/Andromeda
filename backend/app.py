from flask import Flask, request
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect
from datetime import datetime, date
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

# Create the SQLAlchemy db instance
db = SQLAlchemy(app)

# Initialize migrate
migrate = Migrate(app, db)

# Initialize Flask-RESTful API
api = Api(app)

# Set up logging for the application
if __name__ != "__main__":
    gunicorn_logger = logging.getLogger("gunicorn.error")
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    c_handler = logging.StreamHandler(stream=sys.stdout)
    c_handler.setLevel(logging.INFO)
    c_handler.setFormatter(formatter)

    f_handler = TimedRotatingFileHandler(filename=f"/etc/logs/{os.getpid()}-gunicorn-worker", when="d", interval=1)
    f_handler.setLevel(logging.INFO)
    f_handler.setFormatter(formatter)

    gunicorn_logger.addHandler(f_handler)
    gunicorn_logger.addHandler(c_handler)

    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(logging.DEBUG)
else:
    logging.basicConfig(level=logging.DEBUG)


# Define a helper function for JSON serialization
def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""
    if obj is None:
        return None
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError("Type %s not serializable" % type(obj))

def safe_json_serial(obj):
    try:
        return json_serial(obj)
    except TypeError:
        return None

# Define the Task model
class Task(db.Model):
    __tablename__ = "task"
    __table_args__ = {"schema": "public"}
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)


# Define a resource for interacting with the Task model
class TaskResource(Resource):
    def get(self):
        tasks = Task.query.all()
        return {
            "tasks": [
                {"id": task.id, "description": task.description} for task in tasks
            ]
        }

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
            tasks_info = [
                {"id": task.id, "description": task.description} for task in tasks
            ]
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
            tasks_info = [
                {"id": task.id, "description": task.description} for task in tasks
            ]
            app.logger.info(f"Current tasks in the database: {tasks_info}")

            return {"message": f"Task deleted: {task_id}"}, 200
        except Exception as e:
            app.logger.exception("Error occurred while deleting a task.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    def put(self, task_id):
        task = Task.query.get(task_id)
        if task is None:
            return {"message": "Task not found"}, 404
        data = request.get_json()
        if not data or "task" not in data:
            return {"message": "No task provided"}, 400
        task_description = data["task"]
        try:
            task.description = task_description
            db.session.commit()
            app.logger.info(f"Task updated: {task_id} - {task_description}")

            # Log the contents of the database
            tasks = Task.query.all()
            tasks_info = [
                {"id": task.id, "description": task.description} for task in tasks
            ]
            app.logger.info(f"Current tasks in the database: {tasks_info}")

            return {"message": f"Task updated: {task_id}"}, 200
        except Exception as e:
            app.logger.exception("Error occurred while updating a task.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500


class Project(db.Model):
    __tablename__ = "projects"
    id = db.Column(db.Integer, primary_key=True)
    project_name = db.Column(db.String(255), nullable=False)
    project_address = db.Column(db.String(255))
    project_type = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    installer_id = db.Column(db.Integer, db.ForeignKey("installers.id"))
    site_survey_date = db.Column(db.Date)
    inspection_date = db.Column(db.Date)
    install_start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    status = db.Column(db.String(50))
    financing_type_id = db.Column(db.Integer, db.ForeignKey("financing_options.id"))
    financing_detail_id = db.Column(db.Integer, db.ForeignKey("financing_details.id"), nullable=True)
    financing_detail = db.relationship(
        "FinancingDetail",
        foreign_keys=[financing_detail_id],
        backref="project",
        cascade="all, delete-orphan",  # This enables cascading deletes
        single_parent=True
    )
class ProjectResource(Resource):
    def get(self, user_id=None, project_id=None):
        if user_id:
            projects = Project.query.filter_by(user_id=user_id).all()
            if not projects:
                return {"message": "No projects found for user"}, 404
            return [
                {
                    "id": project.id,
                    "project_name": project.project_name,
                    "project_address": project.project_address,
                    "project_type": project.project_type,
                    "user_id": project.user_id,
                    "installer_id": project.installer_id,
                    "site_survey_date": safe_json_serial(project.site_survey_date),
                    "inspection_date": safe_json_serial(project.inspection_date),
                    "install_start_date": safe_json_serial(project.install_start_date),
                    "end_date": safe_json_serial(project.end_date),
                    "status": project.status,
                    "financing_type_id": project.financing_type_id,
                    "financing_detail": {
                        "id": project.financing_detail.id,
                        "total_cost": str(project.financing_detail.total_cost),
                        "monthly_cost": str(project.financing_detail.monthly_cost),
                        "down_payment": str(project.financing_detail.down_payment),
                        "total_contribution": str(project.financing_detail.total_contribution),
                        "remaining_balance": str(project.financing_detail.remaining_balance),
                        "interest_rate": str(project.financing_detail.interest_rate),
                        "payment_status": project.financing_detail.payment_status,
                        "payment_due_date": safe_json_serial(project.financing_detail.payment_due_date),
                        "duration": project.financing_detail.duration,
                    } if project.financing_detail else None,
                }
                for project in projects
            ]
        elif project_id:
            project = Project.query.get(project_id)
            if not project:
                return {"message": "Project not found"}, 404
            return {
                "id": project.id,
                "project_name": project.project_name,
                "project_address": project.project_address,
                "project_type": project.project_type,
                "user_id": project.user_id,
                "installer_id": project.installer_id,
                "site_survey_date": safe_json_serial(project.site_survey_date),
                "inspection_date": safe_json_serial(project.inspection_date),
                "install_start_date": safe_json_serial(project.install_start_date),
                "end_date": safe_json_serial(project.end_date),
                "status": project.status,
                "financing_type_id": project.financing_type_id,
                "financing_detail": {
                    "id": project.financing_detail.id,
                    "total_cost": str(project.financing_detail.total_cost),
                    "monthly_cost": str(project.financing_detail.monthly_cost),
                    "down_payment": str(project.financing_detail.down_payment),
                    "total_contribution": str(project.financing_detail.total_contribution),
                    "remaining_balance": str(project.financing_detail.remaining_balance),
                    "interest_rate": str(project.financing_detail.interest_rate),
                    "payment_status": project.financing_detail.payment_status,
                    "payment_due_date": safe_json_serial(project.financing_detail.payment_due_date),
                    "duration": project.financing_detail.duration,
                } if project.financing_detail else None,
            }
        else:
            return {"message": "User ID or Project ID not provided"}, 400

    def post(self):
        data = request.get_json()
        if not data or "project_name" not in data or "project_type" not in data:
            return {"message": "Invalid data"}, 400

        new_project = Project(
            project_name=data["project_name"],
            project_address=data.get("project_address"),
            project_type=data["project_type"],
            user_id=data.get("user_id"),
            installer_id=data.get("installer_id"),
            site_survey_date=data.get("site_survey_date"),
            inspection_date=data.get("inspection_date"),
            install_start_date=data.get("install_start_date"),
            end_date=data.get("end_date"),
            status=data.get("status"),
            financing_type_id=data.get("financing_type_id"),
        )

        if "financing_detail" in data:
            financing_data = data["financing_detail"]
            new_detail = FinancingDetail(
                user_id=new_project.user_id,
                financing_option_id=financing_data.get("financing_option_id"),
                project_id=new_project.id,  # This will be set after committing the project
                total_cost=financing_data.get("total_cost"),
                monthly_cost=financing_data.get("monthly_cost"),
                down_payment=financing_data.get("down_payment"),
                total_contribution=financing_data.get("total_contribution"),
                remaining_balance=financing_data.get("remaining_balance"),
                interest_rate=financing_data.get("interest_rate"),
                payment_status=financing_data.get("payment_status"),
                payment_due_date=financing_data.get("payment_due_date"),
                duration=financing_data.get("duration"),
            )

        try:
            db.session.add(new_project)
            db.session.commit()
            
            if "financing_detail" in data:
                new_detail.project_id = new_project.id  # Set project_id after project commit
                db.session.add(new_detail)
                db.session.commit()
                new_project.financing_detail_id = new_detail.id
                db.session.commit()
            
            return {"message": "Project created", "project_id": new_project.id}, 201
        except Exception as e:
            app.logger.exception("Error occurred while creating a project.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    def put(self, project_id):
        project = Project.query.get(project_id)
        if not project:
            return {"message": "Project not found"}, 404
        data = request.get_json()
        if not data:
            return {"message": "Invalid data"}, 400
        project.project_name = data.get("project_name", project.project_name)
        project.project_address = data.get("project_address", project.project_address)
        project.project_type = data.get("project_type", project.project_type)
        project.user_id = data.get("user_id", project.user_id)
        project.installer_id = data.get("installer_id", project.installer_id)
        project.site_survey_date = data.get("site_survey_date", project.site_survey_date)
        project.inspection_date = data.get("inspection_date", project.inspection_date)
        project.install_start_date = data.get("install_start_date", project.install_start_date)
        project.end_date = data.get("end_date", project.end_date)
        project.status = data.get("status", project.status)
        project.financing_type_id = data.get("financing_type_id", project.financing_type_id)
        try:
            db.session.commit()
            return {"message": "Project updated"}, 200
        except Exception as e:
            app.logger.exception("Error occurred while updating the project.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    def delete(self, project_id):
        project = Project.query.get(project_id)
        if not project:
            return {"message": "Project not found"}, 404
        try:
            db.session.delete(project)
            db.session.commit()
            return {"message": "Project deleted"}, 200
        except Exception as e:
            app.logger.exception("Error occurred while deleting the project.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500


class FinancingOption(db.Model):
    __tablename__ = "financing_options"
    id = db.Column(db.Integer, primary_key=True)
    option_name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)


class FinancingOptionResource(Resource):
    def get(self, option_id=None):
        if option_id:
            option = FinancingOption.query.get(option_id)
            if not option:
                return {"message": "Financing option not found"}, 404
            return {
                "id": option.id,
                "option_name": option.option_name,
                "description": option.description,
            }
        else:
            options = FinancingOption.query.all()
            return [
                {
                    "id": option.id,
                    "option_name": option.option_name,
                    "description": option.description,
                }
                for option in options
            ]

    def post(self):
        data = request.get_json()
        if not data or "option_name" not in data:
            return {"message": "Invalid data"}, 400
        new_option = FinancingOption(
            option_name=data["option_name"], description=data.get("description")
        )
        try:
            db.session.add(new_option)
            db.session.commit()
            return {"message": "Financing option created", "option_id": new_option.id}, 201
        except Exception as e:
            app.logger.exception("Error occurred while creating a financing option.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    def put(self, option_id):
        option = FinancingOption.query.get(option_id)
        if not option:
            return {"message": "Financing option not found"}, 404
        data = request.get_json()
        if not data:
            return {"message": "Invalid data"}, 400
        option.option_name = data.get("option_name", option.option_name)
        option.description = data.get("description", option.description)
        try:
            db.session.commit()
            return {"message": "Financing option updated"}, 200
        except Exception as e:
            app.logger.exception("Error occurred while updating the financing option.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    def delete(self, option_id):
        option = FinancingOption.query.get(option_id)
        if not option:
            return {"message": "Financing option not found"}, 404
        try:
            db.session.delete(option)
            db.session.commit()
            return {"message": "Financing option deleted"}, 200
        except Exception as e:
            app.logger.exception("Error occurred while deleting the financing option.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500


class FinancingDetail(db.Model):
    __tablename__ = "financing_details"
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    financing_option_id = db.Column(db.Integer, db.ForeignKey("financing_options.id"))
    total_cost = db.Column(db.Numeric(10, 2))
    monthly_cost = db.Column(db.Numeric(10, 2))
    down_payment = db.Column(db.Numeric(10, 2))
    total_contribution = db.Column(db.Numeric(10, 2))
    remaining_balance = db.Column(db.Numeric(10, 2))
    interest_rate = db.Column(db.Numeric(5, 2))
    payment_status = db.Column(db.String(50))
    payment_due_date = db.Column(db.Date)
    duration = db.Column(db.Integer)  # duration in months or years


class FinancingDetailResource(Resource):
    def get(self, project_id=None):
        if project_id:
            detail = FinancingDetail.query.filter_by(project_id=project_id).first()
            if not detail:
                return {"message": "Financing detail not found"}, 404
            return {
                "id": detail.id,
                "project_id": detail.project_id,
                "user_id": detail.user_id,
                "financing_option_id": detail.financing_option_id,
                "total_cost": str(detail.total_cost),
                "monthly_cost": str(detail.monthly_cost),
                "down_payment": str(detail.down_payment),
                "total_contribution": str(detail.total_contribution),
                "remaining_balance": str(detail.remaining_balance),
                "interest_rate": str(detail.interest_rate),
                "payment_status": detail.payment_status,
                "payment_due_date": json_serial(detail.payment_due_date),
                "duration": detail.duration,
            }
        else:
            details = FinancingDetail.query.all()
            return [
                {
                    "id": detail.id,
                    "project_id": detail.project_id,
                    "user_id": detail.user_id,
                    "financing_option_id": detail.financing_option_id,
                    "total_cost": str(detail.total_cost),
                    "monthly_cost": str(detail.monthly_cost),
                    "down_payment": str(detail.down_payment),
                    "total_contribution": str(detail.total_contribution),
                    "remaining_balance": str(detail.remaining_balance),
                    "interest_rate": str(detail.interest_rate),
                    "payment_status": detail.payment_status,
                    "payment_due_date": json_serial(detail.payment_due_date),
                    "duration": detail.duration,
                }
                for detail in details
            ]

    def post(self):
        data = request.get_json()
        if (
            not data
            or "user_id" not in data
            or "financing_option_id" not in data
            or "project_id" not in data
        ):
            return {"message": "Invalid data"}, 400
        new_detail = FinancingDetail(
            user_id=data["user_id"],
            financing_option_id=data["financing_option_id"],
            project_id=data["project_id"],
            total_cost=data.get("total_cost"),
            monthly_cost=data.get("monthly_cost"),
            down_payment=data.get("down_payment"),
            total_contribution=data.get("total_contribution"),
            remaining_balance=data.get("remaining_balance"),
            interest_rate=data.get("interest_rate"),
            payment_status=data.get("payment_status"),
            payment_due_date=data.get("payment_due_date"),
            duration=data.get("duration"),
        )
        try:
            db.session.add(new_detail)
            db.session.commit()
            return {"message": "Financing detail created", "detail_id": new_detail.id}, 201
        except Exception as e:
            app.logger.exception("Error occurred while creating a financing detail.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    def put(self, project_id):
        try:
            project_id = int(project_id)
        except ValueError:
            return {"message": "Invalid project ID"}, 400

        # Using logger instead of print
        app.logger.info(f"Received request to update project_id: {project_id}")

        detail = FinancingDetail.query.filter_by(project_id=project_id).first()
        if not detail:
            app.logger.warning(f"No financing detail found for project_id: {project_id}")
            return {"message": "Financing detail not found"}, 404

        data = request.get_json()
        if not data:
            return {"message": "Invalid data"}, 400
        
        # Updating fields with received data
        detail.project_id = data.get("project_id", detail.project_id)
        detail.user_id = data.get("user_id", detail.user_id)
        detail.financing_option_id = data.get("financing_option_id", detail.financing_option_id)
        detail.total_cost = data.get("total_cost", detail.total_cost)
        detail.monthly_cost = data.get("monthly_cost", detail.monthly_cost)
        detail.down_payment = data.get("down_payment", detail.down_payment)
        detail.total_contribution = data.get("total_contribution", detail.total_contribution)
        detail.remaining_balance = data.get("remaining_balance", detail.remaining_balance)
        detail.interest_rate = data.get("interest_rate", detail.interest_rate)
        detail.payment_status = data.get("payment_status", detail.payment_status)
        detail.payment_due_date = data.get("payment_due_date", detail.payment_due_date)
        detail.duration = data.get("duration", detail.duration)

        try:
            db.session.commit()
            app.logger.info(f"Financing detail updated successfully for project_id: {project_id}")
            return {"message": "Financing detail updated"}, 200
        except Exception as e:
            app.logger.exception("Error occurred while updating the financing detail.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    def delete(self, project_id):
        detail = FinancingDetail.query.get(project_id)
        if not detail:
            return {"message": "Financing detail not found"}, 404
        try:
            db.session.delete(detail)
            db.session.commit()
            return {"message": "Financing detail deleted"}, 200
        except Exception as e:
            app.logger.exception("Error occurred while deleting the financing detail.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500


class Installer(db.Model):
    __tablename__ = "installers"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    contact_email = db.Column(db.String(255), nullable=False)
    contact_phone = db.Column(db.String(20))
    contact_agent = db.Column(db.String(255))


class InstallerResource(Resource):
    def get(self, installer_id=None):
        if installer_id:
            installer = Installer.query.get(installer_id)
            if not installer:
                return {"message": "Installer not found"}, 404
            return {
                "id": installer.id,
                "name": installer.name,
                "contact_email": installer.contact_email,
                "contact_phone": installer.contact_phone,
                "contact_agent": installer.contact_agent,
            }
        else:
            installers = Installer.query.all()
            return [
                {
                    "id": installer.id,
                    "name": installer.name,
                    "contact_email": installer.contact_email,
                    "contact_phone": installer.contact_phone,
                    "contact_agent": installer.contact_agent,
                }
                for installer in installers
            ]

    def post(self):
        data = request.get_json()
        if not data or "name" not in data or "contact_email" not in data:
            return {"message": "Invalid data"}, 400
        new_installer = Installer(
            name=data["name"],
            contact_email=data["contact_email"],
            contact_phone=data.get("contact_phone"),
            contact_agent=data.get("contact_agent"),
        )
        try:
            db.session.add(new_installer)
            db.session.commit()
            return {"message": "Installer created", "installer_id": new_installer.id}, 201
        except Exception as e:
            app.logger.exception("Error occurred while creating an installer.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    def put(self, installer_id):
        installer = Installer.query.get(installer_id)
        if not installer:
            return {"message": "Installer not found"}, 404
        data = request.get_json()
        if not data:
            return {"message": "Invalid data"}, 400
        installer.name = data.get("name", installer.name)
        installer.contact_email = data.get("contact_email", installer.contact_email)
        installer.contact_phone = data.get("contact_phone", installer.contact_phone)
        installer.contact_agent = data.get("contact_agent", installer.contact_agent)
        try:
            db.session.commit()
            return {"message": "Installer updated"}, 200
        except Exception as e:
            app.logger.exception("Error occurred while updating the installer.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    def delete(self, installer_id):
        installer = Installer.query.get(installer_id)
        if not installer:
            return {"message": "Installer not found"}, 404
        try:
            db.session.delete(installer)
            db.session.commit()
            return {"message": "Installer deleted"}, 200
        except Exception as e:
            app.logger.exception("Error occurred while deleting the installer.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500


class ProjectStep(db.Model):
    __tablename__ = "project_steps"
    id = db.Column(db.Integer, primary_key=True)
    installer_id = db.Column(db.Integer, db.ForeignKey("installers.id"))
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"))
    progress_step = db.Column(db.String(255), nullable=False)
    step_date = db.Column(db.Date)


class ProjectStepResource(Resource):
    def get(self, step_id=None):
        if step_id:
            step = ProjectStep.query.get(step_id)
            if not step:
                return {"message": "Project step not found"}, 404
            return {
                "id": step.id,
                "installer_id": step.installer_id,
                "project_id": step.project_id,
                "progress_step": step.progress_step,
                "step_date": json_serial(step.step_date),
            }
        else:
            steps = ProjectStep.query.all()
            return [
                {
                    "id": step.id,
                    "installer_id": step.installer_id,
                    "project_id": step.project_id,
                    "progress_step": step.progress_step,
                    "step_date": json_serial(step.step_date),
                }
                for step in steps
            ]

    def post(self):
        data = request.get_json()
        if not data or "installer_id" not in data or "project_id" not in data or "progress_step" not in data:
            return {"message": "Invalid data"}, 400
        new_step = ProjectStep(
            installer_id=data["installer_id"],
            project_id=data["project_id"],
            progress_step=data["progress_step"],
            step_date=data.get("step_date"),
        )
        try:
            db.session.add(new_step)
            db.session.commit()
            return {"message": "Project step created", "step_id": new_step.id}, 201
        except Exception as e:
            app.logger.exception("Error occurred while creating a project step.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    def put(self, step_id):
        step = ProjectStep.query.get(step_id)
        if not step:
            return {"message": "Project step not found"}, 404
        data = request.get_json()
        if not data:
            return {"message": "Invalid data"}, 400
        step.installer_id = data.get("installer_id", step.installer_id)
        step.project_id = data.get("project_id", step.project_id)
        step.progress_step = data.get("progress_step", step.progress_step)
        step.step_date = data.get("step_date", step.step_date)
        try:
            db.session.commit()
            return {"message": "Project step updated"}, 200
        except Exception as e:
            app.logger.exception("Error occurred while updating the project step.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    def delete(self, step_id):
        step = ProjectStep.query.get(step_id)
        if not step:
            return {"message": "Project step not found"}, 404
        try:
            db.session.delete(step)
            db.session.commit()
            return {"message": "Project step deleted"}, 200
        except Exception as e:
            app.logger.exception("Error occurred while deleting the project step.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    name = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    sso_token = db.Column(
        db.String(255), unique=True, nullable=True
    )  # nullable initially to handle existing users


# Define the Form model
class Form(db.Model):
    __tablename__ = "forms"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    status = db.Column(
        db.Enum("Pending", "Approved", "Rejected", name="status_type"),
        default="Pending",
    )
    last_modified = db.Column(
        db.DateTime,
        default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp(),
    )
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())


# Define the FormData model
class FormData(db.Model):
    __tablename__ = "form_data"
    id = db.Column(db.Integer, primary_key=True)
    form_id = db.Column(db.Integer, db.ForeignKey("forms.id"), nullable=False)
    data = db.Column(db.JSON, nullable=False)  # Store form data as JSON
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"))
    last_modified = db.Column(
        db.DateTime,
        default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp(),
    )
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())


# Define a simple message resource
class Message(Resource):
    def get(self):
        return {"message": "Hello World!"}


class UserResource(Resource):
    def post(self):
        data = request.get_json()
        if (
            not data
            or "email" not in data
            or "name" not in data
            or "sso_token" not in data
        ):
            return {"message": "Invalid data"}, 400

        # Check if the email already exists
        existing_user = User.query.filter_by(email=data["email"]).first()
        if existing_user:
            return {"message": "Email already exists"}, 409

        new_user = User(
            email=data["email"], name=data["name"], sso_token=data["sso_token"]
        )
        try:
            db.session.add(new_user)
            db.session.commit()
            return {"message": "User created with SSO", "user_id": new_user.id}, 201
        except Exception as e:
            app.logger.exception("Error occurred while creating a user.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    def get(self, sso_token=None):
        if not sso_token:
            return {"message": "SSO token not provided"}, 400
        user = User.query.filter_by(sso_token=sso_token).first()
        if not user:
            return {"message": "User not found"}, 404
        return {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "created_at": json_serial(user.created_at),
        }


class FormResource(Resource):
    def post(self):
        data = request.get_json()
        if not data or "user_id" not in data:
            return {"message": "Invalid data"}, 400
        new_form = Form(user_id=data["user_id"])
        try:
            db.session.add(new_form)
            db.session.commit()
            return {"message": "Form created", "form_id": new_form.id}, 201
        except Exception as e:
            app.logger.exception("Error occurred while creating a form.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    def get(self, form_id=None, user_id=None):
        if form_id:
            form = Form.query.get(form_id)
            if not form:
                return {"message": "Form not found"}, 404
            return {
                "id": form.id,
                "user_id": form.user_id,
                "status": form.status,
                "last_modified": json_serial(form.last_modified),
                "created_at": json_serial(form.created_at),
            }
        elif user_id:
            forms = Form.query.filter_by(user_id=user_id).all()
            if not forms:
                return {"message": "No forms found for user"}, 404
            return [
                {
                    "id": form.id,
                    "status": form.status,
                    "last_modified": json_serial(form.last_modified),
                    "created_at": json_serial(form.created_at),
                }
                for form in forms
            ]
        else:
            return {"message": "Invalid request"}, 400

    def put(self, form_id):
        data = request.get_json()
        if not data or "status" not in data:
            return {"message": "Invalid data"}, 400
        form = Form.query.get(form_id)
        if not form:
            return {"message": "Form not found"}, 404
        try:
            form.status = data["status"]
            db.session.commit()
            return {"message": f"Form status updated to {form.status}"}, 200
        except Exception as e:
            app.logger.exception("Error occurred while updating form status.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500


class FormDataResource(Resource):
    def post(self):
        data = request.get_json()
        if not data or "form_id" not in data or "data" not in data:
            return {"message": "Invalid data"}, 400
        new_form_data = FormData(
            form_id=data["form_id"],
            data=data["data"],
            created_by=data.get("created_by"),
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
        return [
            {
                "id": data.id,
                "data": data.data,
                "created_by": data.created_by,
                "last_modified": json_serial(data.last_modified),
                "created_at": json_serial(data.created_at),
            }
            for data in form_data
        ]

    def put(self, form_data_id):
        data = request.get_json()
        form_data = FormData.query.get(form_data_id)
        if not form_data:
            return {"message": "Form data not found"}, 404
        if not data or "data" not in data:
            return {"message": "Invalid data"}, 400
        form_data.data = data["data"]
        form_data.last_modified = datetime.utcnow()
        try:
            db.session.commit()
            return {"message": "Form data updated"}, 200
        except Exception as e:
            app.logger.exception("Error occurred while updating form data.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    def delete(self, form_data_id):
        form_data = FormData.query.get(form_data_id)
        if not form_data:
            return {"message": "Form data not found"}, 404
        try:
            db.session.delete(form_data)
            db.session.commit()
            return {"message": "Form data deleted"}, 200
        except Exception as e:
            app.logger.exception("Error occurred while deleting form data.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

# Add the resources to the API
api.add_resource(Message, "/api/hello")
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


# Function to initialize the application
def initialize_app():
    with app.app_context():
        try:
            # Create database tables for all models
            db.create_all()
            app.logger.info(f"Connected to: {app.config['SQLALCHEMY_DATABASE_URI']}")
            inspector = inspect(db.engine)
            tables = inspector.get_table_names(schema="public")
            app.logger.info(f"Tables in the database: {tables}")
        except Exception as e:
            app.logger.error(f"Failed trying to creating all for Worker {os.getpid()}")
            app.logger.error("Error during table creation", exc_info=e)

# Call the initialize_app function to set up the database
initialize_app()

# Run the Flask development server (only if running this script directly)
if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
