from app import db

# Define the Form model
class Form(db.Model):
    __tablename__ = "forms"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    status = db.Column(
        db.Enum("Pending", "Approved", "Rejected", name="status_type"),
        default="Pending",
    )
    last_modified = db.Column(
        db.DateTime,
        default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp(),
    )
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())


# Define the FormData model
class FormData(db.Model):
    __tablename__ = "form_data"
    id = db.Column(db.Integer, primary_key=True)
    form_id = db.Column(db.Integer, db.ForeignKey("forms.id"), nullable=False)
    data = db.Column(db.JSON, nullable=False)  # Store form data as JSON
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"))
    last_modified = db.Column(
        db.DateTime,
        default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp(),
    )
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())