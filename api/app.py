from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from operator import itemgetter
from collections import OrderedDict
from sqlalchemy.sql.expression import func

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
db = SQLAlchemy(app)
app.app_context().push()

class Events(db.Model):
    __tablename__ = 'events'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String())
    type = db.Column(db.String())
    startTime = db.Column(db.Integer())
    endTime = db.Column(db.Integer())
    points = db.Column(db.Integer())
    description = db.Column(db.String())
    pincode = db.Column(db.String())
    year = db.Column(db.Integer(), db.ForeignKey('years.id'))
    school = db.Column(db.Integer(), db.ForeignKey('admins.id'))
    point_event = db.relationship('Points', backref='point_event', lazy=True)

class PlannedStudents(db.Model):
    __tablename__ = 'planned_students'
    id = db.Column(db.Integer(), primary_key=True)
    student_id = db.Column(db.Integer())
    event_id = db.Column(db.Integer())

class Prizes(db.Model):
    __tablename__ = 'prizes'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String())
    type = db.Column(db.String())
    size = db.Column(db.Integer())
    claimed = db.Column(db.Integer(), db.ForeignKey('students.id'))
    year = db.Column(db.Integer(), db.ForeignKey('years.id'))
    school = db.Column(db.Integer(), db.ForeignKey('admins.id'))

class Students(db.Model):
    __tablename__ ='students'
    id = db.Column(db.Integer(), primary_key=True)
    firstName = db.Column(db.String())
    lastName = db.Column(db.String())
    email = db.Column(db.String())
    password = db.Column(db.String())
    grade = db.Column(db.Integer())
    school = db.Column(db.Integer(), db.ForeignKey('admins.id'))
    points = db.relationship('Points', backref='student_points', lazy=True)

class Admins(db.Model):
    __tablename__ ='admins'
    id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String())
    schoolName = db.Column(db.String())
    password = db.Column(db.String())
    schoolCode = db.Column(db.String())
    students = db.relationship('Students', backref='school_students', lazy=True)
    events = db.relationship('Events', backref='school_events', lazy=True)
    years = db.relationship('Years', backref='school_years', lazy=True)
    prizes = db.relationship('Prizes', backref='school_prizes', lazy=True)

class Years(db.Model):
    __tablename__ ='years'
    id = db.Column(db.Integer(), primary_key=True)
    startingYear = db.Column(db.Integer())
    endingYear = db.Column(db.Integer())
    quarter = db.Column(db.Integer())
    school = db.Column(db.Integer(), db.ForeignKey('admins.id'))
    point_year = db.relationship('Points', backref='point_year', lazy=True)
    event_year = db.relationship('Events', backref='event_year', lazy=True)
    prize_year = db.relationship('Prizes', backref='prize_year', lazy=True)

class Points(db.Model):
    __tablename__ ='points'
    id = db.Column(db.Integer(), primary_key=True)
    pts = db.Column(db.Integer())
    event = db.Column(db.Integer(), db.ForeignKey('events.id'))
    student = db.Column(db.Integer(), db.ForeignKey('students.id'))
    year = db.Column(db.Integer(), db.ForeignKey('years.id'))

def create_dict(data):
    return dict((col, getattr(data, col)) for col in data.__table__.columns.keys())

def new_quarter(admin_id):
    current_quarter = Years.query.filter_by(school=admin_id).order_by(Years.id.desc()).first()
    if current_quarter.quarter == 4:
        startingYear = current_quarter.startingYear + 1
        endingYear = current_quarter.endingYear + 1 
        quarter = 1
    else:
        startingYear = current_quarter.startingYear
        endingYear = current_quarter.endingYear
        quarter = current_quarter.quarter + 1
    new_year = Years(
        startingYear=startingYear,
        endingYear=endingYear,
        quarter=quarter,
        school=admin_id
    )
    db.session.add(new_year)
    db.session.commit()

