document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initStatCounters();
    initNewsletterForm();
    initDonationForm();
    initTestimonialSlider();
    initStoryFilter();
    initScrollAnimation();
    initSmoothScroll();
    initVolunteerForm();
    initContactForm();
    initProgramTabs();
    
    setActiveNavLink();
});

function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mainMenu = document.getElementById('mainMenu');
    
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', () => {
            mainMenu.classList.toggle('show');
            
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#menuToggle') && !e.target.closest('#mainMenu') && mainMenu.classList.contains('show')) {
                mainMenu.classList.remove('show');
                
                const spans = menuToggle.querySelectorAll('span');
                spans.forEach(span => span.classList.remove('active'));
            }
        });
    }
}

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const linkPage = link.getAttribute('href');
        if (currentPage === linkPage || 
            (currentPage === '' && linkPage === 'index.html') || 
            (currentPage === '/' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length > 0) {
        function animateStats() {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
                const duration = 2000;
                const increment = target / (duration / 20);
                let current = 0;
                
                const counter = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target.toLocaleString() + '+';
                        clearInterval(counter);
                    } else {
                        stat.textContent = Math.floor(current).toLocaleString() + '+';
                    }
                }, 20);
            });
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        });

        const statsSection = document.querySelector('.stats-container');
        if (statsSection) {
            statsSection.parentElement.classList.add('stats-section');
            observer.observe(document.querySelector('.stats-section'));
        }
    }
}

function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            
            if (validateEmail(email)) {
                showMessage('Thank you for subscribing to our newsletter!', 'success');
                e.target.reset();
                
                console.log('Newsletter subscription:', email);
            } else {
                showMessage('Please enter a valid email address.', 'error');
            }
        });
    }
}

function initDonationForm() {
    const donationForm = document.getElementById('donation-form');
    
    if (donationForm) {
        const amountOptions = document.querySelectorAll('.amount-option');
        const customAmountInput = document.getElementById('custom-amount');
        
        amountOptions.forEach(option => {
            option.addEventListener('click', () => {
                amountOptions.forEach(opt => opt.classList.remove('active'));
                
                option.classList.add('active');
                
                const amount = option.getAttribute('data-amount');
                document.getElementById('donation-amount').value = amount;
                
                if (customAmountInput) {
                    customAmountInput.value = '';
                }
            });
        });
        
        if (customAmountInput) {
            customAmountInput.addEventListener('input', () => {
                amountOptions.forEach(opt => opt.classList.remove('active'));
                
                document.getElementById('donation-amount').value = customAmountInput.value;
            });
        }
        
        const paymentMethods = document.querySelectorAll('.payment-method');
        const paymentForms = document.querySelectorAll('.payment-form');
        
        if (paymentMethods.length > 0) {
            paymentMethods.forEach(method => {
                method.addEventListener('click', () => {
                    paymentMethods.forEach(m => m.classList.remove('active'));
                    
                    method.classList.add('active');
                    
                    const paymentType = method.getAttribute('data-method');
                    document.getElementById('payment-method').value = paymentType;
                    
                    paymentForms.forEach(form => {
                        form.style.display = 'none';
                    });
                    
                    document.getElementById(`${paymentType}-form`).style.display = 'block';
                });
            });
        }
        
        donationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(donationForm);
            const donationData = {};
            
            for (const [key, value] of formData.entries()) {
                donationData[key] = value;
            }
            
            if (validateDonationForm(donationData)) {
                showMessage('Thank you for your generous donation!', 'success');
                
                console.log('Donation data:', donationData);
                
                setTimeout(() => {
                    donationForm.reset();
                    if (amountOptions.length > 0) {
                        amountOptions[0].click();
                    }
                    if (paymentMethods.length > 0) {
                        paymentMethods[0].click();
                    }
                }, 1000);
            }
        });
    }
}

function initTestimonialSlider() {
    const testimonialSlider = document.querySelector('.testimonial-slider');
    
    if (testimonialSlider) {
        const slides = testimonialSlider.querySelectorAll('.testimonial-item');
        const totalSlides = slides.length;
        let currentSlide = 0;
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'slider-btn prev-btn';
        prevBtn.innerHTML = '❮';
        testimonialSlider.appendChild(prevBtn);
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'slider-btn next-btn';
        nextBtn.innerHTML = '❯';
        testimonialSlider.appendChild(nextBtn);
        
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-dots';
        testimonialSlider.appendChild(dotsContainer);
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.className = 'slider-dot';
            dot.setAttribute('data-slide', i);
            dotsContainer.appendChild(dot);
            
            dot.addEventListener('click', () => {
                goToSlide(i);
            });
        }
        
        function goToSlide(n) {
            slides[currentSlide].classList.remove('active');
            dotsContainer.querySelectorAll('.slider-dot')[currentSlide].classList.remove('active');
            
            currentSlide = (n + totalSlides) % totalSlides;
            
            slides[currentSlide].classList.add('active');
            dotsContainer.querySelectorAll('.slider-dot')[currentSlide].classList.add('active');
        }
        
        goToSlide(0);
        
        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
        });
        
        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
        });
        
        let slideInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 5000);
        
        testimonialSlider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        testimonialSlider.addEventListener('mouseleave', () => {
            slideInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 5000);
        });
    }
}

