import requests
from app import db, app
from src.models.solar_data import SolarData

SOLAR_API_BASE_URL = "https://solar.googleapis.com/v1"

def fetch_solar_data(api_key, latitude, longitude):
    headers = {"Authorization": f"Bearer {api_key}"}
    
    # Fetch building insights
    building_insights_url = f"{SOLAR_API_BASE_URL}/buildingInsights:findClosest?location.latitude={latitude}&location.longitude={longitude}&key={api_key}"
    building_insights_response = requests.get(building_insights_url)
    
    if building_insights_response.status_code != 200:
        raise Exception(f"Failed to fetch building insights: {building_insights_response.text}")
    
    try:
        building_insights = building_insights_response.json()
    except ValueError as e:
        raise Exception(f"Failed to parse building insights response: {e}")

    data_layers_url = f"{SOLAR_API_BASE_URL}/dataLayers:get"
    data_layers_params = {
        "location.latitude": latitude,
        "location.longitude": longitude,
        "radiusMeters": 100,
        "view": "IMAGERY_AND_ANNUAL_FLUX_LAYERS",
        "key": api_key
    }
    data_layers_response = requests.get(data_layers_url, params=data_layers_params)
    
    if data_layers_response.status_code != 200:
        raise Exception(f"Failed to fetch data layers: {data_layers_response.text}")
    
    try:
        data_layers = data_layers_response.json()
    except ValueError as e:
        raise Exception(f"Failed to parse data layers response: {e}")
    
    return building_insights, data_layers

def get_or_create_solar_data(api_key, project_id, address, latitude, longitude):
    # Check if the data already exists in the database
    solar_data = SolarData.query.filter_by(project_id=project_id).first()
    if solar_data:
        app.logger.info(f"Fetching solar data for project_id={project_id} from database.")
        return solar_data.to_dict()
    
    # Fetch data from the API if not present in the database
    app.logger.info(f"Fetching solar data for project_id={project_id} from API.")
    building_insights, data_layers = fetch_solar_data(api_key, latitude, longitude)
    
    # Store the new data in the database
    new_solar_data = SolarData(
        project_id=project_id,
        address=address,
        latitude=latitude,
        longitude=longitude,
        building_insights=building_insights,
        data_layers=data_layers
    )
    
    db.session.add(new_solar_data)
    db.session.commit()
    
    return new_solar_data.to_dict()
