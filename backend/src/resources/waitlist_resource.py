from flask import request
from flask_restful import Resource

from app import db
from src.models.waitlist import Waitlist
from app import app


class WaitlistResource(Resource):
    def get(self, waitlist_id=None):
        if waitlist_id:
            waitlist = Waitlist.query.get(waitlist_id)
            if not waitlist:
                return {"message": "Waitlist entry not found"}, 404
            return {
                "id": waitlist.id,
                "name": waitlist.name,
                "contact_email": waitlist.contact_email,
                "contact_phone": waitlist.contact_phone,
                "location": waitlist.location,
                "service_interest": waitlist.service_interest,
            }
        else:
            waitlists = Waitlist.query.all()
            return [
                {
                    "id": waitlist.id,
                    "name": waitlist.name,
                    "contact_email": waitlist.contact_email,
                    "contact_phone": waitlist.contact_phone,
                    "location": waitlist.location,
                    "service_interest": waitlist.service_interest,
                    
                }
                for waitlist in waitlists
            ]

    def post(self):
        data = request.get_json()
        required_fields = {"service_interest", "location", "contact_email", "contact_phone"}
        missing_fields = required_fields - set(data.keys())
        if missing_fields:
            message = f"Missing required fields: {', '.join(missing_fields)}"
            return {"message": message}, 400
        new_waitlist = Waitlist(
            name=data["name"],
            contact_email=data["contact_email"],
            contact_phone=data.get("contact_phone"),
            location=data.get("location"),
            service_interest=data.get("service_interest"),
        )
        try:
            db.session.add(new_waitlist)
            db.session.commit()
            return {"message": "Waitlist entry created", "waitlist_id": new_waitlist.id}, 201
        except Exception as e:
            app.logger.exception("Error occurred while creating an waitlist.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    def put(self, waitlist_id):
        waitlist = Waitlist.query.get(waitlist_id)
        if not waitlist:
            return {"message": "Waitlist entry not found"}, 404
        data = request.get_json()
        if not data:
            return {"message": "Invalid data"}, 400
        waitlist.name = data.get("name", waitlist.name)
        waitlist.contact_email = data.get("contact_email", waitlist.contact_email)
        waitlist.contact_phone = data.get("contact_phone", waitlist.contact_phone)
        waitlist.location = data.get("location", waitlist.location)
        waitlist.service_interest = data.get("service_interest", waitlist.service_interest)
        try:
            db.session.commit()
            return {"message": "Waitlist entry updated"}, 200
        except Exception as e:
            app.logger.exception("Error occurred while updating the waitlist.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    def delete(self, waitlist_id):
        waitlist = Waitlist.query.get(waitlist_id)
        if not waitlist:
            return {"message": "Waitlist entry not found"}, 404
        try:
            db.session.delete(waitlist)
            db.session.commit()
            return {"message": "Waitlist deleted"}, 200
        except Exception as e:
            app.logger.exception("Error occurred while deleting the waitlist.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500
