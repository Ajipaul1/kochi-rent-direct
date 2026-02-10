// Kochi Rent Direct - Vanilla JS for Jamstack

// Obfuscate phone numbers (simple base64 encode/decode for demo)
function encodePhone(phone) {
    return btoa(phone);
}

function decodePhone(encoded) {
    return atob(encoded);
}

// Load properties from data.json
async function loadProperties() {
    try {
        const response = await fetch('data.json');
        const properties = await response.json();
        displayProperties(properties);
    } catch (error) {
        console.error('Error loading properties:', error);
    }
}

// Display properties
function displayProperties(properties) {
    const propertyList = document.getElementById('property-list');
    propertyList.innerHTML = '';

    properties.forEach(property => {
        const card = document.createElement('div');
        card.className = 'property-card';

        const verifiedBadge = property.verified ? '<span class="verified">Verified</span>' : '';

        card.innerHTML = `
            <img src="${property.image}" alt="${property.title}">
            <h3>${property.title}</h3>
            <p><strong>Rent:</strong> ₹${property.rent}/month</p>
            <p><strong>Deposit:</strong> ₹${property.deposit}</p>
            <p><strong>Area:</strong> ${property.area}</p>
            <p><strong>Size:</strong> ${property.size}</p>
            <p>${property.description}</p>
            ${verifiedBadge}
            <a href="#" class="btn btn-whatsapp" onclick="contactOwner('${encodePhone(property.phone)}')">WhatsApp Owner</a>
            <button class="btn btn-report" onclick="reportBroker(${property.id})">Report Broker</button>
        `;

        propertyList.appendChild(card);
    });
}

// Search functionality
function searchProperties() {
    const query = document.getElementById('search').value.toLowerCase();
    const cards = document.querySelectorAll('.property-card');

    cards.forEach(card => {
        const area = card.querySelector('p:nth-child(3)').textContent.toLowerCase();
        if (area.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Contact owner via WhatsApp
function contactOwner(encodedPhone) {
    const phone = decodePhone(encodedPhone);
    const message = encodeURIComponent("Hi, I'm interested in your property listed on Kochi Rent Direct.");
    window.open(`https://wa.me/91${phone}?text=${message}`, '_blank');
}

// Report broker
function reportBroker(propertyId) {
    alert(`Thank you for reporting. We will investigate property ID: ${propertyId}`);
}

// Event listeners
document.getElementById('search-btn').addEventListener('click', searchProperties);
document.getElementById('search').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        searchProperties();
    }
});

// Load properties on page load
document.addEventListener('DOMContentLoaded', loadProperties);
