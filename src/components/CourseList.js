import {hasConflict, timeParts } from "../utilities/time";
import React, {useState, useEffect} from 'react';
import { setData } from "../utilities/firebase";

const terms = { F: 'Fall', W: 'Winter', S: 'Spring'}; 

//({}) since we send a object here
const Course = ({ course, selected, setSelected }) => {
    const isSelected = selected.includes(course);
    const isDisabled = !isSelected && hasConflict(course, selected);
    const style = {
      backgroundColor: isDisabled? 'lightgrey' : isSelected ? 'lightgreen' : 'white'
    };
  
    return (
    <div className="card m-1 p-2" 
          style={style}
          onClick={isDisabled ? null : () =>  setSelected(toggle(course, selected))}
          onDoubleClick={() => reschedule(course, getCourseMeetingData(course))}
    >
    <div className="card-body">
          <div className="card-title">{ getCourseTerm(course) } CS { getCourseNumber(course) }</div>
          <div className="card-text">{ course.title }</div>
          <div className="card-text">{ course.meets }</div>
        </div>
      </div>
    );
  };


const toggle=(x, lst)=>(
    lst.includes(x) ? lst.filter(y => y !== x) : [x, ...lst]
)

const reschedule = async (course, meets) => {
    if (meets && window.confirm(`Change ${course.id} to ${meets}?`)) {
      try {
        await setData(`/courses/${course.id}/meets`, meets);
      } catch (error) {
        alert(error);
      }
    }
  };

const getCourseMeetingData = course => {
    const meets = prompt('Enter meeting data: MTuWThF hh:mm-hh:mm', course.meets);
    const valid = !meets || timeParts(meets).days;
    if (valid) return meets;
    alert('Invalid meeting data');
    return null;
  };

const scheduleChanged = (selected, courses) => (
    selected.some(course => course !== courses[course.id])
);

//iteration
export const CourseList = ({ courses }) => {
    const [term, setTerm] = useState('Fall');
    const [selected, setSelected] = useState([]);
  
    if (scheduleChanged(selected, courses)) {
      setSelected([])
    };
    
    const termCourses = Object.values(courses).filter(course => term === getCourseTerm(course));
    
    return (
      <>
        <TermSelector term={term} setTerm={setTerm} />
        <div className="course-list">
        { 
          termCourses.map(course =>
            <Course key={ course.id } course={ course }
              selected={selected} setSelected={ setSelected } 
            />) 
        }
        </div>
      </>
    );
  };

const TermButton = ({term, setTerm, checked}) =>(
    <>
      <input type= "radio" id={term} className = "btn-check" autoComplete='off' checked = {checked} onChange={() => setTerm(term)} />
      <label class = "btn btn-success m-1 p-2" htmlFor = {term}>
        {term}
      </label>
    </>
);

const getCourseNumber = course => (
    course.id.slice(1, 4)
);  

export const getCourseTerm = course => (
    terms[course.id.charAt(0)]
);

const TermSelector = ({term, setTerm}) => (
    <div className='btn-group'>
        {Object.values(terms).map(value => (<TermButton key={value} term = {value} checked = {value === term} setTerm = {setTerm}/> ))}
    </div>
)
  
