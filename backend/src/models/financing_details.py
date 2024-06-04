from app import db

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

