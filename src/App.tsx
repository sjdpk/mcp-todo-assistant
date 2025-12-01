import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './features/todos/HomePage';
import ChatPage from './features/chat/ChatPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:threadId" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
