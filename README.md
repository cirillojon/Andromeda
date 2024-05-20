# Romeo

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

5. **Start the Flask server:**

    With the virtual environment activated, run:

    ```sh
    npm run dev:flask
    ```

6. **Run the development server:**

    In another terminal (or tab), run:

    ```sh
    npm run dev:next
    ```

7. **When finished, deactivate the virtual environment by running:**

    ```sh
    deactivate
    ```

### Notes

- The Flask server runs on port 5000.
- The Next.js development server runs on port 3000.
- Make sure the Flask server is running before starting the Next.js development server to avoid API request issues.
