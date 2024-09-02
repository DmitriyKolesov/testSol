import {useEffect, useState} from 'react';
import {API_URL} from "~~/app/constants";

export const TokenSupply = () => {
    const [result, setResult] = useState<any>(null);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null);
                const response = await fetch(`${API_URL}/total-supply`);
                const data = await response.json();
                setResult(data.result);
                setLoading(false);
            } catch (error) {
                // @ts-ignore
                setError(error);
            }
        }
        fetchData();
    }, []);

    if (isLoading) {
        return <p>Loading...</p>;
    }
    if (!result) {
        return <p>No data</p>;
    }
    if (error) {
        // @ts-ignore
        return <p>Error: {error.message}</p>;
    }

    return (
        <div className="card w-96 bg-primary text-primary-content mt-4">
            <div className="card-body">
                <h2 className="card-title">Token supply</h2>
                <h1>
                    {result}
                </h1>
            </div>
        </div>
    );
}