@app.route("/attend", methods=['POST'])
def attend():
    data = request.get_json()
    student = Students.query.get(data['id'])
    current_quarter = Years.query.filter_by(school=student.school).order_by(Years.id.desc()).first().id
    event = Events.query.get(data['event_id'])
    if (data['pincode'] != event.pincode):
        return jsonify({'error': 'The code you entered is an invalid pincode'})
    new_points = Points(
        pts=event.points,
        event=event.id,
        student=student.id,
        year=current_quarter
    )
    db.session.add(new_points)
    db.session.commit()
    return jsonify({'response': 200})

@app.route("/plan", methods=['POST'])
def plan():
    data = request.get_json()
    new_plan = PlannedStudents(student_id=data['user_id'],event_id=data['event_id'])
    db.session.add(new_plan)
    db.session.commit()
    return jsonify({'response': 200})
    

@app.route("/create/event", methods=['POST'])
def create_event():
    data = request.get_json()
    school = data['admin_id']
    current_quarter = Years.query.filter_by(school=school).order_by(Years.id.desc()).first().id
    already_code = Events.query.filter_by(school=school, pincode=data['pincode'], year=current_quarter)
    if already_code.count() > 0:
        return jsonify({'error': 'Pincode already exists for another event this quarter'})
    already_name = Events.query.filter_by(school=school, name=data['name'], year=current_quarter)
    if already_name.count() > 0:
        return jsonify({'error': 'Name already exists for another event this quarter'})
    new_event = Events(
        name=data['name'],
        type=data['type'],
        startTime=data['startTime'],
        endTime=data['endTime'],
        points=data['points'],
        description=data['description'],
        pincode=data['pincode'],
        year=current_quarter,
        school=school,
    )
    db.session.add(new_event)
    db.session.commit()
    return jsonify({'response': 200})

@app.route("/delete/event", methods=['POST'])
def delete_event():
    data = request.get_json()
    Events.query.filter_by(id=data['event_id']).delete()
    db.session.commit()
    return jsonify({'response': 200})

@app.route('/edit/event', methods=['POST'])
def edit_event():
    data = request.get_json()
    event = Events.query.get(data['event_id'])
    school = event.school
    event_quarter = Years.query.get(event.year)
    already_code = Events.query.filter_by(school=school, pincode=data['pincode'], year=event_quarter.id).filter(Events.id != event.id)
    if already_code.count() > 0:
        return jsonify({'error': 'Pincode already exists for another event this quarter'})
    already_name = Events.query.filter_by(school=school, name=data['name'], year=event_quarter.id).filter(Events.id != event.id)
    if already_name.count() > 0:
        return jsonify({'error': 'Name already exists for another event this quarter'})
    event.name = data['name']
    event.type = data['type']
    event.startTime = data['startTime']
    event.endTime = data['endTime']
    event.points = data['points']
    event.description = data['description']
    event.pincode = data['pincode']
    db.session.commit()
    return jsonify({'response': 200})

@app.route("/get/events", methods=['GET'])
def get_events():
    def send_event(event, year_id, type):
        new_dict = create_dict(event)
        new_dict['year'] = create_dict(Years.query.get(year_id))
        if type != 'admin':
            planned_event = PlannedStudents.query.filter_by(student_id=type, event_id=event.id)
            new_dict['student_planned'] = True if planned_event.count() > 0 else False
            attended_event = Points.query.filter_by(student=type, event=event.id)
            new_dict['student_attended'] = True if attended_event.count() > 0 else False
            planned_students = PlannedStudents.query.filter_by(event_id=event.id)
            attended_students = Points.query.filter_by(event=event.id)
            new_dict['planned_num'] = planned_students.count()
            new_dict['attended_num'] = attended_students.count()
            new_dict['planned'] = []
            new_dict['attended'] = []
            for student in planned_students:
                new_student = Students.query.get(student.student_id)
                new_dict['planned'].append({'name': f'{new_student.firstName} {new_student.lastName}', 'grade': new_student.grade})
            for student in attended_students:
                attended_student = Students.query.get(student.student)
                new_dict['attended'].append({'name': f'{attended_student.firstName} {attended_student.lastName}', 'grade': attended_student.grade})
        return new_dict
    user_id = request.args.get('id')
    admin = request.args.get('admin')
    admin_id = user_id if admin == 'true' else Students.query.get(user_id).school
    all_events = Events.query.filter_by(school=admin_id).order_by(Events.id.desc())
    if admin == 'true':
        events_array = [send_event(event, event.year, 'admin') for event in all_events]
        return jsonify({'events': events_array})
    else:
        events_array = [send_event(event, event.year, user_id) for event in all_events]
        student_event_ids = [event.event for event in Points.query.filter_by(student=user_id)]
        enrolled_events = []
        past_events = []
        avaliable_events = []
        for event in events_array:
            if event['id'] in student_event_ids:
                enrolled_events.append(event)
            else:
                if event['endTime'] < int(datetime.now().timestamp()):
                    past_events.append(event)
                else:
                    avaliable_events.append(event)
        return jsonify({'enrolled': enrolled_events, 'past_events': past_events, 'avaliable_events': avaliable_events})

