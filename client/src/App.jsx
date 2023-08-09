import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Login, ProtectedRoute, Signup, Homepage, Dash, Summary, Recorder, Notes } from "./pages";
import { AuthProvider } from "./contexts";
import { Navigation } from './components';


function App() {
  return (
    <>
      <AuthProvider>
      <Navigation />
        <Routes>
          <Route path="/" element={<Navigation />} />
          <Route index element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/summary/:documentId" element={<Summary />} />
          <Route path="/recorder" element={<Recorder />} />
          <Route path="/notes" element={<Notes/>} />
          {/* Use ProtectedRoute for /dash and its nested routes */}
          <Route
            path="/dash"
            element={
              <ProtectedRoute redirectTo="/login">
                <Dash />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
