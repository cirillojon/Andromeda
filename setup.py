import os
import subprocess
import sys

def create_virtualenv():
    if not os.path.exists('env'):
        print("Creating virtual environment...")
        result = subprocess.call([sys.executable, '-m', 'venv', 'env'])
        if result == 0:
            print("Virtual environment created. Please activate it manually.")
        else:
            print("Failed to create virtual environment.")
            sys.exit(1)
    else:
        print("Virtual environment already exists. Skipping creation.")

def install_python_dependencies():
    print("Installing Python dependencies...")
    if os.name == 'nt':
        pip_executable = os.path.join('env', 'Scripts', 'pip.exe')
    else:
        pip_executable = os.path.join('env', 'bin', 'pip')
    
    print(f"Looking for pip executable at: {pip_executable}")
    if os.path.exists(pip_executable):
        print(f"Using pip executable at: {pip_executable}")
        result = subprocess.call([pip_executable, 'install', '-r', 'requirements.txt'])
        if result == 0:
            print("Python dependencies installed.")
        else:
            print("Failed to install Python dependencies.")
            sys.exit(1)
    else:
        print(f"Error: pip executable not found at {pip_executable}")
        print("Please ensure that the virtual environment was created correctly.")
        sys.exit(1)

def start_flask_server():
    print("Starting Flask server...")
    if os.name == 'nt':
        subprocess.Popen(['env\\Scripts\\python', 'backend/app.py'], creationflags=subprocess.CREATE_NEW_CONSOLE)
    else:
        subprocess.Popen(['env/bin/python', 'backend/app.py'])
    print("Flask server started.")

if __name__ == '__main__':
    create_virtualenv()
    install_python_dependencies()
    start_flask_server()
