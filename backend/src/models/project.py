from app import db

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
    financing_detail = db.relationship(
        "FinancingDetail",
        foreign_keys=[financing_detail_id],
        backref=db.backref("project", uselist=False),
        cascade="all, delete-orphan",
        single_parent=True
    )
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