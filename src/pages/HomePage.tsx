import { useEffect, useState } from 'react';
import { fetchTestUsers } from '../api/auth';

export const HomePage = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTestUsers()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <h1>Hello</h1>
      <h2>Data from backend:</h2>
      {error ? <p style={{ color: 'red' }}>Error: {error}</p> : <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};