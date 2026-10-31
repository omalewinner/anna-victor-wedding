document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. COUNTDOWN TIMER ---
    const targetDate = new Date("Dec 28, 2026 09:00:00").getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            document.getElementById("countdown").innerHTML = "<p style='color:white; font-size:1.5rem;'>We are married! 🎉</p>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = String(days).padStart(2, '0');
        document.getElementById("hours").innerText = String(hours).padStart(2, '0');
        document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
        document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);


    // --- 2. DARK / LIGHT MODE TOGGLE ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const iconMoon = themeToggleBtn.querySelector('.icon-moon');
    const iconSun = themeToggleBtn.querySelector('.icon-sun');
    
    const setTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            iconMoon.style.display = 'none';
            iconSun.style.display = 'block';
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            iconMoon.style.display = 'block';
            iconSun.style.display = 'none';
            localStorage.setItem('theme', 'light');
        }
    };

    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        setTheme(isDark ? 'light' : 'dark');
    });


    // --- 2.5 STORY TABS ---
    window.switchStory = function(side) {
        document.getElementById('btn-her').classList.remove('active');
        document.getElementById('btn-his').classList.remove('active');
        document.getElementById(`btn-${side}`).classList.add('active');

        document.getElementById('story-her').classList.remove('active');
        document.getElementById('story-his').classList.remove('active');
        document.getElementById(`story-${side}`).classList.add('active');

        const tag = document.getElementById('story-image-tag');
        const img = document.getElementById('story-image');
        
        if (side === 'her') {
            tag.innerText = "as told by Anna";
            img.src = "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=800&auto=format&fit=crop";
        } else {
            tag.innerText = "as told by Victor";
            img.src = "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop";
        }
    };


    // --- 2.6 WEDDING CREW TABS ---
    window.switchCrew = function(crew) {
        document.getElementById('btn-bridesmaids').classList.remove('active');
        document.getElementById('btn-groomsmen').classList.remove('active');
        document.getElementById(`btn-${crew}`).classList.add('active');

        document.getElementById('crew-bridesmaids').classList.remove('active');
        document.getElementById('crew-groomsmen').classList.remove('active');
        document.getElementById(`crew-${crew}`).classList.add('active');
    };


    // --- 3. WISHES FORM ---
    const wishForm = document.getElementById('wish-form');
    const formStatus = document.getElementById('form-status');
    const wishesDisplay = document.getElementById('wishes-display');

    if(wishForm) {
        wishForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const message = document.getElementById('message').value;
            
            formStatus.innerText = "Sending...";

            try {
                const response = await fetch('/submit-wish', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, message })
                });
                
                const data = await response.json();
                
                if (data.status === 'success') {
                    formStatus.innerText = "Thank you! Your blessing has been received.";
                    wishForm.reset();

                    // Create the new wish bubble dynamically
                    const newWish = document.createElement('div');
                    newWish.classList.add('wish-bubble', 'new-wish-anim');
                    newWish.innerHTML = `
                        <p class="wish-text">"${message}"</p>
                        <p class="wish-name">— ${name}</p>
                    `;

                    // Add it to the top of the display
                    wishesDisplay.prepend(newWish);

                    // Clear the status message after 4 seconds
                    setTimeout(() => {
                        formStatus.innerText = "";
                    }, 4000);

                } else {
                    formStatus.innerText = data.message;
                }
            } catch (error) {
                formStatus.innerText = "Something went wrong. Please try again.";
            }
        });
            // --- 0. MOBILE MENU TOGGLE ---
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });

        closeMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });

        // Close menu when a link is clicked
        window.closeMobileMenu = function() {
            mobileMenu.classList.remove('active');
        };
    }
    }


    // --- 4. COPY ACCOUNT NUMBER ---
    window.copyAccount = function() {
        const accNum = document.getElementById('acc-num').innerText;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(accNum).then(() => {
                const btn = document.querySelector('.copy-btn');
                const originalText = btn.innerText;
                btn.innerText = "COPIED!";
                btn.style.background = "var(--gold)";
                btn.style.color = "#0E2A22";
                btn.style.borderColor = "var(--gold)";
                
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = "transparent";
                    btn.style.color = "#A7C4BC";
                    btn.style.borderColor = "#A7C4BC";
                }, 2000);
            });
        } else {
            alert("Account Number: " + accNum);
        }
    };


    // --- 5. REGISTRY CONTRIBUTION MODAL & PAYSTACK ---
    let currentItem = "";
    const modal = document.getElementById('contribute-modal');
    const amountInput = document.getElementById('pay-amount');
    const payBtn = document.getElementById('pay-submit-btn');

    window.openModal = function(title, goal, raised) {
        currentItem = title;
        document.getElementById('modal-item-title').innerText = title;
        
        const remaining = goal - raised;
        if (goal === 0) {
            document.getElementById('modal-item-remaining').innerText = "General Cash Gift";
        } else if (remaining <= 0) {
            document.getElementById('modal-item-remaining').innerText = "Fully funded! Thank you!";
        } else {
            document.getElementById('modal-item-remaining').innerText = `₦${remaining.toLocaleString()} to go`;
        }

        // Reset inputs
        amountInput.value = "";
        document.getElementById('pay-name').value = "";
        document.getElementById('pay-email').value = "";
        document.getElementById('pay-note').value = "";
        payBtn.innerText = "GIVE";
        
        // Clear active state on quick buttons
        document.querySelectorAll('.quick-btn').forEach(btn => btn.classList.remove('active'));

        modal.classList.add('active');
    };

    window.closeModal = function() {
        modal.classList.remove('active');
    };

    // Close modal if clicking outside of it
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    window.setAmount = function(val, btn) {
        amountInput.value = val;
        payBtn.innerText = `GIVE ₦${val.toLocaleString()}`;
        
        // Highlight the selected button
        document.querySelectorAll('.quick-btn').forEach(b => b.classList.remove('active'));
        if(btn) btn.classList.add('active');
    };

    // Update button text when typing manually
    if (amountInput) {
        amountInput.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            if (!isNaN(val) && val > 0) {
                payBtn.innerText = `GIVE ₦${val.toLocaleString()}`;
            } else {
                payBtn.innerText = "GIVE";
            }
        });
    }

    window.processPayment = function() {
        const amount = parseFloat(amountInput.value);
        const name = document.getElementById('pay-name').value;
        const email = document.getElementById('pay-email').value;

        if (!amount || amount < 500) {
            alert("Please enter a valid amount (Minimum ₦500).");
            return;
        }
        if (!name) {
            alert("Please enter your name.");
            return;
        }
        if (!email) {
            alert("Please enter your email for the receipt.");
            return;
        }

        payBtn.innerText = "Processing...";
        payBtn.disabled = true;

        // --- PAYSTACK INTEGRATION ---
        let handler = PaystackPop.setup({
            key: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxx', // 🔴 REPLACE WITH YOUR ACTUAL PAYSTACK PUBLIC KEY
            email: email,
            amount: amount * 100, // Paystack uses Kobo
            currency: 'NGN',
            ref: 'AV26_' + Math.floor((Math.random() * 1000000000) + 1),
            metadata: {
                custom_fields: [
                    {
                        display_name: "Contributor Name",
                        variable_name: "contributor_name",
                        value: name
                    },
                    {
                        display_name: "Gift Item",
                        variable_name: "gift_item",
                        value: currentItem
                    },
                    {
                        display_name: "Note",
                        variable_name: "note",
                        value: document.getElementById('pay-note').value || "No note"
                    }
                ]
            },
            callback: function(response) {
                // Payment was successful
                closeModal();
                alert(`Thank you ${name}! Your gift of ₦${amount.toLocaleString()} for "${currentItem}" was successful.\nReference: ${response.reference}`);
                payBtn.innerText = "GIVE";
                payBtn.disabled = false;
            },
            onClose: function() {
                // User closed the popup
                payBtn.innerText = `GIVE ₦${amount.toLocaleString()}`;
                payBtn.disabled = false;
            }
        });
        
        handler.openIframe();
    };
});