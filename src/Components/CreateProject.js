import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DragItem from './DragItem';
import DropZone from './DropZone';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const CreateProject = () => {
    const [droppedItems, setDroppedItems] = useState([]);
    const [employees, setEmployees] = useState([]);
    
    const [projectName, setProjectName] = useState(''); // State for project name
    const [description, setDescription] = useState(''); // State for project description
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nameError, setNameError] = useState(''); // State for project name error

    const navigate = useNavigate();

  
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
  
          const response = await axios.get('https://backend-server-d9vj.onrender.com:3030/api/employees');
  
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
      }, []); // Empty dependency array to run only once on mount
  
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
        };
        try {
            // Replace with your actual API endpoint for creating a project
            const response = await axios.post('https://backend-server-d9vj.onrender.com:3030/api/create-project', projectData);
            console.log('Project pass successfully:', response.data);

            if(response.data.CreateStatus){
                alert("Success Create Project and Assign to Employees");
            }
            navigate('/dashboard')


            // Optionally reset the form
/*            setProjectName('');
            setDescription('');
            setDroppedItems([]); */
        } catch (err) {
            console.error('Error creating project:', err);
            setError('Error creating project');
        }
            
    };



    if (loading) return <div>Loading...</div>;

    if (error) return <div>{error}</div>;
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
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-around'
                    }}>
                
                        <div style={{
                            border: '1px solid #ccc',
                            padding: '10px', borderRadius: '5px'
                        }}>
                            <h2>Drag Items</h2>
                            {employees.map(employee => (
                                <DragItem key={employee.id} name={employee.eName} id={employee.id} />
                            ))}
                        </div>
                        <div style={{
                            border: '1px solid #ccc',
                            padding: '10px', borderRadius: '5px'
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
                                    }}>
                                    <p>{item.name} (ID: {item.id})</p> {/* Displaying the ID */}
                                    <button onClick={() => handleRemoveItem(index)}>
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        style={{
                            padding: '10px', borderRadius: '5px',
                            border: 'none', backgroundColor: '#4CAF50',
                            color: 'white', cursor: 'pointer',
                            fontSize: '16' }} >
                    Submit</button>
                </div>
            </div>
        </DndProvider>
    );
};

export default CreateProject;