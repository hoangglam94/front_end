import React, { useState } from 'react'
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from 'axios';
const skillsList = [

    'C',
    'C++',
    'Java',
    'Python',
    'JavaScript',
    'Go',
    'Ruby',
    'PHP'

];


const Assignskill = () => {

    const [selectedSkills, setSelectedSkills] = useState([])


    const url = process.env.BE_URL;


    const handleCheckboxChange = (event) => {
        const skill = event.target.value;
        setSelectedSkills((prevSkills) =>
            prevSkills.includes(skill)
                ? prevSkills.filter((s) => s !== skill)
                : [...prevSkills, skill]
        );
    };
  
    const handleSubmit = async (event) => {

        event.preventDefault();
        axios.post(url + '/dashboard/assignskill' ,{ selectedSkills })
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err))

    };   

    return (
        <div>

        <h1>Select Your Skills</h1>

        <form onSubmit={handleSubmit}>

            {skillsList.map((skill) => (

                <div key={skill}>

                    <label>

                        <input

                            type="checkbox"

                            value={skill}

                            checked={selectedSkills.includes(skill)}

                            onChange={handleCheckboxChange}

                        />
                        {skill}
                    </label>
                </div>
            ))}
            <button type="submit">Submit</button>
        </form>
    </div>

    


    
  )
}

export default Assignskill