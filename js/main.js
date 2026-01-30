/**
 * Main JavaScript for танец.фест Festival Website
 * Features: Countdown Timer, Mobile Navigation, Form Validation, Smooth Scroll
 */

// ====================================
// COUNTDOWN TIMER
// ====================================
const countdownDate = new Date('May 16, 2026 10:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = countdownDate - now;
    
    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Update DOM
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    
    // Check if countdown is finished
    if (distance < 0) {
        clearInterval(countdownInterval);
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minutesEl) minutesEl.textContent = '00';
        if (secondsEl) secondsEl.textContent = '00';
    }
}

// Update countdown every second
const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// ====================================
// MOBILE NAVIGATION
// ====================================
const burger = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
if (burger) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav') && navMenu.classList.contains('active')) {
        burger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ====================================
// SMOOTH SCROLL
// ====================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 90;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ====================================
// HEADER SCROLL EFFECT
// ====================================
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ====================================
// FILE UPLOAD HANDLING
// ====================================
const fileInput = document.getElementById('mp3file');
const fileName = document.getElementById('fileName');
const fileLabel = document.querySelector('.file-label');

if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        
        if (file) {
            // Validate file type
            const validTypes = ['audio/mpeg', 'audio/mp3'];
            const fileExtension = file.name.split('.').pop().toLowerCase();
            
            if (!validTypes.includes(file.type) && fileExtension !== 'mp3') {
                showError('fileError', 'Пожалуйста, выберите MP3 файл');
                fileInput.value = '';
                fileName.textContent = '';
                return;
            }
            
            // Validate file size (max 50MB)
            const maxSize = 50 * 1024 * 1024;
            if (file.size > maxSize) {
                showError('fileError', 'Размер файла не должен превышать 50 МБ');
                fileInput.value = '';
                fileName.textContent = '';
                return;
            }
            
            // Display file name
            fileName.textContent = `Выбран файл: ${file.name} (${formatFileSize(file.size)})`;
            clearError('fileError');
            if (fileLabel) {
                fileLabel.style.borderColor = '#9c27b0';
                fileLabel.style.background = '#f3e5f5';
            }
        } else {
            fileName.textContent = '';
            if (fileLabel) {
                fileLabel.style.borderColor = '#bdbdbd';
                fileLabel.style.background = '#fafafa';
            }
        }
    });
}

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ====================================
// FORM VALIDATION
// ====================================
const applicationForm = document.getElementById('applicationForm');

// Validation functions
function validateName(name) {
    return name.trim().length >= 2;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
}

function validateCategory(category) {
    return category !== '';
}

function validateFile(fileInput) {
    return fileInput.files.length > 0;
}

// Show error message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Clear error message
function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// Real-time validation
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const categoryInput = document.getElementById('category');

if (nameInput) {
    nameInput.addEventListener('blur', () => {
        if (!validateName(nameInput.value)) {
            showError('nameError', 'Имя должно содержать минимум 2 символа');
        } else {
            clearError('nameError');
        }
    });
}

if (emailInput) {
    emailInput.addEventListener('blur', () => {
        if (!validateEmail(emailInput.value)) {
            showError('emailError', 'Введите корректный email адрес');
        } else {
            clearError('emailError');
        }
    });
}

if (phoneInput) {
    // Phone formatting
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value[0] === '7' || value[0] === '8') {
                value = '7' + value.substring(1);
            }
            
            let formatted = '+7';
            if (value.length > 1) {
                formatted += ' (' + value.substring(1, 4);
            }
            if (value.length >= 4) {
                formatted += ') ' + value.substring(4, 7);
            }
            if (value.length >= 7) {
                formatted += '-' + value.substring(7, 9);
            }
            if (value.length >= 9) {
                formatted += '-' + value.substring(9, 11);
            }
            
            e.target.value = formatted;
        }
    });
    
    phoneInput.addEventListener('blur', () => {
        if (!validatePhone(phoneInput.value)) {
            showError('phoneError', 'Введите корректный номер телефона');
        } else {
            clearError('phoneError');
        }
    });
}

