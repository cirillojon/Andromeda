from flask import request
from flask_restful import Resource

from src.utils.json import json_serial
from src.utils.connection import db
from src.models.project_step import ProjectStep
from app import app


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
