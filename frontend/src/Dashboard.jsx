import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, TextField, Box } from "@mui/material";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [userRole, setRole] = useState("");
  const [formData, setFormData] = useState({to: '', subject: '', message: ''});
  const [response, setResponse] = useState('');
  

  useEffect(() => {
    // Retrieve the user and role from localStorage
    const storedUser = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    console.log("Stored User:", storedUser); // Debugging log
    console.log("Stored Role:", storedRole); // Debugging log

    if (storedUser && storedRole) {
      setUser(storedUser);
      setRole(storedRole);

      // If the user is not a student, redirect them
      if (storedRole !== "admin") {
        console.log("Not admin, redirecting to login..."); // Debugging log
        navigate("/staff"); // Redirect to the appropriate page
      }
    } else {
      console.log("No user or role found, redirecting to login..."); // Debugging log

    }
  }, [navigate]);

const handleChange = e =>{
    setFormData({...formData, [e.target.name]: e.target.value});
}

const handleSubmit = async e => {
    e.preventDefault();
    try {
        const res = await axios.post('http://localhost:5000/api/send-email', formData);
        setResponse(res.data.message);
    } catch (error) {
        setResponse(error.response?.data?.message || 'Error sending email');
    }
}

  return (
    <div>
      <Container>
      <Typography variant="h4">
              Welcome {userRole} {user}
            </Typography>

        <h2>SEND EMAIL</h2>
        
        <form onSubmit={handleSubmit} >
        <input name="to" type="email" placeholder="email" required onChange={handleChange}/>
        <br/>
        <br/>
        <input name="subject"  placeholder="subject" required onChange={handleChange}/>
        <br/>
        <br/>
        <textarea name="message"  placeholder="message" required onChange={handleChange}/>
        <br/><br/>
        <button>
          Send
        </button>
        </form>
        {response && <p>{response}</p>}


      <Button
        style= {{ marginTop: '20px'}}
        variant="contained"
        color="secondary"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          localStorage.removeItem("role");
          navigate("/login");
        }}
      >
        Logout
      </Button>
    </Container>
    </div>
  );
};

export default Dashboard;
