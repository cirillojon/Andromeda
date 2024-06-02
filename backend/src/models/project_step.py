from app import db

class ProjectStep(db.Model):
    __tablename__ = "project_steps"
    id = db.Column(db.Integer, primary_key=True)
    installer_id = db.Column(db.Integer, db.ForeignKey("installers.id"))
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"))
    progress_step = db.Column(db.String(255), nullable=False)
    step_date = db.Column(db.Date)
