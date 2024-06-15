from flask import request
from flask_restful import Resource

from app import db
from src.models.form import Form, FormData
from src.models.project import Project
from src.models.project_step import ProjectStep
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
        user_id = request.args.get('user_id')
        
        # Fetch the latest form data for the user
        form_data_entry = FormData.query.join(Form).filter(Form.user_id == user_id).order_by(FormData.created_at.desc()).first()
        
        if not form_data_entry:
            return {"message": "No form data found for the user"}, 404
        data = form_data_entry.data
        required_fields = {"project_name", "project_type", "user_id", "financing_detail"}

        solar_data = data.get('solar', {})
        roofing_data = data.get('roofing', {})
        battery_data = data.get('battery', {})

        if (solar_data):
            missing_fields = required_fields - set(solar_data.keys())
            empty_fields = [field for field in required_fields if solar_data.get(field) == '']
            if missing_fields or empty_fields:
                if missing_fields:
                    app.logger.info("Solar project data is missing required fields, skipping project creation.")
                if empty_fields:
                    app.logger.info("Solar project data is empty, skipping project creation.")
            else:
                try:
                    new_project = Project(
                        project_name=solar_data["project_name"],
                        project_address=solar_data.get("project_address"),
                        project_type=solar_data["project_type"],
                        user_id=user_id,
                        status=solar_data.get("status"),
                        house_sqft=solar_data.get("house_sqft"),
                        solar_electric_bill_kwh=solar_data.get("solar_electric_bill_kwh"),
                        solar_panel_amount=solar_data.get("solar_panel_amount"),
                        solar_panel_wattage=solar_data.get("solar_panel_wattage"),
                        solar_microinverter=solar_data.get("solar_inverter"),
                    )
                    db.session.add(new_project)
                    db.session.commit()

                    if "financing_detail" in data:
                        financing_data = solar_data["financing_detail"]
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
                    app.logger.info("Created solar project: " + str(new_project.id))
                except Exception as e:
                    app.logger.exception("Error occurred while creating solar a project.")
                    db.session.rollback()
                    return {"message": "Internal server error"}, 500
            
        if (roofing_data):
            missing_fields = required_fields - set(roofing_data.keys())
            empty_fields = [field for field in required_fields if roofing_data.get(field) == '']
            if missing_fields or empty_fields:
                if missing_fields:
                    app.logger.info("Roofing project data is missing required fields, skipping project creation.")
                if empty_fields:
                    app.logger.info("Roofing project data is empty, skipping project creation.")
            else:
                try:
                    new_project = Project(
                        project_name=roofing_data["project_name"],
                        project_address=roofing_data.get("project_address"),
                        project_type=roofing_data["project_type"],
                        user_id=user_id,
                        status=roofing_data.get("status"),
                        house_sqft=roofing_data.get("house_sqft"),
                        roof_angle=data.get("roof_angle"),
                        roof_current_type=roofing_data.get("roof_current_type"),
                        roof_new_type=roofing_data.get("roof_new_type"),
                        roof_current_health=roofing_data.get("roof_current_health"),
                    )
                    db.session.add(new_project)
                    db.session.commit()

                    if "financing_detail" in data:
                        financing_data = roofing_data["financing_detail"]
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
                    app.logger.info("Created roofing project: " + str(new_project.id))
                except Exception as e:
                    app.logger.exception("Error occurred while creating roofing a project.")
                    db.session.rollback()
                    return {"message": "Internal server error"}, 500

        if (battery_data):
            missing_fields = required_fields - set(battery_data.keys())
            empty_fields = [field for field in required_fields if battery_data.get(field) == '']
            if missing_fields or empty_fields:
                if missing_fields:
                    app.logger.info("Battery project data is missing required fields, skipping project creation.")
                if empty_fields:
                    app.logger.info("Battery project data is empty, skipping project creation.")
            else:
                try:
                    app.logger.info("CREATING BATTERY PROJECT BY ACCIDENT")
                    new_project = Project(
                        project_name=battery_data["project_name"],
                        project_address=battery_data.get("project_address"),
                        project_type=battery_data["project_type"],
                        user_id=user_id,
                        status=battery_data.get("status"),
                    )
                    db.session.add(new_project)
                    db.session.commit()

                    if "financing_detail" in data:
                        financing_data = battery_data["financing_detail"]
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
                    app.logger.info("Created battery project: " + str(new_project.id))
                except Exception as e:
                    app.logger.exception("Error occurred while creating battery a project.")
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
            steps = ProjectStep.query.filter_by(project_id=project_id).all()
            if steps:
                return {"message": "Project Steps must be deleted before deleting project"}, 400

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
