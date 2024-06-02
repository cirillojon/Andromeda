from flask import request
from flask_restful import Resource

from src.utils.json import json_serial
from src.utils.connection import db
from src.models.financing_details import FinancingDetail
from app import app


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

        print(f"Received project_id: {project_id}")
        detail = FinancingDetail.query.filter_by(project_id=project_id).first()
        if not detail:
            print(f"No detail found for project_id: {project_id}")
            return {"message": "Financing detail not found"}, 404

        data = request.get_json()
        if not data:
            return {"message": "Invalid data"}, 400
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