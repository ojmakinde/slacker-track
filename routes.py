from flask import Flask, render_template, redirect, url_for
from supabase import Client, create_client
import os
import logic

app = Flask(__name__)

database: Client = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY"))

@app.route("/")
def auth_page():
    return render_template('auth_page.html')

@app.route("/home/<user>")
def landing_page(user):
    # write an auth function? or a way to ensure people log in before viewing this page.
    goals = logic.get_user_goals_landing_page(database, f'{user}')
    return render_template('landing_page.html', goals=goals, user=user)

@app.route("/about/")
def about_page():
    return render_template('about_page.html')

@app.route("/goals/<user>")
def goals_page(user):
    goals = logic.get_user_goals_goals_page(database, f'{user}')
    return render_template('goals_page.html', goals=goals, user=user)

@app.route("/goals/<user>/<goal_id>")
def goal_logs(user, goal_id):
    logs, goal_info = logic.get_goal_logs(database, goal_id)
    return render_template('logs_page.html', logs=logs, goal_info=goal_info, user=user)

# create a route and call it in the js
@app.route("/goals/<user>/<log_id>")
def delete_log(user, log_id):
    log = logic.delete_log(log_id)
    return redirect(f"/goals/{user}")