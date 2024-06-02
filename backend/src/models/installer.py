from app import db

class Installer(db.Model):
    __tablename__ = "installers"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    contact_email = db.Column(db.String(255), nullable=False)
    contact_phone = db.Column(db.String(20))
    contact_agent = db.Column(db.String(255))