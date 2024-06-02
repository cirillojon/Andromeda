from flask import request
from flask_restful import Resource

from src.utils.json import json_serial
from src.utils.connection import db
from src.models.form import FormData
from app import app

from datetime import datetime


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
