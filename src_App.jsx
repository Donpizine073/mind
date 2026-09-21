import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RedirectPage from "./pages/RedirectPage";
import "./pages/redirect.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/go" element={<RedirectPage />} />
        <Route path="*" element={<Navigate to="/go" replace />} />
      </Routes>
    </BrowserRouter>
  );
}