@app.route("/create/prize", methods=['POST'])
def create_prize():
    data = request.get_json()
    current_quarter = Years.query.filter_by(school=data['admin_id']).order_by(Years.id.desc()).first().id
    already_name = Prizes.query.filter_by(school=data['admin_id'], year=current_quarter, name=data['name'])
    if already_name.count() > 0:
        return jsonify({'error': 'Name already exists for another prize this quarter'})
    new_prize = Prizes(
        name=data['name'],
        type=data['type'],
        year=current_quarter,
        school=data['admin_id']
    )
    db.session.add(new_prize)
    db.session.commit()
    return jsonify({'response': 200})

@app.route("/delete/prize", methods=['POST'])
def delete_prize():
    data = request.get_json()
    Prizes.query.filter_by(id=data['prize_id']).delete()
    db.session.commit()
    return jsonify({'response': 200})

@app.route("/edit/prize", methods=['POST'])
def edit_prize():
    data = request.get_json()
    prize = Prizes.query.get(data['prize_id'])
    prize_quarter = Years.query.get(prize.year)
    already_name = Prizes.query.filter_by(school=prize.school, year=prize_quarter.id, name=data['name']).filter(Prizes.id != prize.id)
    if already_name.count() > 0:
        return jsonify({'error': 'Name already exists for another prize this quarter'})
    prize.name = data['name']
    prize.type = data['type']
    db.session.commit()
    return jsonify({'response': 200})

@app.route("/get/prizes", methods=['GET'])
def get_prizes():
    def send_prize(event, year_id):
        new_dict = create_dict(event)
        new_dict['year'] = create_dict(Years.query.get(year_id))
        if new_dict['claimed'] != None:
            new_dict['claimed'] = create_dict(Students.query.get(new_dict['claimed']))
        return new_dict
    user_id = request.args.get('id')
    admin = request.args.get('admin')
    admin_id = user_id if admin == 'true' else Students.query.get(user_id).school
    current_quarter = Years.query.filter_by(school=admin_id).order_by(Years.id.desc()).first().id
    all_prizes = Prizes.query.filter_by(school=admin_id).order_by(Prizes.id.desc())
    prizes_array = [send_prize(prize, prize.year) for prize in all_prizes]
    if admin == 'true' :
        return jsonify({'prizes': prizes_array})
    else:
        given_prizes = []
        current_prizes = []
        past_prizes = []
        won_prizes_ids = [prize.id for prize in Prizes.query.filter_by(claimed=user_id)]
        for prize in prizes_array:
            if prize['id'] in won_prizes_ids:
                given_prizes.append(prize)
            else:
                if prize['year']['id'] != current_quarter:
                    past_prizes.append(prize)
                else:
                    current_prizes.append(prize) 
        return jsonify({'given_prizes':given_prizes, 'current_prizes': current_prizes, 'past_prizes': past_prizes})

