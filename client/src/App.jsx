import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Login, ProtectedRoute, Signup, Homepage, Dash, Summary, Recorder, Notes, CreateSummary, YoutubeUpload, TeacherSummary, FinalSummary, UserSummaries, UserTagSummaries, SearchResults } from "./pages";
import { AuthProvider } from "./contexts";


function App() {
  return (
    <>
      <AuthProvider>
      {/* <Navigation /> */}
        <Routes>
          {/* <Route path="/" element={<Navigation />} /> */}
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
          <Route path="/search/:searchText" element={<SearchResults />} />
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
