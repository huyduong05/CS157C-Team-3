#!/bin/sh

# Run the database loader first
python dbinit.py

# Then start the Flask server
flask run --host=0.0.0.0
