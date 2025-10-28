import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import AuthLayout from "./Auth/AuthLayout";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import { useAuthContext } from "../context/AuthContext";
import { CustomSpinnerWithText } from "../components/Spinner/Spinner";
import MessagesLayout from "./Messages/MessagesLayout";
import MessagesReceiver from "./Messages/MessagesReceiver";
import ProfileLayout from "./Profile/ProfileLayout";
import ProfileReceiver from "./Profile/ProfileReceiver";

export const Router = () => {
  const { authUser, loading } = useAuthContext();

  if (loading) return <CustomSpinnerWithText />;

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth protection */}
        <Route element={<AuthLayout authUser={authUser} />}>
          <Route index element={<Navigate to="/messages" />} />

          {/* Messages */}
          <Route path="messages" element={<MessagesLayout />}>
            <Route path=":messageReceiver" element={<MessagesReceiver />} />
          </Route>

          {/* Profile */}
          <Route path="profile" element={<ProfileLayout />}>
            <Route path=":profileId" element={<ProfileReceiver />} />
          </Route>
        </Route>

        {/* Auth routes */}
        <Route
          path="login"
          element={authUser ? <Navigate to="/messages" /> : <Login />}
        />
        <Route
          path="signup"
          element={authUser ? <Navigate to="/messages" /> : <Signup />}
        />
      </Routes>
    </BrowserRouter>
  );
};
