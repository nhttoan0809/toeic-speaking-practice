import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/ui/Layout';
import Home from './pages/Home';
import SpeakingWriting from './pages/SpeakingWriting';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/toeic-speaking-practice" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="speaking-writing" element={<SpeakingWriting />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
