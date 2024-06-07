from app import db
from src.utils.json import json_serial, safe_json_serial

class Project(db.Model):
    __tablename__ = "projects"
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    project_name = db.Column(db.String(255), nullable=False)
    project_address = db.Column(db.String(255))
    house_sqft = db.Column(db.Integer)
    project_type = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    installer_id = db.Column(db.Integer, db.ForeignKey("installers.id"))
    site_survey_date = db.Column(db.Date)
    inspection_date = db.Column(db.Date)
    install_start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    status = db.Column(db.String(50))
    financing_type_id = db.Column(db.Integer, db.ForeignKey("financing_options.id"))
    financing_detail_id = db.Column(db.Integer, db.ForeignKey("financing_details.id"), nullable=True)
    hvac_details = db.Column(db.String(255))
    solar_electric_bill_kwh = db.Column(db.Integer)
    solar_panel_amount = db.Column(db.Integer)
    solar_panel_wattage = db.Column(db.Integer)
    solar_yearly_kwh = db.Column(db.Integer)
    solar_battery_type = db.Column(db.String(50))
    solar_microinverter = db.Column(db.String(50))
    roof_angle = db.Column(db.Float)
    roof_current_type = db.Column(db.String(50))
    roof_new_type = db.Column(db.String(50))
    roof_current_health = db.Column(db.String(255))
    
    financing_detail = db.relationship(
        "FinancingDetail",
        foreign_keys=[financing_detail_id],
        backref=db.backref("project", uselist=False),
        cascade="all, delete-orphan",
        single_parent=True
    )

    def to_dict(self):
        return {
            "id": self.id,
            "created_at": json_serial(self.created_at),
            "project_name": self.project_name,
            "project_address": self.project_address,
            "house_sqft": self.house_sqft,
            "project_type": self.project_type,
            "user_id": self.user_id,
            "installer_id": self.installer_id,
            "site_survey_date": safe_json_serial(self.site_survey_date),
            "inspection_date": safe_json_serial(self.inspection_date),
            "install_start_date": safe_json_serial(self.install_start_date),
            "end_date": safe_json_serial(self.end_date),
            "status": self.status,
            "hvac_details": self.hvac_details,
            "solar_electric_bill_kwh": self.solar_electric_bill_kwh,
            "solar_panel_amount": self.solar_panel_amount,
            "solar_panel_wattage": self.solar_panel_wattage,
            "solar_yearly_kwh": self.solar_yearly_kwh,
            "solar_battery_type": self.solar_battery_type,
            "solar_microinverter": self.solar_microinverter,
            "roof_angle": self.roof_angle,
            "roof_current_type": self.roof_current_type,
            "roof_new_type": self.roof_new_type,
            "roof_current_health": self.roof_current_health,
            "financing_type_id": self.financing_type_id,
            "financing_detail": self.financing_detail.to_dict() if self.financing_detail else None,
            "solar_data": self.solar_data.to_dict() if self.solar_data else None
        }
