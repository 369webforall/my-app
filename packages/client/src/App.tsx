import { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);
  return (
    <>
      <p className="bg-red-600 text-white font-semibold">{message}</p>
      <h3>Hi this is new message</h3>
      <Button>Click here! </Button>
    </>
  );
}

export default App;
