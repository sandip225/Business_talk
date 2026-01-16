import { Request, Response } from 'express';
import { request } from 'urllib';

export const getClusters = async (req: Request, res: Response) => {
    try {
        const { publicKey, privateKey, projectId } = req.body;

        if (!publicKey || !privateKey || !projectId) {
            return res.status(400).json({ message: 'Public Key, Private Key, and Project ID are required' });
        }

        // MongoDB Atlas API Endpoint
        const url = `https://cloud.mongodb.com/api/atlas/v1.0/groups/${projectId}/clusters`;

        // Use urllib for Digest Authentication
        const { status, data } = await request(url, {
            digestAuth: `${publicKey}:${privateKey}`,
            dataType: 'json',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        if (status !== 200) {
            console.error('MongoDB Atlas API Error:', data);
            return res.status(status).json({
                message: `MongoDB Atlas API Error: ${status}`,
                details: data
            });
        }

        res.json(data);

    } catch (error: any) {
        console.error('Error fetching MongoDB clusters:', error);
        res.status(500).json({ message: 'Failed to fetch clusters', error: error.message });
    }
};
