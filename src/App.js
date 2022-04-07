import React, {useState, useEffect} from 'react';
import './App.css';
import {CourseList} from './components/CourseList';
import { addScheduleTimes} from './utilities/time';
import { useData } from './utilities/firebase';

//=>() instead of =>{}
//title is the parameter here we set
const Banner = ({ title }) => (
  <h1>{ title }</h1>
);

const App = () => {
  const [schedule, loading, error] = useData('/', addScheduleTimes); 
  
  if (error) return <h1>{error}</h1>;
  if (loading) return <h1>Loading the schedule...</h1>


  return (
    <div className="container">
      <Banner title={ schedule.title } />
      <CourseList courses={ schedule.courses } />
    </div>
  );
};

export default App;
