from src.utils.connection import db

class FinancingOption(db.Model):
    __tablename__ = "financing_options"
    id = db.Column(db.Integer, primary_key=True)
    option_name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)

