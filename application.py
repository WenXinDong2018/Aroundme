import os
import re
from flask import Flask, jsonify, render_template, request

from helpers import lookup,getTrend,getWeather

# Configure application
app = Flask(__name__)
app.config["JSONIFY_PRETTYPRINT_REGULAR"] = False

# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
def index():
    """Render map"""
    return render_template("index.html")


@app.route("/articles")
def articles():
    """Look up articles for geo"""
    rows = lookup()
    return jsonify(rows[1:7])


@app.route("/trends")
def trends():
    lat = request.values.get("lat")
    lng = request.values.get("lng")
    helperResult = getTrend(lat,lng)
    rows = helperResult[0]
    name = helperResult[1]
    return jsonify([rows[:10],name])

@app.route("/weather")
def weather():
    lat = request.values.get("lat")
    lng = request.values.get("lng")
    # returned values : [curent, forecast,location]
    helperResult = getWeather(lat,lng)
    return jsonify(helperResult)