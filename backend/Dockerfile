# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code into the container
COPY . .

RUN mkdir /etc/logs

# Expose the port the app runs on
EXPOSE 5000

ENTRYPOINT [ "gunicorn", "app:app" ]
