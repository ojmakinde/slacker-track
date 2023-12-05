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

    # also, add way to limit goals to 10 per page, and add logic for multiple pages.
    # slick enhancements: a way to sort goals and a way to search for them

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

def delete_log(db, log_id):
    log = db.table('logs') \
            .delete() \
            .eq('id', f'{log_id}') \
            .execute() \

# def get_user_logs():
#     # so here, i would select from logs, where log id is the current id and user is the correct user

#     # i would need a get log, update log, delete log.