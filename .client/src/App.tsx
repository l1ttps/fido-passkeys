import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./page/login";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Fido pass key</h1>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
