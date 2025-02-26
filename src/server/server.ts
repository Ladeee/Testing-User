const express = require('express');
const axios = require('axios'); 
const cors = require('cors'); // Import cors


const app = express();
const port = process.env.PORT || 5000
app.use(cors());

require('dotenv').config();

app.get('/', async (req: any, res: any) => {
    try {
        const response = await axios.get('https://dummyjson.com/users?limit=20'); 
        const users = response.data.users;
        res.json(users); 
        console.log(users)
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' }); 
    }
});

app.get("/users/:id", async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`https://dummyjson.com/users/${id}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export default app;
