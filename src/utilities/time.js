const days = ['M', 'Tu', 'W', 'Th', 'F'];
const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;
const terms = { F: 'Fall', W: 'Winter', S: 'Spring'}; 

const addScheduleTimes = schedule => ({
    title: schedule.title,
    courses: mapValues(addCourseTimes, schedule.courses)
})

const timeParts = meets =>{
    const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
    return !match ? {} : {
      days,
      hours: {
        start: hh1 * 60 + mm1 * 1,
        end: hh2 * 60 + mm2 * 1
      }
    }
  }
  
const toggle=(x, lst)=>(
    lst.includes(x) ? lst.filter(y => y !== x) : [x, ...lst]
)
  
const hasConflict = (course, selected)=>(
    selected.some(selection => courseConflict(course, selection))
)

const courseConflict = (course1, course2) => (
    getCourseTerm(course1) === getCourseTerm(course2) && timeConlict(course1, course2)
)

const daysOverlap = (days1, days2) => (
    days.some(day => days1.includes(day) && days2.includes(day))
);

const hoursConflict = (hours1, hours2) => (
    Math.max(hours1.start, hours2.start) < Math.min(hours1.end, hours2.end)
)

const timeConlict = (course1, course2) => (
    daysOverlap(course1.days, course2.days) && hoursConflict(course1.hours, course2.hours)
)
  
const mapValues = (fn, obj) => (
    Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, fn(value)]))
  ) 
  
const addCourseTimes = course => ({
    ...course,
    ...timeParts(course.meets)
})  
  
const getCourseNumber = course => (
    course.id.slice(1, 4)
  );  

const getCourseTerm = course => (
    terms[course.id.charAt(0)]
);
//({}) since we send a object here
const Course = ({ course, selected, setSelected }) => {
    const isSelected = selected.includes(course);
    const isDisabled = !isSelected && hasConflict(course, selected)
  
    const course_style = {
      backgroundColor : isDisabled ? 'lightgrey' : isSelected ? 'lightgreen' : 'white'
    };
  
    return (
      <div className="card m-1 p-2" 
        onClick={isDisabled ? null : () => setSelected(toggle(course, selected))}
        style={course_style}
        >
        <div className="card-body">
          <div className="card-title">{ getCourseTerm(course) } CS { getCourseNumber(course) }</div>
          <div className="card-text">{ course.title }</div>
          <div className='card-text'>{ course.meets }</div>
        </div>
      </div>
    );
  };
  
export{addScheduleTimes, terms, getCourseTerm, Course} 
  
  
  
  
 
  
  

  