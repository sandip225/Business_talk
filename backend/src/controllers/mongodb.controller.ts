import { Request, Response } from 'express';
// @ts-ignore
import DigestFetch from 'digest-fetch';

export const getClusters = async (req: Request, res: Response) => {
    try {
        const { publicKey, privateKey, projectId } = req.body;

        if (!publicKey || !privateKey || !projectId) {
            return res.status(400).json({ message: 'Public Key, Private Key, and Project ID are required' });
        }

        // Initialize DigestFetch client
        const client = new DigestFetch(publicKey, privateKey);

        // MongoDB Atlas API Endpoint for Multi-Cloud Clusters
        const url = `https://cloud.mongodb.com/api/atlas/v1.0/groups/${projectId}/clusters`;

        const response = await client.fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            try {
                const errorData = await response.json();
                console.error('MongoDB Atlas API Error:', errorData);
                return res.status(response.status).json({
                    message: `MongoDB Atlas API Error: ${response.statusText}`,
                    details: errorData
                });
            } catch (e) {
                return res.status(response.status).json({
                    message: `MongoDB Atlas API Error: ${response.statusText}`
                });
            }
        }

        const data = await response.json();
        res.json(data);

    } catch (error: any) {
        console.error('Error fetching MongoDB clusters:', error);
        res.status(500).json({ message: 'Failed to fetch clusters', error: error.message });
    }
};
