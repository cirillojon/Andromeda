from flask import request
from flask_restful import Resource

from src.utils.json import json_serial
from app import db
from src.models.user import User
from app import app

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
