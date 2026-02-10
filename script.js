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

// Wait for page to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Get the form
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        console.error('Form with id="contactForm" not found!');
        return;
    }
    
    // Handle form submission
    contactForm.addEventListener('submit', function(event) {
        // Get the submit button
        const submitBtn = this.querySelector('.messagebtn');
        if (submitBtn) {
            // Change button to loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
        }
        
        // Show sending popup
        showPopup('📤 Sending your message...', 'info');
    });
    
    // Check if form was just submitted successfully (Netlify redirect)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('submission-success')) {
        // Show success message
        showPopup('✅ Message sent successfully!', 'success');
        
        // Clear the form
        contactForm.reset();
        
        // Reset button if it exists
        const submitBtn = contactForm.querySelector('.messagebtn');
        if (submitBtn) {
            submitBtn.textContent = 'Submit';
            submitBtn.disabled = false;
        }
        
        // Clean URL - remove the success parameter
        window.history.replaceState({}, '', window.location.pathname);
    }
});

// POPUP FUNCTION - Shows beautiful notifications with your custom colors
function showPopup(message, type = 'info') {
    // Detect if dark theme is preferred
    const isDarkTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Your colors: rgb(11, 20, 35) for light theme, white for dark theme
    const backgroundColor = isDarkTheme ? 'rgb(255, 255, 255)' : 'rgb(11, 20, 35)';
    const textColor = isDarkTheme ? 'rgb(11, 20, 35)' : 'rgb(255, 255, 255)';
    
    // Remove any existing popup first
    const existingPopup = document.querySelector('.popup-notification');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Create popup element
    const popup = document.createElement('div');
    popup.className = 'popup-notification';
    
    // Set icon based on type
    let icon;
    switch(type) {
        case 'success':
            icon = '✅';
            break;
        case 'error':
            icon = '❌';
            break;
        case 'info':
            icon = '📤';
            break;
        default:
            icon = '💬';
    }
    
    // Popup HTML structure with your custom colors
    popup.innerHTML = `
        <div style="
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px;
            border-radius: 12px;
            background: ${backgroundColor};
            color: ${textColor};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-weight: 500;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            max-width: 320px;
            animation: popupSlideIn 0.3s ease-out;
            border: ${isDarkTheme ? '1px solid rgba(11, 20, 35, 0.1)' : 'none'};
        ">
            <span style="font-size: 20px;">${icon}</span>
            <span style="flex: 1;">${message}</span>
        </div>
    `;
    
    // Add CSS animation if not already added
    if (!document.querySelector('#popup-styles')) {
        const style = document.createElement('style');
        style.id = 'popup-styles';
        style.textContent = `
            @keyframes popupSlideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes popupFadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            .popup-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add popup to page
    document.body.appendChild(popup);
    
    // Auto-remove after delay
    const removeDelay = type === 'info' ? 3000 : 4000;
    setTimeout(() => {
        popup.style.animation = 'popupFadeOut 0.5s ease-out';
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 500);
    }, removeDelay);
}

// Button hover effects (optional enhancement)
document.addEventListener('DOMContentLoaded', function() {
    const messageBtn = document.querySelector('.messagebtn');
    if (messageBtn) {
        // Add smooth transition
        messageBtn.style.transition = 'all 0.3s ease';
        
        messageBtn.addEventListener('mouseenter', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
            }
        });
        
        messageBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    }
});

// Resume Download Functionality
document.querySelector('.btresume').addEventListener('click', function(e) {
    e.preventDefault(); // Prevent default link behavior
    
    // Add click animation to SVG
    const svg = this.querySelector('.download');
    svg.style.transition = 'transform 0.3s ease';
    svg.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        svg.style.transform = 'scale(1)';
    }, 300);
    
    // Start download process
    downloadResume();
});

// Download Resume Function
function downloadResume() {
    // Create invisible download link
    const link = document.createElement('a');
    
    // Method 1: If you have the PDF in your project folder
    link.href = 'E.IGANAGO Porfolio Resume.pdf'; // Make sure this file exists
    link.download = 'E.IGANAGO Porfolio Resume.pdf';
    
    // Method 2: If using Google Drive link (uncomment and use this instead)
    // link.href = 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID';
    // link.download = 'Emmanuel-Iganago-Resume.pdf';
    
    // Method 3: If you want to generate PDF from HTML (more complex)
    // generatePDF();
    
    // Add to page, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success popup after a short delay
    setTimeout(() => {
        showResumeDownloadedPopup();
    }, 500);
}

// Show Resume Downloaded Popup
function showResumeDownloadedPopup() {
    // Check if popup already exists
    let popup = document.querySelector('.resume-download-popup');
    
    if (!popup) {
        // Create popup
        popup = document.createElement('div');
        popup.className = 'resume-download-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <div class="popup-icon">✅</div>
                <h3>Resume Downloaded!</h3>
                <p>Check your device's download folder.</p>
                <p><small>File: <em>Emmanuel-Iganago-Resume.pdf</em></small></p>
                <button class="popup-close-btn">Got It</button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(popup);
        
        // Add close functionality
        const closeBtn = popup.querySelector('.popup-close-btn');
        closeBtn.addEventListener('click', () => {
            popup.style.animation = 'popupFadeOut 0.3s ease';
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
            }, 300);
        });
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            if (popup.parentNode) {
                popup.style.animation = 'popupFadeOut 0.3s ease';
                setTimeout(() => {
                    if (popup.parentNode) {
                        popup.parentNode.removeChild(popup);
                    }
                }, 300);
            }
        }, 5000);
        
        // Close when clicking outside
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.style.animation = 'popupFadeOut 0.3s ease';
                setTimeout(() => {
                    if (popup.parentNode) {
                        popup.parentNode.removeChild(popup);
                    }
                }, 300);
            }
        });
    }
    
    // Show popup
    popup.style.display = 'flex';
    
    // Add popup styles if not already added
    if (!document.querySelector('#resume-popup-styles')) {
        const style = document.createElement('style');
        style.id = 'resume-popup-styles';
        style.textContent = `
            .resume-download-popup {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 99999;
                animation: popupFadeIn 0.3s ease;
            }
            
            .resume-download-popup .popup-content {
                background: white;
                padding: 30px;
                border-radius: 16px;
                text-align: center;
                max-width: 350px;
                width: 90%;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                animation: popupSlideUp 0.4s ease;
            }
            
            .resume-download-popup .popup-icon {
                font-size: 50px;
                color: #10b981;
                margin-bottom: 15px;
                animation: iconBounce 0.6s ease;
            }
            
            .resume-download-popup h3 {
                color: #1f2937;
                margin-bottom: 10px;
                font-size: 22px;
            }
            
            .resume-download-popup p {
                color: #6b7280;
                margin-bottom: 8px;
                line-height: 1.5;
            }
            
            .resume-download-popup small {
                color: #9ca3af;
                font-size: 13px;
            }
            
            .resume-download-popup .popup-close-btn {
                background: #10b981;
                color: white;
                border: none;
                padding: 10px 25px;
                border-radius: 25px;
                font-weight: 500;
                cursor: pointer;
                margin-top: 15px;
                transition: all 0.3s ease;
            }
            
            .resume-download-popup .popup-close-btn:hover {
                background: #0da271;
                transform: translateY(-2px);
            }
            
            @keyframes popupFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes popupFadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            
            @keyframes popupSlideUp {
                from {
                    transform: translateY(30px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            @keyframes iconBounce {
                0%, 20%, 50%, 80%, 100% {
                    transform: translateY(0);
                }
                40% {
                    transform: translateY(-15px);
                }
                60% {
                    transform: translateY(-7px);
                }
            }
            
            /* Mobile styles */
            @media (max-width: 768px) {
                .resume-download-popup .popup-content {
                    padding: 25px 20px;
                    max-width: 300px;
                }
                
                .resume-download-popup h3 {
                    font-size: 20px;
                }
                
                .resume-download-popup .popup-icon {
                    font-size: 45px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Optional: Generate PDF from HTML (if you want dynamic resume)
function generatePDF() {
    // This would use a library like jsPDF or html2pdf
    // You need to include the library first
    /*
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add your resume content
    doc.text("Emmanuel Iganago - Resume", 10, 10);
    // ... add more content
    
    // Save the PDF
    doc.save('Emmanuel-Iganago-Resume.pdf');
    
    // Show popup
    showResumeDownloadedPopup();
    */
    
    // Fallback if no library
    alert('Please make sure you have uploaded the PDF file to your server.');
}