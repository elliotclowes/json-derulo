import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Login, ProtectedRoute, Signup, Homepage, Dash, Summary, Recorder, Notes, CreateSummary, YoutubeUpload, TeacherSummary, FinalSummary, UserSummaries, UserTagSummaries, SearchResults, UserSettings, SignOut, AudioUpload, NotFound } from "./pages";
import { AuthProvider, ExtractedTextProvider } from "./contexts";


function App() {
  return (
    <>
      <AuthProvider>
      <ExtractedTextProvider>
      {/* <Navigation /> */}
        <Routes>
          {/* <Route path="/" element={<Navigation />} /> */}
          <Route index element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/summary" element={<CreateSummary />}/>
          <Route path="/teacher" element={<TeacherSummary />}/>
          <Route path="/teacher/:documentId" element={< FinalSummary />}/>
          <Route path="/summary/:documentId" element={<Summary />} />
          <Route path="/summaries/" element={<UserSummaries />} />
          <Route path="/signout" element={<SignOut />} />
          <Route path="/summaries/tag/:tagName" element={<UserTagSummaries />} />
          <Route path="/recorder" element={<Recorder />} />
          <Route path="/video" element={<YoutubeUpload />} />
          <Route path="/audio" element={<AudioUpload />} />
          <Route path="/notes" element={<Notes/>} />
          <Route path="/search/:searchText" element={<SearchResults />} />
          <Route path="*" element={<NotFound />} />
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
      </ExtractedTextProvider>
      </AuthProvider>
    </>
  );
}

export default App;
