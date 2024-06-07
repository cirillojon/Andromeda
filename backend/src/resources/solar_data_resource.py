from flask import request
from flask_restful import Resource
from app import app
from src.utils.solar_api import get_or_create_solar_data

class SolarDataResource(Resource):
    def post(self):
        data = request.get_json()
        project_id = data.get("project_id")
        address = data.get("address")
        latitude = data.get("latitude")
        longitude = data.get("longitude")
        
        if not project_id or not address or not latitude or not longitude:
            return {"message": "Missing required parameters"}, 400
        
        api_key = app.config["SOLAR_API_KEY"]
        
        try:
            app.logger.info(f"Processing solar data request for project_id={project_id}, address={address}")
            solar_data = get_or_create_solar_data(api_key, project_id, address, latitude, longitude)
            return solar_data, 200
        except Exception as e:
            app.logger.error(f"Failed to fetch solar data: {e}")
            return {"message": "Internal server error", "error": str(e)}, 500
