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
                return [project.to_dict() for project in projects], 200
            elif project_id:
                project = Project.query.get(project_id)
                if not project:
                    return {"message": "Project not found"}, 404
                return project.to_dict(), 200
            else:
                return {"message": "User ID or Project ID not provided"}, 400
        except Exception as e:
            app.logger.exception("Error occurred while fetching project(s).")
            return {"message": "Internal server error"}, 500

    def post(self):
        user_id = request.args.get("user_id")

        # Fetch the latest form data for the user
        form_data_entry = (
            FormData.query.join(Form)
            .filter(Form.user_id == user_id)
            .order_by(FormData.created_at.desc())
            .first()
        )

        if not form_data_entry:
            return {"message": "No form data found for the user"}, 404

        data = form_data_entry.data
        required_fields = {
            "project_name",
            "project_type",
            "user_id",
            "financing_detail",
        }

        # General data
        general_data = data.get("general", {})

        # Project data types
        project_types = {
            "solar": data.get("solar", {}),
            "roofing": data.get("roofing", {}),
            "battery": data.get("battery", {}),
        }

        for project_type, project_data in project_types.items():
            if project_data:
                self.create_project(
                    project_type, project_data, required_fields, user_id, general_data
                )

        return {"message": "Projects processed successfully"}, 200

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
                return {
                    "message": "Project Steps must be deleted before deleting project"
                }, 400

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

    def create_project(
        self, project_type, project_data, required_fields, user_id, general_data
    ):
        missing_fields = required_fields - set(project_data.keys())
        empty_fields = [
            field for field in required_fields if project_data.get(field) == ""
        ]

        if missing_fields or empty_fields:
            if missing_fields:
                app.logger.info(
                    f"{project_type.capitalize()} project data is missing required fields, skipping project creation."
                )
            if empty_fields:
                app.logger.info(
                    f"{project_type.capitalize()} project data is empty, skipping project creation."
                )
            return

        try:
            # Create a dictionary with the valid fields for the Project model
            project_fields = {
                "project_name": project_data["project_name"],
                "project_type": project_data["project_type"],
                "user_id": user_id,
                "status": "PENDING",
                # General data
                "project_address": general_data.get("project_address"),
                "roof_sqft": general_data.get("roofSqft"),
                "monthly_bill": general_data.get("monthlyBill"),
            }

            # Add specific fields based on the project type
            if project_type == "solar":
                project_fields.update(
                    {
                        "solar_electric_bill_kwh": self.convert_to_none(
                            project_data.get("energyUtilization")
                        ),
                        "solar_panel_amount": project_data.get("panelCount"),
                        "solar_panel_wattage": project_data.get("solar_panel_wattage"),
                        "solar_microinverter": project_data.get("solar_inverter"),
                        "solar_annual_income": self.convert_to_none(
                            project_data.get("annualIncome")
                        ),
                    }
                )
            elif project_type == "roofing":
                project_fields.update(
                    {
                        "roof_angle": project_data.get("roof_angle"),
                        "roof_current_type": project_data.get("currentRoofType"),
                        "roof_new_type": project_data.get("desiredRoofType"),
                        "roof_current_health": project_data.get("roofHealth"),
                        "roof_stories": project_data.get("stories"),
                    }
                )
            elif project_type == "battery":
                project_fields.update(
                    {
                        "battery_current_solar_system_size": project_data.get(
                            "currentSolarSystemSize"
                        ),
                        "battery_expected_usage": project_data.get("expectedUsage"),
                        "battery_number_of_evs": project_data.get("numberOfEVs"),
                        "battery_house_type": project_data.get("houseType"),
                        "battery_ownership": project_data.get("ownership"),
                    }
                )

            new_project = Project(**project_fields)

            db.session.add(new_project)
            db.session.commit()

            # Initialize financing details with null values
            new_detail = FinancingDetail(
                user_id=new_project.user_id,
                financing_option_id=None,
                project_id=new_project.id,
                total_cost=None,
                monthly_cost=None,
                down_payment=None,
                total_contribution=None,
                remaining_balance=None,
                interest_rate=None,
                payment_status=None,
                payment_due_date=None,
                duration=None,
            )

            db.session.add(new_detail)
            db.session.commit()
            new_project.financing_detail_id = new_detail.id
            db.session.commit()

            app.logger.info(f"Created {project_type} project: {new_project.id}")

        except Exception as e:
            app.logger.exception(
                f"Error occurred while creating {project_type} project."
            )
            db.session.rollback()

    def convert_to_none(self, value):
        return None if value == "" else value
