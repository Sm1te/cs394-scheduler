import { terms, getCourseTerm, Course } from "../utilities/time";
import React, {useState, useEffect} from 'react';

//iteration
const CourseList = ({ courses }) => {
    const [term, setTerm] = useState('Fall');
    const [selected, setSelected] = useState([]);
    const termCourses = Object.values(courses).filter(course => term === getCourseTerm(course));
  
    return (
      <>
      <TermSelector term = {term} setTerm = {setTerm} />
        <div className='course_list' >
        { termCourses.map(course => <Course key={course.id} course={ course } 
          selected={selected} setSelected={setSelected}/>) }
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



const TermSelector = ({term, setTerm}) => (
    <div className='btn-group'>
        {Object.values(terms).map(value => (<TermButton key={value} term = {value} checked = {value === term} setTerm = {setTerm}/> ))}
    </div>
)
  
export default CourseList;