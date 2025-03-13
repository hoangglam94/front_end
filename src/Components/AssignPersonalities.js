import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from 'axios';

const personalityTraitsList = [
    'Empathetic',
    'Analytical',
    'Creative',
    'Detail-oriented',
    'Adaptable',
    'Confident',
    'Collaborative',
    'Resilient'
];

const AssignPersonalityTraits = () => {
    const url = "https://backend-server-d9vj.onrender.com";
    const [selectedTraits, setSelectedTraits] = useState([]);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const token = localStorage.getItem('token');

                const result = await axios.get(url + '/api/get-email', {
                    headers: {
                        Authorization: `${token}`
                    }
                });

                const temp = result.data.email;
                setEmail(temp);
                setLoading(false);
                return temp;
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
        const trait = event.target.value;
        setSelectedTraits((prevTraits) =>
            prevTraits.includes(trait)
                ? prevTraits.filter((t) => t !== trait)
                : [...prevTraits, trait]
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        axios.post(url + '/dashboard/personality', { selectedTraits }, { params: { email } })
            .then(result => {
                console.log(result);
                if (result.data.AssignStatus) {
                    navigate('/dashboard'); // Redirect to dashboard
                } else {
                    alert(result.data.Error);
                    navigate('/dashboard');
                }
            })
            .catch(err => console.log(err));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Select Your Personality Traits</h1>
            <form onSubmit={handleSubmit}>
                {personalityTraitsList.map((trait) => (
                    <div key={trait}>
                        <label>
                            <input
                                type="checkbox"
                                value={trait}
                                checked={selectedTraits.includes(trait)}
                                onChange={handleCheckboxChange}
                            />
                            {trait}
                        </label>
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default AssignPersonalityTraits;