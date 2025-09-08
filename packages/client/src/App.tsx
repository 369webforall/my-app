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
      <Button>Click here! </Button>
    </>
  );
}

export default App;
