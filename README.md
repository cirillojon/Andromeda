## Getting Started

### Prerequisites

- Python 3.x
- Node.js (version 18.17 or higher required for Next)

### Setup

1. **Clone the repository:**

    ```sh
    git clone https://github.com/cirillojon/Romeo
    cd Romeo
    ```

2. **Run the setup script to install Python dependencies:**

    ```sh
    npm run setup
    ```

    This command will:
    - Create a virtual environment in the `env` directory (if it doesn't already exist)
    - Install Python dependencies from `requirements.txt`
    - Start the Flask server

3. **Install Node.js dependencies:**

    ```sh
    npm install
    ```

4. **Activate the virtual environment:**

    - On macOS and Linux:

      ```sh
      source env/bin/activate
      ```

    - On Windows:

      ```sh
      .\env\Scripts\activate
      ```

5. **Run the development server:**

    ```sh
    npm run dev
    ```

    This command will start the Next.js development server. Make sure the Flask server is running as well (it should be started by the setup script).

6. **When finished, deactivate the virtual environment by running:**

    ```sh
    deactivate