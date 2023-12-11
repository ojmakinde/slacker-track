from flask import Flask, request, render_template, redirect, url_for, jsonify
from datetime import datetime
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

@app.route("/create_goal/<user>", methods=['POST'])
def create_goal(user):
    goal = request.form.get('title')
    description = request.form.get('description')
    start_date = request.form.get('start_date')
    start_date = datetime.strptime(start_date, "%Y-%m-%dT%H:%M")
    end_date = request.form.get('end_date')
    if end_date:
        end_date = datetime.strptime(end_date, "%Y-%m-%dT%H:%M")
        goal = logic.create_goal_end_date(database, user, goal, description, start_date, end_date)
        return (goal)
    goal = logic.create_goal(database, user, goal, description, start_date)
    
    return (goal)

@app.route("/goals/<user>/<goal_id>")
def goal_logs(user, goal_id):
    logs, goal_info = logic.get_goal_logs(database, goal_id)
    return render_template('logs_page.html', logs=logs, goal_info=goal_info, user=user)

# create a route and call it in the js
@app.route("/goals/<user>/<log_id>", methods=['POST'])
def handle_log(user, log_id):
    action = request.form.get('action')
    if action == 'delete':
        log = logic.delete_log(database, log_id)
    elif action == 'edit':
        title, description = request.form.get('title'), request.form.get('description')
        log = logic.edit_log(database, log_id, title, description)

    return (log)