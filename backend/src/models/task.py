from app import db

class Task(db.Model):
    __tablename__ = "task"
    __table_args__ = {"schema": "public"}
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
