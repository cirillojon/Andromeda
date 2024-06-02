from flask import request
from flask_restful import Resource

from src.utils.json import safe_json_serial
from src.utils.connection import db
from src.models.project import Project
from src.models.financing_details import FinancingDetail
from app import app


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
