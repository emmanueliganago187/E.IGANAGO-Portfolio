function toggletheme() {
    const body = document.body;

    body.classList.toggle('dark-theme');

    if (body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

window.onload = function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme')
    }
}

// Handle form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Stop page reload
    
    const form = this;
    const btn = form.querySelector('.messagebtn');
    
    // Get form data
    const formData = new FormData(form);
    formData.append('_captcha', 'false');
    
    // Show loading
    btn.textContent = 'Sending...';
    btn.disabled = true;
    
    // Send to FormSubmit
    fetch('https://formsubmit.co/ajax/emmanueliganago187@gmail.com', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success === "true") {
            // Show popup message
            showPopup('✅ Message sent successfully!', 'success');
            // Clear form
            form.reset();
        } else {
            showPopup('❌ Failed to send message', 'error');
        }
    })
    .catch(error => {
        showPopup('❌ Error sending message please check your internet connection', 'error');
        console.error('Error:', error);
    })
    .finally(() => {
        // Reset button
        btn.textContent = 'Submit';
        btn.disabled = false;
    });
});

// Function to show popup
function showPopup(message, type) {
    // Remove existing popup
    const existingPopup = document.querySelector('.popup-message');
    if (existingPopup) existingPopup.remove();
    
    // Create popup
    const popup = document.createElement('div');
    popup.className = `popup-message ${type}`;
    popup.textContent = message;
    
    // Style the popup
    popup.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 9999;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    
    // Color based on type
    if (type === 'success') {
        popup.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    } else {
        popup.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
    }
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(popup);
    
    // Remove after 3 seconds
    setTimeout(() => {
        popup.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => popup.remove(), 500);
    }, 3000);
}