from flask_restful import Resource

# Define a simple message resource
class HelloResource(Resource):
    def get(self):
        return {"message": "Hello World!"}