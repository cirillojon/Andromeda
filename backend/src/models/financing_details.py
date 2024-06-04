from app import db
from src.utils.json import safe_json_serial

class FinancingDetail(db.Model):
    __tablename__ = "financing_details"
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id", ondelete="CASCADE"))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    financing_option_id = db.Column(db.Integer, db.ForeignKey("financing_options.id"))
    total_cost = db.Column(db.Numeric(10, 2))
    monthly_cost = db.Column(db.Numeric(10, 2))
    down_payment = db.Column(db.Numeric(10, 2))
    total_contribution = db.Column(db.Numeric(10, 2))
    remaining_balance = db.Column(db.Numeric(10, 2))
    interest_rate = db.Column(db.Numeric(5, 2))
    payment_status = db.Column(db.String(50))
    payment_due_date = db.Column(db.Date)
    duration = db.Column(db.Integer)  # duration in months or years

    def to_dict(self):
        return {
            "id": self.id,
            "total_cost": str(self.total_cost),
            "monthly_cost": str(self.monthly_cost),
            "down_payment": str(self.down_payment),
            "total_contribution": str(self.total_contribution),
            "remaining_balance": str(self.remaining_balance),
            "interest_rate": str(self.interest_rate),
            "payment_status": self.payment_status,
            "payment_due_date": safe_json_serial(self.payment_due_date),
            "duration": self.duration,
        }
