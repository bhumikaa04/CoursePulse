const CourseList = ({ courses, selectedCourse, onSelectCourse }) => {
    return (
      <ul className="course-list">
        {courses.map(course => (
          <li
            key={course.id}
            className={`course-item ${selectedCourse?.id === course.id ? 'active' : ''}`}
            onClick={() => onSelectCourse(course)}
          >
            {course.title}
          </li>
        ))}
      </ul>
    );
  };

export default CourseList;