from flask import Flask, jsonify, request
import json
import random

app = Flask(__name__)

with open('courses.json', 'r') as f:
    courses = json.load(f)

with open('testimonials.json', 'r') as f:
    testimonials = json.load(f)


students = []

def generate_new_student_id():
    """Auto-increment the student ID."""
    if not students:
        return 1
    return max(student["id"] for student in students) + 1



# 1. Student Registration API
@app.route('/register', methods=['POST'])
def register_student():
    data = request.get_json()
    for field in ['username', 'password', 'email']:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400


    existing_student = next((stu for stu in students if stu['username'] == data['username']), None)
    if existing_student:
        return jsonify({"error": "Username is already taken."}), 400

    new_student = {
        "id": generate_new_student_id(),
        "username": data["username"],
        "password": data["password"],  
        "email": data["email"],
        "enrolled_courses": data.get("enrolled_courses", [])
    }
    students.append(new_student)
    return jsonify({"message": "Registration successful!", "student": new_student}), 201

# 2. Login API
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    for field in ['username', 'password']:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    student = next((stu for stu in students if stu['username'] == data['username']), None)
    if student and student['password'] == data['password']:
        return jsonify({
            "message": "Login successful!",
            "redirect_url": "/course-enrolment"  
        }), 200
    else:
        return jsonify({"error": "Invalid username or password."}), 401

# 3. Testimonials API
@app.route('/testimonials', methods=['GET'])
def get_random_testimonials():
    #
    if len(testimonials) >= 2:
        selected = random.sample(testimonials, 2)
    else:
        selected = testimonials
    return jsonify(selected)


# 4. Enroll Course API
@app.route('/enroll/<int:student_id>', methods=['POST'])
def enroll_course(student_id):
    data = request.get_json()
    if 'course_id' not in data:
        return jsonify({"error": "Missing field: course_id"}), 400

    student = next((stu for stu in students if stu['id'] == student_id), None)
    if not student:
        return jsonify({"error": "Student not found."}), 404

    course = next((course for course in courses if course['id'] == data['course_id']), None)
    if not course:
        return jsonify({"error": "Course not found."}), 404

    if data['course_id'] in student['enrolled_courses']:
        return jsonify({"error": "Student is already enrolled in this course."}), 400

    student['enrolled_courses'].append(data['course_id'])
    return jsonify({"message": "Course enrollment successful!", "student": student}), 200

#5. Delete Course API
@app.route('/drop/<int:student_id>', methods=['DELETE'])
def drop_course(student_id):
    data = request.get_json()
    if 'course_id' not in data:
        return jsonify({"error": "Missing field: course_id"}), 400

    student = next((stu for stu in students if stu['id'] == student_id), None)
    if not student:
        return jsonify({"error": "Student not found."}), 404

    if data['course_id'] not in student['enrolled_courses']:
        return jsonify({"error": "Student is not enrolled in this course."}), 400

    student['enrolled_courses'].remove(data['course_id'])
    return jsonify({"message": "Course dropped successfully!", "student": student}), 200


#6. Get all courses API
@app.route('/courses', methods=['GET'])
def get_all_courses():
    return jsonify(courses)

#7. Get student courses API
@app.route('/student_courses/<int:student_id>', methods=['GET'])
def get_student_courses(student_id):
    student = next((stu for stu in students if stu['id'] == student_id), None)
    if not student:
        return jsonify({"error": "Student not found."}), 404

    enrolled_courses = [course for course in courses if course['id'] in student['enrolled_courses']]
    return jsonify(enrolled_courses)

# add the other endpoints 4-7 arnav then delete this commetn


@app.route('/courses', methods=['GET'])
def get_courses():
    return jsonify(courses)

@app.route('/students', methods=['GET'])
def get_students():
    return jsonify(students)

if __name__ == '__main__':
    app.run(debug=True)
