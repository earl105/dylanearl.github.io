document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const statusDiv = document.getElementById('status');
    
    // Add event listener to the "Other" checkbox
    const otherCheckbox = document.getElementById('other');
    const otherReasonInput = document.getElementById('otherReason');
    
    if (otherCheckbox && otherReasonInput) {
        otherCheckbox.addEventListener('change', function() {
            otherReasonInput.disabled = !this.checked;
            otherReasonInput.style.opacity = this.checked ? '1' : '0.5';
            
            if (this.checked) {
                otherReasonInput.focus();
            }
        });
        
        // Initialize the state
        otherReasonInput.disabled = !otherCheckbox.checked;
        otherReasonInput.style.opacity = otherCheckbox.checked ? '1' : '0.5';
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;
            
            // Collect form data
            const formData = new FormData(contactForm);
            const fullName = formData.get('fullName');
            const email = formData.get('email');
            const phone = formData.get('phone');
            
            // Get all selected checkboxes
            const checkboxes = document.querySelectorAll('input[name="reason"]:checked');
            let selectedReasons = [];
            
            checkboxes.forEach(checkbox => {
                if (checkbox.value === 'Other') {
                    const otherReason = document.getElementById('otherReason').value;
                    if (otherReason) {
                        selectedReasons.push(`Other: ${otherReason}`);
                    } else {
                        selectedReasons.push('Other');
                    }
                } else {
                    selectedReasons.push(checkbox.value);
                }
            });
            
            const reasonText = selectedReasons.join(', ');
            
            // Create formatted message
            const formattedMessage = `${fullName} has requested to contact you!\n\nThey are interested in: ${reasonText}.\n\nContact them at ${email}${phone ? ` or ${phone}` : ''}.`;
            
            // Add formatted message to form data
            document.getElementById('formattedMessage').value = formattedMessage;
            
            // Submit the form using Fetch API
            fetch(contactForm.action, {
                method: contactForm.method,
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                // Success - show success message
                statusDiv.className = 'form-status success';
                statusDiv.innerHTML = 'Thank you! Your message has been sent successfully.';
                contactForm.reset();
                
                // Reset button state after a delay
                setTimeout(() => {
                    submitBtn.classList.remove('loading');
                    submitBtn.innerText = 'Submit';
                    submitBtn.disabled = false;
                }, 2000);
            })
            .catch(error => {
                // Error - show error message
                statusDiv.className = 'form-status error';
                statusDiv.innerHTML = 'Oops! There was a problem sending your message. Please try again.';
                console.error('Error:', error);
                
                // Reset button state
                submitBtn.classList.remove('loading');
                submitBtn.innerText = 'Submit';
                submitBtn.disabled = false;
            });
        });
    }
});