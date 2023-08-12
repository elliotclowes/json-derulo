import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Login, ProtectedRoute, Signup, Homepage, Dash, Summary, Recorder, Notes, CreateSummary, YoutubeUpload, TeacherSummary, FinalSummary, UserSummaries, UserTagSummaries } from "./pages";
import { AuthProvider } from "./contexts";
import { Navigation, Footer } from './components';


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
          <Route path="/summary" element={<CreateSummary />}/>
          <Route path="/teacher" element={<TeacherSummary />}/>
          <Route path="/teacher/:documentId" element={< FinalSummary />}/>
          <Route path="/summary/:documentId" element={<Summary />} />
          <Route path="/summaries/" element={<UserSummaries />} />
          <Route path="/summaries/tag/:tagName" element={<UserTagSummaries />} />
          <Route path="/recorder" element={<Recorder />} />
          <Route path="/video" element={<YoutubeUpload />} />
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
        <Footer />
      </AuthProvider>
    </>
  );
}

export default App;
