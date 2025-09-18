// Auto Insurance Landing Page - Interactive JavaScript

(function() {
    'use strict';

    // DOM Content Loaded Event
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
    });

    // Initialize all features
    function initializeApp() {
        setupMobileMenu();
        setupFAQAccordion();
        setupSmoothScrolling();
        setupSavingsCalculator();
        setupAffiliateTracking();
        animateOnScroll();
    }

    // Mobile Menu Toggle
    function setupMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', function() {
                navLinks.classList.toggle('mobile-active');
                menuToggle.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                    navLinks.classList.remove('mobile-active');
                    menuToggle.classList.remove('active');
                }
            });
        }
    }


    // FAQ Accordion
    function setupFAQAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');

            question.addEventListener('click', function() {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';

                // Close all other FAQs
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle current FAQ
                item.classList.toggle('active');
                question.setAttribute('aria-expanded', !isExpanded);

                // Track FAQ interaction
                trackEvent('faq_click', {
                    question: question.textContent.trim()
                });
            });
        });
    }

    // Smooth Scrolling
    function setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                if (href !== '#' && href !== '') {
                    e.preventDefault();

                    const target = document.querySelector(href);
                    if (target) {
                        const headerHeight = document.querySelector('.header').offsetHeight;
                        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // Savings Calculator
    function setupSavingsCalculator() {
        const currentPaymentInput = document.getElementById('current-payment');
        const savingsAmountSpan = document.getElementById('savings-amount');
        const yearlySavingsSpan = document.getElementById('yearly-savings');

        if (currentPaymentInput && savingsAmountSpan && yearlySavingsSpan) {
            currentPaymentInput.addEventListener('input', function() {
                const currentPayment = parseFloat(this.value) || 200;

                // Calculate potential savings (40% average)
                const potentialSavings = Math.round(currentPayment * 0.4);
                const yearlySavings = potentialSavings * 12;

                // Update display with animation
                animateNumber(savingsAmountSpan, potentialSavings);
                animateNumber(yearlySavingsSpan, yearlySavings);

                // Track calculator usage
                trackEvent('calculator_used', {
                    current_payment: currentPayment,
                    potential_savings: potentialSavings
                });
            });

            // Trigger initial calculation
            currentPaymentInput.dispatchEvent(new Event('input'));
        }
    }

    // Animate number changes
    function animateNumber(element, target) {
        const start = parseInt(element.textContent) || 0;
        const duration = 500;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const current = Math.round(start + (target - start) * progress);
            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // Affiliate Link Tracking
    function setupAffiliateTracking() {
        const affiliateLinks = document.querySelectorAll('.affiliate-link');

        affiliateLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const provider = this.dataset.provider;
                const trackingId = this.dataset.trackingId;
                const campaign = this.dataset.campaign;

                // Track click event
                trackEvent('affiliate_click', {
                    provider: provider,
                    tracking_id: trackingId,
                    campaign: campaign,
                    timestamp: new Date().toISOString()
                });

                // In production, you would add actual tracking pixels here
                console.log(`Affiliate link clicked: ${provider}`);
            });
        });
    }


    // Show Notification
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 16px 24px;
            background-color: ${type === 'success' ? '#28A745' : type === 'error' ? '#DC3545' : '#0066CC'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Track Events (Analytics)
    function trackEvent(eventName, eventData = {}) {
        // In production, send to analytics service
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }

        // Console log for development
        console.log('Event tracked:', eventName, eventData);

        // Store in localStorage for debugging
        const events = JSON.parse(localStorage.getItem('tracked_events') || '[]');
        events.push({
            name: eventName,
            data: eventData,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('tracked_events', JSON.stringify(events.slice(-50))); // Keep last 50 events
    }

    // Animate Elements on Scroll
    function animateOnScroll() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements
        const elementsToAnimate = document.querySelectorAll(
            '.provider-card, .step, .testimonial, .faq-item'
        );

        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }

        .animated {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

        .nav-links.mobile-active {
            display: flex !important;
            position: fixed;
            top: 60px;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border-radius: 8px;
            z-index: 999;
        }

        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }

        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }

        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    `;
    document.head.appendChild(style);

    // Performance Monitoring
    window.addEventListener('load', function() {
        if ('performance' in window) {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

            console.log(`Page load time: ${pageLoadTime}ms`);

            // Track performance metrics
            trackEvent('page_performance', {
                load_time: pageLoadTime,
                dom_ready: perfData.domContentLoadedEventEnd - perfData.navigationStart,
                first_paint: performance.getEntriesByType('paint')[0]?.startTime || 0
            });
        }
    });

    // Handle Back Button / Browser Navigation
    window.addEventListener('popstate', function(e) {
        // Handle any state changes if needed
        console.log('Navigation event:', e);
    });

    // Lazy Loading for Images (if needed in future)
    function setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Export functions for external use if needed
    window.InsuranceApp = {
        trackEvent: trackEvent,
        showNotification: showNotification
    };

})();