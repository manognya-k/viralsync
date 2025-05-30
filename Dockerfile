# Use a Python base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy all backend files
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 5000

# Run the Flask app
CMD ["python", "app.py"]
