import { Client, Account, Storage, Databases, ID } from "appwrite";

const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject('698b11d3000bb9f04eff');

const account = new Account(client);
const storage = new Storage(client);
const databases = new Databases(client);

// Register
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    try {
        await account.create(ID.unique(), email, password);
        alert('Registration successful! Please login with your credentials.');
        document.getElementById('register-form').reset();
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
        document.getElementById('dashboard').style.display = 'block';
        loadProperties();
        alert('Login successful');
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
});

// Check auth on load
async function checkAuth() {
    try {
        await account.get();
        document.getElementById('auth').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        loadProperties();
    } catch {
        // not logged in
    }
}

checkAuth();

// Logout
document.getElementById('logout-btn').addEventListener('click', async () => {
    await account.deleteSession('current');
    window.location.reload();
});

// Load properties
async function loadProperties() {
    try {
        const user = await account.get();
        const response = await databases.listDocuments('properties', [], { filter: `ownerId=${user.$id}` });
        const listDiv = document.getElementById('properties-list');
        listDiv.innerHTML = '';
        response.documents.forEach(doc => {
            const div = document.createElement('div');
            div.className = 'property-card';
            div.innerHTML = `
                <h4>${doc.title}</h4>
                <p>Type: ${doc.type} | City: ${doc.city} | Area: ${doc.area}</p>
                <p>Size: ${doc.size} | Bedrooms: ${doc.bedrooms} | Bathrooms: ${doc.bathrooms}</p>
                <p>Furnished: ${doc.furnished} | Parking: ${doc.parking}</p>
                <p>Rent: ₹${doc.rent} | Deposit: ₹${doc.deposit}</p>
                <p>Description: ${doc.description}</p>
                <p>Phone: ${doc.phone}</p>
                <img src="${doc.image}" alt="Property Image" style="width: 200px; height: auto;">
                <button onclick="editProperty('${doc.$id}')">Edit</button>
                <button onclick="deleteProperty('${doc.$id}', '${doc.image}')">Delete</button>
            `;
            listDiv.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading properties:', error);
    }
}

// Add/Edit property
document.getElementById('add-property-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('prop-title').value;
    const rent = parseInt(document.getElementById('prop-rent').value);
    const deposit = parseInt(document.getElementById('prop-deposit').value);
    const area = document.getElementById('prop-area').value;
    const size = document.getElementById('prop-size').value;
    const description = document.getElementById('prop-description').value;
    const phone = document.getElementById('prop-phone').value;
    const file = document.getElementById('prop-photo').files[0];
    const editId = document.getElementById('edit-id').value;

    try {
        const user = await account.get();
        let imageUrl = '';
        if (file) {
            const fileId = ID.unique();
            await storage.createFile('photos', fileId, file);
            imageUrl = `https://sgp.cloud.appwrite.io/v1/storage/buckets/photos/files/${fileId}/view?project=698b11d3000bb9f04eff`;
        }

        let data = { title, rent, deposit, area, size, description, phone, image: imageUrl, ownerId: user.$id };

        if (editId) {
            if (!file) {
                const currentDoc = await databases.getDocument('properties', editId);
                data.image = currentDoc.image;
            }
            await databases.updateDocument('properties', editId, data);
            alert('Property updated successfully!');
        } else {
            await databases.createDocument('properties', ID.unique(), data);
            alert('Property added successfully!');
        }

        document.getElementById('add-property-form').reset();
        document.getElementById('edit-id').value = '';
        document.querySelector('#add-property-form button').textContent = 'Add Property';
        loadProperties();
    } catch (error) {
        alert('Error saving property: ' + error.message);
    }
});

// Edit property
window.editProperty = async function(id) {
    try {
        const doc = await databases.getDocument('properties', id);
        document.getElementById('prop-title').value = doc.title;
        document.getElementById('prop-type').value = doc.type;
        document.getElementById('prop-city').value = doc.city;
        document.getElementById('prop-area').value = doc.area;
        document.getElementById('prop-size').value = doc.size;
        document.getElementById('prop-bedrooms').value = doc.bedrooms;
        document.getElementById('prop-bathrooms').value = doc.bathrooms;
        document.getElementById('prop-furnished').value = doc.furnished;
        document.getElementById('prop-parking').value = doc.parking;
        document.getElementById('prop-rent').value = doc.rent;
        document.getElementById('prop-deposit').value = doc.deposit;
        document.getElementById('prop-description').value = doc.description;
        document.getElementById('prop-phone').value = doc.phone;
        document.getElementById('edit-id').value = id;
        document.querySelector('#add-property-form button').textContent = 'Update Property';
        // Note: File input can't be pre-filled for security reasons
    } catch (error) {
        alert('Error loading property for edit: ' + error.message);
    }
};

// Delete property
window.deleteProperty = async function(id, imageUrl) {
    if (confirm('Are you sure you want to delete this property?')) {
        try {
            await databases.deleteDocument('properties', id);
            // Optionally delete image from storage
            alert('Property deleted successfully!');
            loadProperties();
        } catch (error) {
            alert('Error deleting property: ' + error.message);
        }
    }
};