def get_standings(school_id, user_id):
    school_students = Students.query.filter_by(school=school_id)
    school_student_points_dict = {}
    for school_student in school_students:
        total_school_student_points = 0
        school_student_points = Points.query.filter_by(student=school_student.id)
        for point in school_student_points:
            total_school_student_points += point.pts
        school_student_points_dict[str(school_student.id)] = total_school_student_points
    sorted_student_points = OrderedDict(sorted(school_student_points_dict.items(), key=itemgetter(1), reverse=True))
    if user_id == 'admin':
        top = max(sorted_student_points, key=sorted_student_points.get)
        return {
            'top_student': Students.query.get(int(top))
        }
    else:
        return {
            'student': list(sorted_student_points.keys()).index(str(user_id)) + 1,
            'total': len(school_student_points_dict)
        }

@app.route("/get/winners", methods=['GET'])
def get_winners():
    prizes_ids_given = []
    def send_prizes(student):
        points = Points.query.filter_by(student=student.id).with_entities(func.sum(Points.pts)).scalar()
        selected_prize = school_prizes.filter(Prizes.id.not_in(prizes_ids_given)).order_by(func.random()).limit(1).first()
        prizes_ids_given.append(selected_prize.id)
        student_dict = create_dict(student)
        student_dict['total'] = points if points else 0
        new_dict = {
            'student': student_dict,
            'prize': create_dict(selected_prize)
        }
        return new_dict
    winning_dict = {
        12: {
            'top': False,
            'amount': 0
        },
        11: {
            'top': True,
            'amount': 0
        },
        10: {
            'top': False,
            'amount': 0
        },
        9: {
            'top': False,
            'amount': 0
        },
    }
    admin_id = request.args.get('id')
    current_quarter = Years.query.filter_by(school=admin_id).order_by(Years.id.desc()).first().id
    school_prizes = Prizes.query.filter_by(school=admin_id, year=current_quarter)
    prizes_count = school_prizes.count()
    top_student = get_standings(admin_id, 'admin')['top_student']
    winning_dict[top_student.grade]['top'] = True
    current_grade = 12
    for _ in range(prizes_count):
        winning_dict[current_grade]['amount'] += 1
        if current_grade == 9:
            current_grade = 12
        else:
            current_grade -= 1
    winning_data = {}
    winning_data['grades'] = {}
    winning_data['top'] = send_prizes(top_student)
    for grade, data in winning_dict.items():
        if grade == top_student.grade:
            grade_students = Students.query.filter_by(grade=grade, school=admin_id).filter(Students.id != top_student.id).order_by(func.random()).limit(data['amount'] - 1).all()
        else:
            grade_students = Students.query.filter_by(grade=grade, school=admin_id).order_by(func.random()).limit(data['amount']).all()
        winning_data['grades'][str(grade)] = [send_prizes(student) for student in grade_students]
    return jsonify(winning_data)

@app.route("/set/prizes", methods=['POST'])
def set_prizes():
    data = request.get_json()
    for winner in data['winners']:
        won_prize = Prizes.query.get(winner['prize'])
        won_prize.claimed = winner['student']
        db.session.commit()
    new_quarter(data['admin_id'])
    return jsonify({'response': 200})

@app.route("/get/students", methods=['GET'])
def get_students():
    def send_student(student):
        student_dict = create_dict(student)
        points = Points.query.filter_by(student=student.id)
        total_points =  0
        for point in points:
            total_points += point.pts
        current_quarter = Years.query.filter_by(school=student.school).order_by(Years.id.desc()).first().id
        current_points = points.filter_by(year=current_quarter)
        quarter_points = 0
        for point in current_points:
            quarter_points += point.pts
        student_dict['points'] = {
            'total': total_points,
            'quarter': quarter_points
        }
        return student_dict
    admin_id = request.args.get('id')
    all_students = Students.query.filter_by(school=admin_id)
    students_array = [send_student(student) for student in all_students]
    return jsonify({'students': students_array})

