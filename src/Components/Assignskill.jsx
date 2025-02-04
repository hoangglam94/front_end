import React, { useState, useEffect } from 'react'
import {  useNavigate } from "react-router-dom";
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
    const url = "https://backend-server-d9vj.onrender.com";
    const [selectedSkills, setSelectedSkills] = useState([])
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmail = async () => {
          try {
            const token = localStorage.getItem('token');
    
            const result = await axios.get(url+'/api/get-email', {
              headers: {
                Authorization: `${token}`
              }
            });
    
            const temp = result.data.email;
            
            setEmail(temp); // Set the email state
//            console.log("Email: ", temp); // Use temp to log the correct email
            setLoading(false);
            return temp; // Return the email for further use
          } catch (error) {
            if (error.response) {
              console.error("Error fetching email:", error.response.data.message);
            } else if (error.request) {
              console.error("No response received:", error.request);
            } else {
              console.error("Error:", error.message);
            }
            setError('Error fetching email');
          }
        };

        
        fetchEmail();
    }, []);


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
        axios.post(url+'/dashboard/assignskill' ,{ selectedSkills } , {params: { email }})
        .then(result => {
            console.log(result);
            if(result.data.AssignStatus){
                navigate('/dashboard'); // Redirect to create-project page
            }
            else{
                alert(result.data.Error);
                navigate('/dashboard');                
            }
        })
        .catch(err => console.log(err))

    };   

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
  
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