from app import db
from sqlalchemy.dialects.postgresql import JSONB

class SolarData(db.Model):
    __tablename__ = "solar_data"
    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(255), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    building_insights = db.Column(JSONB, nullable=False)
    data_layers = db.Column(JSONB, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "address": self.address,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "building_insights": self.building_insights,
            "data_layers": self.data_layers,
            "created_at": self.created_at.isoformat(),
        }
