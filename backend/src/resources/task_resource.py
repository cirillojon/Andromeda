from flask import request
from flask_restful import Resource

from src.utils.connection import db
from src.models.task import Task
from app import app


class TaskResource(Resource):
    def get(self):
        tasks = Task.query.all()
        return {
            "tasks": [
                {"id": task.id, "description": task.description} for task in tasks
            ]
        }

    def post(self):
        data = request.get_json()
        if not data or "task" not in data:
            return {"message": "No task provided"}, 400
        task_description = data["task"]
        new_task = Task(description=task_description)
        try:
            db.session.add(new_task)
            db.session.commit()
            app.logger.info(f"Task added: {task_description}")

            # Log the contents of the database
            tasks = Task.query.all()
            tasks_info = [
                {"id": task.id, "description": task.description} for task in tasks
            ]
            app.logger.info(f"Current tasks in the database: {tasks_info}")

            return {"message": f"Task added: {task_description}"}, 201
        except Exception as e:
            app.logger.exception("Error occurred while adding a task.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    def delete(self, task_id):
        task = Task.query.get(task_id)
        if task is None:
            return {"message": "Task not found"}, 404
        try:
            db.session.delete(task)
            db.session.commit()
            app.logger.info(f"Task deleted: {task_id}")

            # Log the contents of the database
            tasks = Task.query.all()
            tasks_info = [
                {"id": task.id, "description": task.description} for task in tasks
            ]
            app.logger.info(f"Current tasks in the database: {tasks_info}")

            return {"message": f"Task deleted: {task_id}"}, 200
        except Exception as e:
            app.logger.exception("Error occurred while deleting a task.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    def put(self, task_id):
        task = Task.query.get(task_id)
        if task is None:
            return {"message": "Task not found"}, 404
        data = request.get_json()
        if not data or "task" not in data:
            return {"message": "No task provided"}, 400
        task_description = data["task"]
        try:
            task.description = task_description
            db.session.commit()
            app.logger.info(f"Task updated: {task_id} - {task_description}")

            # Log the contents of the database
            tasks = Task.query.all()
            tasks_info = [
                {"id": task.id, "description": task.description} for task in tasks
            ]
            app.logger.info(f"Current tasks in the database: {tasks_info}")

            return {"message": f"Task updated: {task_id}"}, 200
        except Exception as e:
            app.logger.exception("Error occurred while updating a task.")
            db.session.rollback()
            return {"message": "Internal server error"}, 500