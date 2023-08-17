/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useState, useContext, createContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);



const RecordingsContext = createContext()

export const RecordingsProivder = ({children}) =>{
  const [recording, setRecording] = useState({
    isLoading : false,
    isRecording : false,
    recordings : [] })
  return (
    <RecordingsContext.Provider value={{recording,setRecording}}>
      {children}
    </RecordingsContext.Provider>
  )
}

export const useRecording = () => useContext(RecordingsContext);


const ExtractedTextContext = createContext();

export const ExtractedTextProvider = ({ children }) => {
  // Instead of a single string, we'll use an object to store extracted texts for each block
  const [extractedTexts, setExtractedTexts] = useState({});

  return (
    <ExtractedTextContext.Provider value={{ extractedTexts, setExtractedTexts }}>
      {children}
    </ExtractedTextContext.Provider>
  );
};

export const useExtractedText = () => useContext(ExtractedTextContext);

