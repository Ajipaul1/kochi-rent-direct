import { Client, Account, Storage, ID } from "appwrite";

const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject('698b11d3000bb9f04eff');

const account = new Account(client);
const storage = new Storage(client);

// Register
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    try {
        await account.create(ID.unique(), email, password);
        alert('Registration successful');
    } catch (error) {
        alert('Registration failed: ' + error.message);
    }
});

// Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    try {
        await account.createEmailSession(email, password);
        document.getElementById('auth').style.display = 'none';
        document.getElementById('upload').style.display = 'block';
        alert('Login successful');
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
});

// Upload Photo
document.getElementById('upload-btn').addEventListener('click', async () => {
    const file = document.getElementById('photo-input').files[0];
    if (!file) {
        alert('Please select a file');
        return;
    }
    try {
        const response = await storage.createFile('photos', ID.unique(), file);
        document.getElementById('upload-status').textContent = 'Upload successful: ' + response.$id;
    } catch (error) {
        document.getElementById('upload-status').textContent = 'Upload failed: ' + error.message;
    }
});
