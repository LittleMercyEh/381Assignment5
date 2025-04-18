import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import CourseItem from './CourseItem';
import EnrollmentList from './EnrollmentList';

const CoursesPage = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Fetch courses from backend
    fetch('/courses')
      .then(response => response.json())
      .then(data => {
        // Example: choose 3 random courses
        const shuffled = data.sort(() => 0.5 - Math.random());
        setFeaturedCourses(shuffled.slice(0, 3));
        setCourses(data); // Set all courses
      })
      .catch(err => console.error('Error fetching courses:', err));
  }, []); // Added dependency array

  const handleEnroll = (course) => {
    setEnrolledCourses(prev => [
      ...prev,
      {
        ...course,
        enrollmentId: Date.now(), // Unique ID for each enrollment
      },
    ]);
  };

  const handleRemove = (enrollmentId) => {
    setEnrolledCourses(prev =>
      prev.filter(course => course.enrollmentId !== enrollmentId)
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />

      <div
        style={{
          flex: 1,
          display: 'flex',
          padding: '20px',
          gap: '30px',
        }}
      >
        <div style={{ flex: 3 }}>
          <h2 style={{ color: '#004080' }}>Available Courses</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            {courses.map(course => (
              <CourseItem
                key={course.id}
                course={course}
                onEnroll={handleEnroll}
              />
            ))}
          </div>
        </div>

        <EnrollmentList
          enrolledCourses={enrolledCourses}
          onRemove={handleRemove}
        />
      </div>

      <Footer />
    </div>
  );
};

export default CoursesPage;
