// Contact page-specific JavaScript with advanced validation & spam protection

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector('.feedback-form');
    if (!form) return;
    form.setAttribute('novalidate', '');

    // Build request endpoint depending on how the page is served
    const endpoint = window.location.protocol === 'file:'
        ? 'http://localhost:3000/send-message'
        : '/send-message';

    // 1. Dynamically inject Honeypot
    const honeypotInput = document.createElement('input');
    honeypotInput.type = 'text';
    honeypotInput.name = '_honeypot';
    honeypotInput.id = 'honeypot';
    honeypotInput.style.display = 'none';
    honeypotInput.tabIndex = -1;
    honeypotInput.autocomplete = 'off';
    form.insertBefore(honeypotInput, form.firstChild);

    // 2. Dynamically inject Math CAPTCHA before the submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    const captchaContainer = document.createElement('div');
    captchaContainer.className = 'captcha-container';
    captchaContainer.style.marginBottom = '1rem';
    
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;
    let expectedAnswer = num1 + num2;
    
    captchaContainer.innerHTML = `
        <label for="captcha-answer" style="display:block; margin-bottom:0.5rem; font-weight:600;">Spam Check: What is ${num1} + ${num2}?</label>
        <input type="text" id="captcha-answer" name="captcha" placeholder="Answer here" required style="width:100%; padding:0.8rem; border:1px solid #ddd; border-radius:4px; font-family:inherit; margin-bottom: 0.5rem;">
        <div id="captcha-error" style="color:red; font-size:0.85rem; margin-top:0.3rem; display:none;">Incorrect answer</div>
    `;
    form.insertBefore(captchaContainer, submitBtn);

    // Create a generic error container for the form
    const formStatus = document.createElement('div');
    formStatus.id = 'form-status';
    formStatus.style.marginTop = '1rem';
    formStatus.style.fontWeight = '600';
    formStatus.style.display = 'none';
    form.appendChild(formStatus);

    // Utility: Create error message containers for inputs
    const inputs = ['name', 'email', 'subject', 'message'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const errorDiv = document.createElement('div');
            errorDiv.id = `${id}-error`;
            errorDiv.style.color = 'red';
            errorDiv.style.fontSize = '0.85rem';
            errorDiv.style.marginTop = '-0.8rem';
            errorDiv.style.marginBottom = '1rem';
            errorDiv.style.display = 'none';
            el.parentNode.insertBefore(errorDiv, el.nextSibling);
        }
    });

    let lastSubmitTime = 0;

    const showError = (id, message) => {
        const errorDiv = document.getElementById(`${id}-error`);
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    };

    const clearErrors = () => {
        inputs.forEach(id => {
            const errorDiv = document.getElementById(`${id}-error`);
            if (errorDiv) errorDiv.style.display = 'none';
        });
        document.getElementById('captcha-error').style.display = 'none';
        formStatus.textContent = '';
        formStatus.style.display = 'none';
    };

    // Strip HTML Tags
    const sanitizeHTML = (str) => {
        return str.replace(/<[^>]*>?/gm, '');
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        // Spam Protection: Rate limit check (15 seconds)
        const now = Date.now();
        if (now - lastSubmitTime < 15000) {
            formStatus.textContent = "Please wait 15 seconds before sending another message.";
            formStatus.style.color = 'red';
            formStatus.style.display = 'block';
            return;
        }

        // Honeypot check
        if (honeypotInput.value !== '') {
            // Silently drop
            formStatus.textContent = "Message sent successfully";
            formStatus.style.color = 'green';
            formStatus.style.display = 'block';
            return;
        }

        let hasError = false;

        // Fetch & sanitize values
        const nameVal = sanitizeHTML(document.getElementById('name').value.trim());
        const emailVal = sanitizeHTML(document.getElementById('email').value.trim());
        const subjectVal = sanitizeHTML(document.getElementById('subject').value.trim());
        const messageVal = sanitizeHTML(document.getElementById('message').value.trim());
        const captchaVal = document.getElementById('captcha-answer').value.trim();

        // 1. Name Validation
        if (nameVal.length < 3 || !/^[A-Za-z\s]+$/.test(nameVal)) {
            showError('name', 'Please enter a valid name (letters only, min 3 chars).');
            hasError = true;
        }

        // 2. Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
            showError('email', 'Email format is incorrect.');
            hasError = true;
        }

        // 3. Subject Validation
        if (subjectVal.length < 5) {
            showError('subject', 'Subject must be at least 5 characters.');
            hasError = true;
        } else if (/^[\d\W]+$/.test(subjectVal)) {
            showError('subject', 'Subject cannot contain only numbers or symbols.');
            hasError = true;
        }

        // 4. Message Validation & Spam check
        if (messageVal.length < 15) {
            showError('message', 'Message must be at least 15 characters.');
            hasError = true;
        } else if (/(.)\1{5,}/.test(messageVal)) {
            showError('message', 'Too many repeated characters detected.');
            hasError = true;
        } else if ((messageVal.match(/https?:\/\//g) || []).length > 2) {
            showError('message', 'Message contains too many URLs.');
            hasError = true;
        }

        // 5. Captcha Validation
        if (parseInt(captchaVal, 10) !== expectedAnswer) {
            document.getElementById('captcha-error').style.display = 'block';
            hasError = true;
        }

        if (hasError) return;

        // Pre-flight success
        lastSubmitTime = Date.now();
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Please wait...';
        formStatus.textContent = '';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: nameVal,
                    email: emailVal,
                    subject: subjectVal,
                    message: messageVal
                })
            });

            const data = await response.json();

            if (response.ok) {
                formStatus.textContent = 'Message sent successfully';
                formStatus.style.color = 'green';
                form.reset();
                // Regenerate captcha
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                expectedAnswer = num1 + num2;
                document.querySelector('label[for="captcha-answer"]').textContent = `Spam Check: What is ${num1} + ${num2}?`;
            } else {
                formStatus.textContent = data.error || 'Failed to send message.';
                formStatus.style.color = 'red';
            }
        } catch (error) {
            formStatus.textContent = 'Network error. Make sure the backend server is running.';
            formStatus.style.color = 'red';
        } finally {
            formStatus.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
});
