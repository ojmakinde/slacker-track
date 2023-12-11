def get_max_id(db, table):
    id = db.table(f'{table}') \
           .select('id') \
           .order('id', desc=True) \
           .limit(1) \
           .execute() \
           .data[0]['id']

    return (id)

def create_goal_end_date(db, username, new_goal, new_description, start_date, end_date):
    max_id = get_max_id(db, 'goals')
    goal = db.table('goals') \
             .insert({'id': max_id + 1,
                      'username': f'{username}',
                      'goal': f'{new_goal}', 
                      'description': f'{new_description}',
                      'start_time': f'{start_date}',
                      'end_time': f'{end_date}'}) \
             .execute() \
             .data
             # we'll leave isComplete for now.

    return (goal)

def create_goal(db, username, new_goal, new_description, start_date):
    max_id = get_max_id(db)
    goal = db.table('goals') \
             .insert({'id': max_id + 1,
                      'username': f'{username}',
                      'goal': f'{new_goal}', 
                      'description': f'{new_description}',
                      'start_time': f'{start_date}'}) \
             .execute() \
             .data

    return (goal)

def get_user_goals_landing_page(db, username):
    goals = db.table('goals') \
            .select('goal, description, start_time, end_time') \
            .eq('username', f'{username}') \
            .limit(3) \
            .execute() \
            .data
    
    return (goals)

def get_user_logs_landing_page(db, username):
    logs = db.table('logs') \
            .select('*') \
            .eq('username', f'{username}') \
            .order('id', desc=True) \
            .limit(3) \
            .execute() \
            .data
    
    return (logs)

def get_user_goals_goals_page(db, username):
    goals = db.table('goals') \
            .select('*') \
            .eq('username', f'{username}') \
            .order('start_time', desc=True) \
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
                .select('id, goal, description') \
                .eq('id', f'{goal_id}') \
                .execute() \
                .data[0]

    return (logs, goal_info)

def add_log(db, new_title, new_description, goal_id):
    max_id = get_max_id(db, 'logs')
    log = db.table('logs') \
             .insert({'id': max_id + 1,
                      'log': f'{new_title}',
                      'description': f'{new_description}', 
                      'goal_id': f'{goal_id}'}) \
             .execute() \
             .data

    return (log)

def delete_log(db, log_id):
    log = db.table('logs') \
            .delete() \
            .eq('id', f'{log_id}') \
            .execute() \
            .data

    return (log)

def edit_log(db, log_id, new_title, new_description):
    log = db.table('logs') \
            .update({'log': f'{new_title}',
                     'description': f'{new_description}'}) \
            .eq('id', f'{log_id}') \
            .execute() \
            .data

    return (log)