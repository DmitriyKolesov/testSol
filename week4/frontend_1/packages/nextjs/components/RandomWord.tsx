import { useEffect, useState } from 'react';

export const RandomWord = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://randomuser.me/api/");
      const data = await response.json();
      setData(data.results[0]);
      setLoading(false);
    }
    fetchData().catch(console.error);
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (!data) {
    return <p>No profile data</p>;
  }

  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing useState and useEffect from React library</h2>
        <h1>
          Name: {data.name.title} {data.name.first} {data.name.last}
        </h1>
        <p>Email: {data.email}</p>
      </div>
    </div>
  );
}
