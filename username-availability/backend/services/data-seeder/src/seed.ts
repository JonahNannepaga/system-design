import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const seedUsernames = async () => {
    const client = new Client({
        user: 'your_db_user',
        host: 'localhost',
        database: 'your_db_name',
        password: 'your_db_password',
        port: 5432,
    });

    try {
        await client.connect();

        const usernamesPath = path.join(__dirname, 'data', 'usernames.json');
        const usernamesData = fs.readFileSync(usernamesPath, 'utf-8');
        const usernames = JSON.parse(usernamesData);

        for (const username of usernames) {
            await client.query('INSERT INTO usernames (username) VALUES ($1)', [username]);
        }

        console.log('Usernames seeded successfully!');
    } catch (error) {
        console.error('Error seeding usernames:', error);
    } finally {
        await client.end();
    }
};

seedUsernames();