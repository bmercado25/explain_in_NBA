import { Routes, Route } from 'react-router-dom';
import Home from './Components/home';
import Test from './Components/viewprevchat';

const App = () => {
  return (
      <Routes>
        {/* Correct paths starting from the root */}
        <Route path="/" element={<Home />} />
        <Route path="/viewprevchat" element={<Test />} />
      </Routes>
  );
};

export default App;