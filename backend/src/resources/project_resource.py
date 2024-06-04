from flask import request
from flask_restful import Resource

from app import db
from src.models.project import Project
from src.models.financing_details import FinancingDetail
from app import app


class ProjectResource(Resource):
    def get(self, user_id=None, project_id=None):
        try:
            if user_id:
                projects = Project.query.filter_by(user_id=user_id).all()
                if not projects:
                    return {"message": "No projects found for user"}, 404
                return [project.to_dict() for project in projects]
            elif project_id:
                project = Project.query.get(project_id)
                if not project:
                    return {"message": "Project not found"}, 404
                return project.to_dict()
            else:
                return {"message": "User ID or Project ID not provided"}, 400
        except Exception as e:
            app.logger.exception("Error occurred while fetching project(s).")
            return {"message": "Internal server error"}, 500

    def post(self):
        data = request.get_json()
        required_fields = {"project_name", "project_type", "financing_detail", "user_id"}
        missing_fields = required_fields - set(data.keys())
        if missing_fields:
            return {"message": f"Missing required fields: {', '.join(missing_fields)}"}, 400

        try:
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
                hvac_details=data.get("hvac_details"),
                house_sqft=data.get("house_sqft"),
                solar_electric_bill_kwh=data.get("solar_electric_bill_kwh"),
                solar_panel_amount=data.get("solar_panel_amount"),
                solar_panel_wattage=data.get("solar_panel_wattage"),
                solar_yearly_kwh=data.get("solar_yearly_kwh"),
                solar_battery_type=data.get("solar_battery_type"),
                solar_microinverter=data.get("solar_microinverter"),
                roof_angle=data.get("roof_angle"),
                roof_current_type=data.get("roof_current_type"),
                roof_new_type=data.get("roof_new_type"),
                roof_current_health=data.get("roof_current_health"),
            )
            db.session.add(new_project)
            db.session.commit()

            if "financing_detail" in data:
                financing_data = data["financing_detail"]
                new_detail = FinancingDetail(
                    user_id=new_project.user_id,
                    financing_option_id=financing_data.get("financing_option_id"),
                    project_id=new_project.id,
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
        try:
            project = Project.query.get(project_id)
            if not project:
                return {"message": "Project not found"}, 404

            data = request.get_json()
            if not data:
                return {"message": "Invalid data"}, 400

            for key, value in data.items():
                if hasattr(project, key):
                    setattr(project, key, value)

            db.session.commit()
            return {"message": "Project updated"}, 200
        except Exception as e:
            app.logger.exception("Error occurred while updating the project.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    def delete(self, project_id):
        try:
            project = Project.query.get(project_id)
            if not project:
                return {"message": "Project not found"}, 404

            db.session.delete(project)
            db.session.commit()
            return {"message": "Project deleted"}, 200
        except Exception as e:
            app.logger.exception("Error occurred while deleting the project.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500
