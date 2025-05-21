import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PrivateRoute from "./Components/PrivateRoute";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import CreateSoftware from "./Pages/CreateSoftware";
import RequestAccess from "./Pages/RequestAccess";
import PendingRequests from "./Pages/PendingRequests";
import Home from "./Components/Home/Home";
import { Box } from "@mui/material";
import AppBar from "./Components/AppBar";

const App = () => {
  return (
    <Router>
      <AppBar />
      <Box sx={{ padding: 3 }}>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoute allowedRoles={["Admin"]} />}>
            <Route path="/create-software" element={<CreateSoftware />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={["Manager", "Admin"]} />}>
            <Route path="/pending-requests" element={<PendingRequests />} />
          </Route>

          <Route
            element={<PrivateRoute allowedRoles={["Employee", "Admin"]} />}
          >
            <Route path="/request-access" element={<RequestAccess />} />
          </Route>

          <Route path="/" element={<Home />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
