from flask import Flask, request
from flask_restful import reqparse, Api, Resource

app = Flask(__name__)
api = Api(app)


class Message(Resource):
    def get(self):
        return {"message": "Hello World!"}


class Task(Resource):
    def get(self):
        return {"tasks": "List of tasks"}

    def post(self):
        data = request.get_json()  # Parses the JSON data
        if not data or "task" not in data:
            return {"message": "No task provided"}, 400
        task_description = data["task"]
        return {"message": f"Task added: {task_description}"}, 201


api.add_resource(Message, "/api/hello")
api.add_resource(Task, "/api/task")


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