function initStoryFilter() {
    const storyFilter = document.querySelector('.story-filter');
    
    if (storyFilter) {
        const filterButtons = storyFilter.querySelectorAll('.filter-btn');
        const storyItems = document.querySelectorAll('.story-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                
                storyItems.forEach(item => {
                    if (filter === 'all' || item.classList.contains(filter)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
}

function initScrollAnimation() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
}

function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initVolunteerForm() {
    const volunteerForm = document.getElementById('volunteer-form');
    
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(volunteerForm);
            const volunteerData = {};
            
            for (const [key, value] of formData.entries()) {
                volunteerData[key] = value;
            }
            
            if (validateVolunteerForm(volunteerData)) {
                showMessage('Thank you for your interest in volunteering! We will contact you soon.', 'success');
                
                console.log('Volunteer data:', volunteerData);
                
                volunteerForm.reset();
            }
        });
    }
}

function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const contactData = {};
            
            for (const [key, value] of formData.entries()) {
                contactData[key] = value;
            }
            
            if (validateContactForm(contactData)) {
                showMessage('Thank you for your message! We will get back to you soon.', 'success');
                
                console.log('Contact data:', contactData);
                
                contactForm.reset();
            }
        });
    }
}

function initProgramTabs() {
    const programTabs = document.querySelectorAll('.program-tab');
    const programContents = document.querySelectorAll('.program-content-item');
    
    if (programTabs.length > 0 && programContents.length > 0) {
        programTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                programTabs.forEach(t => t.classList.remove('active'));
                
                tab.classList.add('active');
                
                const tabId = tab.getAttribute('data-tab');
                
                programContents.forEach(content => {
                    content.classList.remove('active');
                });
                
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        const hash = window.location.hash.substring(1);
        if (hash) {
            const tabToActivate = document.querySelector(`.program-tab[data-tab="${hash}"]`);
            if (tabToActivate) {
                tabToActivate.click();
            }
        }
    }
}

function showMessage(message, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        messageEl.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        messageEl.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(messageEl);
        }, 300);
    }, 3000);
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validateDonationForm(data) {
    if (!data.amount || isNaN(data.amount) || parseFloat(data.amount) <= 0) {
        showMessage('Please enter a valid donation amount.', 'error');
        return false;
    }
    
    if (!data.fullName || data.fullName.trim() === '') {
        showMessage('Please enter your full name.', 'error');
        return false;
    }
    
    if (!validateEmail(data.email)) {
        showMessage('Please enter a valid email address.', 'error');
        return false;
    }
    
    if (data.paymentMethod === 'card') {
        if (!data.cardNumber || data.cardNumber.replace(/\s/g, '').length !== 16) {
            showMessage('Please enter a valid card number.', 'error');
            return false;
        }
        
        if (!data.cardExpiry || !data.cardExpiry.match(/^\d{2}\/\d{2}$/)) {
            showMessage('Please enter a valid expiry date (MM/YY).', 'error');
            return false;
        }
        
        if (!data.cardCvv || !data.cardCvv.match(/^\d{3,4}$/)) {
            showMessage('Please enter a valid CVV.', 'error');
            return false;
        }
    }
    
    return true;
}

function validateVolunteerForm(data) {
    if (!data.fullName || data.fullName.trim() === '') {
        showMessage('Please enter your full name.', 'error');
        return false;
    }
    
    if (!validateEmail(data.email)) {
        showMessage('Please enter a valid email address.', 'error');
        return false;
    }
    
    if (!data.phone || data.phone.trim() === '') {
        showMessage('Please enter your phone number.', 'error');
        return false;
    }
    
    if (!data.availability || data.availability === 'select') {
        showMessage('Please select your availability.', 'error');
        return false;
    }
    
    if (!data.interests || data.interests.length === 0) {
        showMessage('Please select at least one area of interest.', 'error');
        return false;
    }
    
    return true;
}

function validateContactForm(data) {
    if (!data.name || data.name.trim() === '') {
        showMessage('Please enter your name.', 'error');
        return false;
    }
    
    if (!validateEmail(data.email)) {
        showMessage('Please enter a valid email address.', 'error');
        return false;
    }
    
    if (!data.subject || data.subject.trim() === '') {
        showMessage('Please enter a subject.', 'error');
        return false;
    }
    
    if (!data.message || data.message.trim() === '') {
        showMessage('Please enter your message.', 'error');
        return false;
    }
    
    return true;
}

function formatCardNumber(input) {
    if (input) {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            
            e.target.value = value;
        });
    }
}

function formatCardExpiry(input) {
    if (input) {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            
            e.target.value = value;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const cardNumberInput = document.getElementById('card-number');
    const cardExpiryInput = document.getElementById('card-expiry');
    
    if (cardNumberInput) {
        formatCardNumber(cardNumberInput);
    }
    
    if (cardExpiryInput) {
        formatCardExpiry(cardExpiryInput);
    }
});