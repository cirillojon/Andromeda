from app import db

class Project(db.Model):
    __tablename__ = "projects"
    id = db.Column(db.Integer, primary_key=True)
    project_name = db.Column(db.String(255), nullable=False)
    project_address = db.Column(db.String(255))
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