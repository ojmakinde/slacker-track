def get_user_goals_landing_page(db, username):
    goals = db.table('goals') \
            .select('goal, description, start_time, end_time') \
            .eq('username', f'{username}') \
            .limit(3) \
            .execute() \
            .data
    
    return (goals)

def get_user_goals_goals_page(db, username):
    goals = db.table('goals') \
            .select('*') \
            .eq('username', f'{username}') \
            .execute() \
            .data
    
    return (goals)

def get_goal_logs(db, goal_id):
    logs = db.table('logs') \
            .select('*') \
            .eq('goal_id', f'{goal_id}') \
            .order('created_at', desc=False) \
            .execute() \
            .data

    goal_info = db.table('goals') \
                .select('goal, description') \
                .eq('id', f'{goal_id}') \
                .execute() \
                .data[0]

    return (logs, goal_info)

# def get_user_goals_goals_page():
#     # get all goals ? we would need some Jinja logic for keeping goals limited to 10 per page

#     # also, a sort-by dropdown for AJAX calls would be nice

#     # lastly, a search bar? (would be rather interesting)

# def get_user_logs():
#     # so here, i would select from logs, where log id is the current id and user is the correct user

#     # i would need a get log, update log, delete log.