if (categoryInput) {
    categoryInput.addEventListener('change', () => {
        if (!validateCategory(categoryInput.value)) {
            showError('categoryError', 'Пожалуйста, выберите категорию');
        } else {
            clearError('categoryError');
        }
    });
}

// ====================================
// FORM SUBMISSION
// ====================================
if (applicationForm) {
    applicationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear all previous errors
        clearError('nameError');
        clearError('emailError');
        clearError('phoneError');
        clearError('categoryError');
        clearError('fileError');
        
        // Get form values
        const name = nameInput.value;
        const email = emailInput.value;
        const phone = phoneInput.value;
        const category = categoryInput.value;
        const ensemble = document.getElementById('ensemble').value;
        const message = document.getElementById('message').value;
        const file = fileInput.files[0];
        
        let isValid = true;
        
        // Validate all fields
        if (!validateName(name)) {
            showError('nameError', 'Имя должно содержать минимум 2 символа');
            isValid = false;
        }
        
        if (!validateEmail(email)) {
            showError('emailError', 'Введите корректный email адрес');
            isValid = false;
        }
        
        if (!validatePhone(phone)) {
            showError('phoneError', 'Введите корректный номер телефона');
            isValid = false;
        }
        
        if (!validateCategory(category)) {
            showError('categoryError', 'Пожалуйста, выберите категорию');
            isValid = false;
        }
        
        if (!validateFile(fileInput)) {
            showError('fileError', 'Пожалуйста, прикрепите MP3 файл');
            isValid = false;
        }
        
        // If validation fails, stop submission
        if (!isValid) {
            showFormMessage('Пожалуйста, исправьте ошибки в форме', 'error');
            return;
        }
        
        // Disable submit button
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
        
        // Prepare form data
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('category', category);
        formData.append('ensemble', ensemble);
        formData.append('message', message);
        formData.append('mp3file', file);
        
        try {
            // Send form data to server
            const response = await fetch('submit.php', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const result = await response.json();
                
                if (result.success) {
                    // Show success message
                    showFormMessage('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.', 'success');
                    
                    // Reset form
                    applicationForm.reset();
                    fileName.textContent = '';
                    if (fileLabel) {
                        fileLabel.style.borderColor = '#bdbdbd';
                        fileLabel.style.background = '#fafafa';
                    }
                    
                    // Scroll to success message
                    document.getElementById('formMessage').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    showFormMessage(result.message || 'Произошла ошибка при отправке формы', 'error');
                }
            } else {
                throw new Error('Server error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showFormMessage('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.', 'error');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Show form message (success or error)
function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        
        // Auto-hide message after 10 seconds
        setTimeout(() => {
            formMessage.className = 'form-message';
        }, 10000);
    }
}

// ====================================
// SCROLL ANIMATIONS
// ====================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements with animation
document.querySelectorAll('.stat-card, .program-card, .format-card, .jury-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});

// ====================================
// PAGE LOAD ANIMATION
// ====================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});

// ====================================
// VIDEO MODAL
// ====================================
function openVideoModal(videoUrl) {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoFrame');
    
    if (modal && iframe) {
        iframe.src = videoUrl + '?autoplay=1';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoFrame');
    
    if (modal && iframe) {
        modal.classList.remove('active');
        iframe.src = '';
        document.body.style.overflow = '';
    }
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeVideoModal();
    }
});

// Make functions global
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;

// ====================================
// CONSOLE MESSAGE
// ====================================
console.log('%cтанец.фест 2.0', 'font-size: 32px; font-weight: bold; color: #9c27b0;');
console.log('%cВсероссийский фестиваль хореографического искусства', 'font-size: 14px; color: #616161;');
console.log('%c16 мая 2026', 'font-size: 18px; font-weight: bold; color: #9c27b0; margin-top: 10px;');
