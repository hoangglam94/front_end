import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DragItem from './DragItem';
import DropZone from './DropZone';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';






const CreateProject = () => {
    const [droppedItems, setDroppedItems] = useState([]);
    const [employees, setEmployees] = useState([]);
    
    const [projectName, setProjectName] = useState(''); // State for project name
    const [description, setDescription] = useState(''); // State for project description
    const [dueDate, setDueDate] = useState(''); // State for Due date
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nameError, setNameError] = useState(''); // State for project name error
    const [selectedSkills, setSelectedSkills] = useState([]); // State for multiple selections of skills in filter
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);  // State for dropdown visibility
    const [selectedPersonality, setSelectedPersonality] = useState([]);
    const [isPersonDropdownOpen, setIsPersonDropdownOpen] = useState(false);

    const navigate = useNavigate();
    const url = "https://backend-server-d9vj.onrender.com";
    /*const navigate = useNavigate();
    const url = "http://localhost:3030";*/ 

    const handleDrop = (item) => {
        setDroppedItems((prevItems) => [...prevItems, { id: item.id, name: item.name }]);    };

    const handleRemoveItem = (index) => {
        const updatedItems = [...droppedItems];
        updatedItems.splice(index, 1);
        setDroppedItems(updatedItems);
    };
    

  
    useEffect(() => {
  
      const fetchEmployees = async () => {
  
        try {
          const response = await axios.get(url+'/api/employees');
          console.log(response.data);
          // Create a Set to track unique employee IDs
          const existingEmployeeIds = new Set(employees.map(employee => employee.id));
          // Filter out duplicates
          const newEmployees = response.data.filter(employee => !existingEmployeeIds.has(employee.id));
          // Update the state with unique employees
          setEmployees(prevEmployees => {
            const existingIds = new Set(prevEmployees.map(employee => employee.id));
            return newEmployees.reduce((acc, employee) => {  
              if (!existingIds.has(employee.id)) {  
                acc.push(employee);
              }
              return acc;
            }, [...prevEmployees]);
          });
        } catch (err) {
          setError('Error fetching employees');
          console.error(err); // Log for debugging
        } finally {
            setLoading(false); // Set loading to false here
        }
        };    
      fetchEmployees();
      }, ); // Empty dependency array to run only once on mount
  
    // Log updated employees
    useEffect(() => {
      console.log("Updated employees:", employees);
      setLoading(false)
    }, [employees]);


    const handleSubmit = async () => {
        // Prepare the data to be submitted
        // Reset error messages
        setNameError('');
        // Validate project name
        if (!projectName) {
            setNameError('Project name is required.');
            alert(nameError);
            return; // Prevent submission if project name is empty
        } 
        const employeeIds = droppedItems.map(item => item.id); // Create an array of employee IDs
        const projectData = {
            name: projectName,
            description: description,
            ids: employeeIds,
            due: dueDate,
        };
        try {
            // First API call to create a project
                const response = await axios.post(url+'/api/create-project', projectData);
                console.log('Project created successfully:', response.data);
                    if (response.data.CreateStatus) {
                    // Prepare data for the second API call
                    const notificationData = {
                        employeeIds: employeeIds,
                        projectName: projectName,
                        dueDate: dueDate,
                    };
      
                    try {
                        // Second API call to send notifications
                        const response2 = await axios.post(url+'/api/send_noti', notificationData);
                        console.log('Notification sent successfully:', response2.data);
                        navigate('/dashboard');  

                    } catch (err) {
                        console.error('Error sending notification:', err);
                        setError('Error sending notification');
                    }
                    alert("Success! Project created and assigned to employees.");
                }
                } catch (err) {
                console.error('Error creating project:', err);
                setError('Error creating project');
            }


    };



    if (loading) return <div>Loading...</div>;

    if (error) return <div>{error}</div>;

    const handleSelect = (skill) => {
        // Check if the skill is already selected
        if (selectedSkills.includes(skill)) {
            // Remove skill if it's already selected
            setSelectedSkills(selectedSkills.filter(s => s !== skill));
        } else {
            // Add skill if it's not already selected
            setSelectedSkills([...selectedSkills, skill]);
        }
    };

    const handlePersonalitySelect = (personality) => {
        if (selectedPersonality.includes(personality)) {
            setSelectedPersonality(selectedPersonality.filter(p => p !== personality));
        } else {
            setSelectedPersonality([...selectedPersonality, personality]);
        }
    };
    
    return (
        <DndProvider backend={HTML5Backend}>
        
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div style={{
                    border: '1px solid #ccc',
                    padding: '20px',
                    borderRadius: '5px'
                }}>
                    <h1>Create Your Project</h1>
                    <input
                        type="text"
                        placeholder="Project Name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                         style={{
                            display: 'flex',
                            justifyContent: 'space-around'
                    }}/>
                        <textarea
                            placeholder="Project Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{
                                   display: 'flex',
                                    justifyContent: 'space-around'
                        }}/>  
                            <input
                                type="date"
                                placeholder="Due Date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                style={{
                                          display: 'flex',
                                           justifyContent: 'space-around',
                        }}/>
                                            <div style={{ display: 'flex', gap: '2em' }}>
                        {/* Skills Dropdown */}
                        <div 
                            className="dropdown" 
                            style={{ minWidth: '15em', position: 'relative' }} 
                            onMouseLeave={() => setIsDropdownOpen(false)} // Close the dropdown when mouse leaves
                         >               
                            <div
                                className={`Select ${isDropdownOpen ? 'select-clicked' : ''}`}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                style={{
                                    background: '#2a2f3b',
                                    color: '#fff',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: '2px #2a2f3b solid',
                                    borderRadius: '0.5em',
                                    padding: '1em',
                                    cursor: 'pointer',
                                    transition: 'background 0.3s',
                                    textAlign: 'left',
                                }}
                            >
                                <span>{selectedSkills.length > 0 ? selectedSkills.join(", ") : "Skills"}</span>
                                <div
                                    className={`caret ${isDropdownOpen ? 'caret-rotate' : ''}`}
                                    style={{
                                        width: 0,
                                        height: 0,
                                        borderLeft: '5px solid transparent',
                                        borderRight: '5px solid transparent',
                                        borderTop: '6px solid #fff',
                                        transition: '0.3s',
                                    }}
                                ></div>
                            </div>

                            {isDropdownOpen && (
                                <ul
                                    className="menu"
                                    style={{
                                        listStyle: 'none',
                                        padding: '0.5em 0.8em',
                                        background: '#323741',
                                        border: '1px #363a43 solid',
                                        boxShadow: '0 0.5em 1em rgba(0, 0, 0, 0.2)',
                                        borderRadius: '0.5em',
                                        color: '#9fa5b5',
                                        position: 'absolute',
                                        top: '3em',
                                        left: '0',
                                        width: '100%',
                                        opacity: 1,
                                        display: 'block',
                                        transition: '0.2s',
                                        zIndex: 1,
                                    }}
                                >
                                    {["C", 
                                        "C++", 
                                        "Go",
                                        "Java",  
                                        "JavaScript",
                                        "PHP",
                                        "Python", 
                                        "Ruby"].map(skill => (
                                        <li key={skill} className={selectedSkills.includes(skill) ? "active" : ""} style={{ padding: '0.7em 0.5em', margin: '0.3em 0', borderRadius: '0.5em', cursor: 'pointer' }}>
                                            <label style={{ 
                                                padding: '0.5em 0.7em',
                                                margin: '0.3em 0',
                                                borderRadius: '0.5em',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5em',
                                            }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSkills.includes(skill)}
                                                    onChange={() => handleSelect(skill)}
                                                    style={{ 
                                                        margin: 0,
                                                        width: '1em',
                                                        height: '1em',
                                                    }}
                                                />
                                                {skill}
                                            </label>
                                        </li>
                                    ))}
                                    <button
                                        onClick={() => setSelectedSkills([])}  // Clears the selected skills
                                        style={{
                                            padding: '0.5em 1em',
                                            margin: '0.7em 0',
                                            borderRadius: '0.5em',
                                            background: '#f44336',
                                            color: 'white',
                                            border: 'none',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            width: '100%',
                                        }}
                                    >
                                        Clear Filter
                                    </button>

                                </ul>
                            )}
                        </div>

                         {/* Personality Dropdown */}
                        <div 
                            className="dropdown" 
                            style={{ minWidth: '15em', position: 'relative' }} 
                            onMouseLeave={() => setIsPersonDropdownOpen(false)} // Close the dropdown when mouse leaves
                        >
                            <div
                                className={`Select ${isPersonDropdownOpen ? 'select-clicked' : ''}`}
                                onClick={() => setIsPersonDropdownOpen(!isPersonDropdownOpen)}
                                style={{
                                    background: '#2a2f3b',
                                    color: '#fff',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: '2px #2a2f3b solid',
                                    borderRadius: '0.5em',
                                    padding: '1em',
                                    cursor: 'pointer',
                                    transition: 'background 0.3s',
                                    textAlign: 'left',
                                }}
                            >
                                <span>{selectedPersonality.length > 0 ? selectedPersonality.join(", ") : "Personality"}</span>
                                <div
                                    className={`caret ${isPersonDropdownOpen ? 'caret-rotate' : ''}`}
                                    style={{
                                        width: 0,
                                        height: 0,
                                        borderLeft: '5px solid transparent',
                                        borderRight: '5px solid transparent',
                                        borderTop: '6px solid #fff',
                                        transition: '0.3s',
                                        marginLeft: '8px'
                                    }}
                                ></div>
                            </div>

                            {isPersonDropdownOpen && (
                                <ul
                                    className="menu"
                                    style={{
                                        listStyle: 'none',
                                        padding: '0.8em',
                                        background: '#323741',
                                        border: '1px #363a43 solid',
                                        boxShadow: '0 0.5em 1em rgba(0, 0, 0, 0.2)',
                                        borderRadius: '0.5em',
                                        color: '#9fa5b5',
                                        position: 'absolute',
                                        top: '3em',
                                        left: '0',
                                        minWidth: '30em',  // ✅ Ensure the dropdown background covers all columns
                                        width: 'max-content', // ✅ Expands if needed
                                        opacity: 1,
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, 1fr)', // ✅ Three-column layout
                                        gap: '0.5em',
                                        transition: '0.2s',
                                        zIndex: 1,
                                    }}
                                >
                                    {[
                                        "Adaptable", "Ambitious", "Analytical", 
                                        "Charismatic", "Collaborative", "Confident", 
                                        "Creative", "Decisive", "Delegation", 
                                        "Detail-oriented", "Diplomatic", "Disciplined", 
                                        "Diligent", "Empathetic", "Flexible", 
                                        "Goal-Oriented", "Humble", "Innovative", 
                                        "Leadership-Oriented", "Motivated", "Optimistic", 
                                        "Reliable", "Resilient", "Social"
                                    ].map(personality => (
                                        <li key={personality} className={selectedPersonality.includes(personality) ? "active" : ""} 
                                            style={{ 
                                                padding: '0.4em', 
                                                borderRadius: '0.5em', 
                                                cursor: 'pointer', 
                                                display: 'flex', 
                                                alignItems: 'center',
                                                gap: '0.5em' 
                                            }}
                                        >
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5em', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPersonality.includes(personality)}
                                                    onChange={() => handlePersonalitySelect(personality)}
                                                    style={{ width: '1em', height: '1em' }}
                                                />
                                                {personality}
                                            </label>
                                        </li>
                                    ))}
                                  <button
                                        onClick={() => setSelectedPersonality([])}
                                        style={{
                                            gridColumn: 'span 3', // ✅ Spans across all three columns
                                            padding: '0.7em 1.5em',
                                            marginTop: '0.8em',
                                            borderRadius: '0.5em',
                                            background: '#f44336',
                                            color: 'white',
                                            border: 'none',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: '100%', // ✅ Ensures full width alignment
                                        }}
                                    >
                                        Clear Filter
                                    </button>
                                </ul>
                            )}
                        </div>
                    </div>


                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-around'
                    }}>
                        <div style={{
                            border: '1px solid #ccc',
                            padding: '10px',
                            borderRadius: '5px'
                        }}>
                            <h2>Drag Items</h2>
                            {employees
                                .filter(employee => {
                                    //Show all employees if no filter is selected
                                    if (selectedSkills.length === 0 && selectedPersonality.length === 0) {
                                        return true;
                                    }
                                
                                    // Split employee skills and traits into an array and check if any selected filter matches
                                    const skillsArray = employee.skills ? employee.skills.split(',').map(skill => skill.trim()) : [];
                                    const PersonalityTraitsArray = employee.personality ? employee.personality.split(',').map(personality => personality.trim()) : [];

                                    // Check if the employee matches selected skills
                                     const matchesSkill = selectedSkills.length === 0 || selectedSkills.some(skill => skillsArray.includes(skill));

                                      // Check if the employee matches selected personality traits
                                    const matchesPersonality = selectedPersonality.length === 0 || selectedPersonality.some(personality => PersonalityTraitsArray.includes(personality));
                                    
                                      // If skills and personality filters are both applied, match both.
                                        return matchesSkill && matchesPersonality;
                                })
                                .map(employee => (
                                    <DragItem key={employee.id} name={employee.eName} id={employee.id} />
                                ))}
                        </div>
                        <div style={{
                            border: '1px solid #ccc',
                            padding: '10px',
                            borderRadius: '5px'
                        }}>
                            <h2>Drop Zone</h2>
                            <DropZone onDrop={handleDrop} />
                            {droppedItems.map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '10px',
                                        borderRadius: '5px',
                                        marginTop: '10px',
                                        backgroundColor: 'lightblue',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <p>{item.name} (ID: {item.id})</p>
                                    <button onClick={() => handleRemoveItem(index)}>Remove</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        style={{
                            padding: '10px',
                            borderRadius: '5px',
                            border: 'none',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </DndProvider>
    );
};

export default CreateProject;