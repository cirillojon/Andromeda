from flask import request
from flask_restful import Resource

from src.utils.json import json_serial
from src.utils.connection import db
from src.models.form import Form
from app import app


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
