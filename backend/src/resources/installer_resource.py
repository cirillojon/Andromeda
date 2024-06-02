from flask import request
from flask_restful import Resource

from src.utils.connection import db
from src.models.installer import Installer
from app import app


class InstallerResource(Resource):
    def get(self, installer_id=None):
        if installer_id:
            installer = Installer.query.get(installer_id)
            if not installer:
                return {"message": "Installer not found"}, 404
            return {
                "id": installer.id,
                "name": installer.name,
                "contact_email": installer.contact_email,
                "contact_phone": installer.contact_phone,
                "contact_agent": installer.contact_agent,
            }
        else:
            installers = Installer.query.all()
            return [
                {
                    "id": installer.id,
                    "name": installer.name,
                    "contact_email": installer.contact_email,
                    "contact_phone": installer.contact_phone,
                    "contact_agent": installer.contact_agent,
                }
                for installer in installers
            ]

    def post(self):
        data = request.get_json()
        if not data or "name" not in data or "contact_email" not in data:
            return {"message": "Invalid data"}, 400
        new_installer = Installer(
            name=data["name"],
            contact_email=data["contact_email"],
            contact_phone=data.get("contact_phone"),
            contact_agent=data.get("contact_agent"),
        )
        try:
            db.session.add(new_installer)
            db.session.commit()
            return {"message": "Installer created", "installer_id": new_installer.id}, 201
        except Exception as e:
            app.logger.exception("Error occurred while creating an installer.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    def put(self, installer_id):
        installer = Installer.query.get(installer_id)
        if not installer:
            return {"message": "Installer not found"}, 404
        data = request.get_json()
        if not data:
            return {"message": "Invalid data"}, 400
        installer.name = data.get("name", installer.name)
        installer.contact_email = data.get("contact_email", installer.contact_email)
        installer.contact_phone = data.get("contact_phone", installer.contact_phone)
        installer.contact_agent = data.get("contact_agent", installer.contact_agent)
        try:
            db.session.commit()
            return {"message": "Installer updated"}, 200
        except Exception as e:
            app.logger.exception("Error occurred while updating the installer.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    def delete(self, installer_id):
        installer = Installer.query.get(installer_id)
        if not installer:
            return {"message": "Installer not found"}, 404
        try:
            db.session.delete(installer)
            db.session.commit()
            return {"message": "Installer deleted"}, 200
        except Exception as e:
            app.logger.exception("Error occurred while deleting the installer.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500
