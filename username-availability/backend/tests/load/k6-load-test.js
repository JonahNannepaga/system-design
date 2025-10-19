import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:3000'; // Adjust the port as necessary

export let options = {
    vus: 100, // Number of virtual users
    duration: '30s', // Duration of the test
};

export default function () {
    // Test username availability
    let username = `testuser_${Math.floor(Math.random() * 100000)}`;
    let res = http.get(`${BASE_URL}/username/check?username=${username}`);

    check(res, {
        'is status 200': (r) => r.status === 200,
        'username available': (r) => r.json().available === true,
    });

    sleep(1); // Wait for 1 second before the next request
}