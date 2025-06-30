import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Dashboard1 from "./Dashboard1";
import Dashboard3 from "./Dashboard3";
import Dashboard4 from "./Dashboard4";
import Dashboard5 from "./Dashboard5";  
import Dashboard6 from "./Dashboard6";
import Dashboard7 from "./Dashboard7";
import Dashboard8 from "./Dashboard8";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/staff" element={<Dashboard1 />} />
        <Route path="/student" element={<Dashboard8 />} />
        <Route path="/member4" element={<Dashboard6 />} />
        <Route path="/member3" element={<Dashboard5 />} />
        <Route path="/member2" element={<Dashboard4 />} />
        <Route path="/member1" element={<Dashboard3 />} />
        <Route path="/professor" element={<Dashboard7 />} />
      </Routes>
    </Router>
  );
}

export default App;