@app.route("/get/student", methods=['GET'])
def get_student():
    def send_event_prize(obj):
        new_dict = create_dict(obj)
        new_dict['year'] = create_dict(Years.query.get(obj.year))
        return new_dict
    student_id = request.args.get('id')
    student = Students.query.get(student_id)
    student_dict = create_dict(student)
    events = []
    prizes = Prizes.query.filter_by(claimed=student_id)
    points = Points.query.filter_by(student=student.id)
    for point in points:
        point_event = Events.query.get(point.event)
        events.append(point_event)
    total_points =  0
    quarter_points = 0
    for point in points:
        total_points += point.pts
    current_quarter = Years.query.filter_by(school=student.school).order_by(Years.id.desc()).first().id
    current_points = points.filter_by(year=current_quarter)
    for point in current_points:
        quarter_points += point.pts
    student_dict['points'] = {
        'total': total_points,
        'quarter': quarter_points,
    }
    student_dict['events'] = {
        'all': [send_event_prize(event) for event in events],
        'total': len(events)   
    }
    student_dict['prizes'] = {
        'all': [send_event_prize(prize) for prize in prizes],
        'total': prizes.count()
    }
    student_dict['standing'] = get_standings(student.school, student_id)
    return jsonify({'student': student_dict})

@app.route("/get/user", methods=['GET'])
def get_user():
    user_id = request.args.get('id')
    admin = True if request.args.get('admin') == 'true' else False
    if admin:
        admin_user = Admins.query.get(user_id)
        return jsonify({'user': {
            'name': admin_user.schoolName
        }})
    else:
        student_user = Students.query.get(user_id)
        return jsonify({'user': {
            'name': f"{student_user.firstName} {student_user.lastName}"
        }})

@app.route("/get/quarter", methods=['GET'])
def get_quarter():
    admin_id = request.args.get('id')
    current_quarter = Years.query.filter_by(school=admin_id).order_by(Years.id.desc()).first()
    return jsonify({'quarter': create_dict(current_quarter)})

@app.route("/register/student", methods=['POST'])
def create_student():
    data = request.get_json()
    already_email = Students.query.filter_by(email=data['email'])
    if already_email.count() > 0:
        return jsonify({'error': 'Email already exists'})
    school = Admins.query.filter_by(schoolCode=data['schoolCode']).first()
    if not school:
        return jsonify({'error': 'School Code does not exist'})
    new_student = Students(
        firstName=data['firstName'],
        lastName=data['lastName'],
        email=data['email'],
        password=data['password'],
        grade=data['grade'],
        school=school.id
    )
    db.session.add(new_student)
    db.session.commit()
    return jsonify({'user_id': Students.query.order_by(Students.id.desc()).first().id, 'admin': False})

@app.route("/register/admin", methods=['POST'])
def create_admin():
    data = request.get_json()
    already_email = Students.query.filter_by(email=data['email'])
    if already_email.count() > 0:
        return jsonify({'error': 'Email already exists'})
    school = Admins.query.filter_by(schoolCode=data['schoolCode'])
    if school.count() > 0:
        return jsonify({'error': 'School Code already exists'})
    new_admin = Admins(
        email=data['email'],
        password=data['password'],
        schoolName=data['schoolName'],
        schoolCode=data['schoolCode'],
    )
    db.session.add(new_admin)
    admin_id = Admins.query.order_by(Admins.id.desc()).first().id
    new_year = Years(
        startingYear=data['startingYear'],
        endingYear=data['endingYear'],
        quarter=data['quarter'],
        school=admin_id
    )
    db.session.add(new_year)
    db.session.commit()
    return jsonify({'user_id': admin_id, 'admin': True})

@app.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    student = Students.query.filter_by(email=data['email']).first()
    admin = Admins.query.filter_by(email=data['email']).first()
    if not student and not admin:
        return jsonify({'error': 'Account does not exist'})
    elif student and not admin:
        account = student
        admin_acc = False
    else:
        account = admin
        admin_acc = True
    if data['password'] != account.password:
        return jsonify({'error': 'Password does not match'})
    return jsonify({'user_id': account.id, 'admin': admin_acc})

if __name__ == '__main__':
    app.run(debug=True)
