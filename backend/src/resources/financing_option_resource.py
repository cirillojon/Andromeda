from flask import request
from flask_restful import Resource

from src.utils.connection import db
from src.models.financing_options import FinancingOption
from app import app


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
