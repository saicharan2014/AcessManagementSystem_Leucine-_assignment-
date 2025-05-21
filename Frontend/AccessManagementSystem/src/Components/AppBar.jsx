import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import { isAuthenticated, logout, getCurrentUser } from "../utils/auth";
import { useLocation, useNavigate } from "react-router-dom";

const AppBar = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  console.log(isAuthenticated);
  console.log(location.pathname);

  return (
    <MuiAppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          User Access Management
        </Typography>
        {location.pathname == "/" || (
          <Button color="inherit" onClick={() => navigate("/")}>
            Home
          </Button>
        )}

        {isAuthenticated() ? (
          <>
            <Typography sx={{ mr: 2 }}>Logged in as: {user?.role}</Typography>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => navigate("/signup")}>
              Sign up
            </Button>
            <Button color="inherit" onClick={() => navigate("/login")}>
              Log in
            </Button>
          </>
        )}
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
