from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def auth_page():
    return render_template('auth_view.html')

@app.route("/home/")
def landing_page():
    return render_template('landing_page.html')

@app.route("/about/")
def about_page():
    return render_template('about_page.html')

@app.route("/goals/")
def goals_page():
    return render_template('goals_page.html')