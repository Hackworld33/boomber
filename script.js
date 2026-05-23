document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Add a slight delay to the outline for a smooth effect
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Interactive elements change cursor size
    const interactives = document.querySelectorAll('a, button, input[type="range"], .faq-question');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '50px';
            cursorOutline.style.height = '50px';
            cursorOutline.style.borderColor = 'var(--accent-purple)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '30px';
            cursorOutline.style.height = '30px';
            cursorOutline.style.borderColor = 'rgba(0, 243, 255, 0.5)';
        });
    });


    // --- 2. Loading Screen ---
    const loader = document.getElementById('loader');
    const loaderBar = document.querySelector('.loader-bar');
    
    // Simulate loading
    let progress = 0;
    const loadInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        loaderBar.style.width = `${progress}%`;
        
        if (progress === 100) {
            clearInterval(loadInterval);
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    initCounters(); // Start counters after loader disappears
                }, 500);
            }, 500);
        }
    }, 150);


    // --- 3. Form Range Input Sync ---
    const rangeInput = document.getElementById('messageCount');
    const rangeValue = document.getElementById('rangeValue');
    const totalCountDisplay = document.getElementById('totalCount');

    rangeInput.addEventListener('input', (e) => {
        rangeValue.textContent = e.target.value;
        totalCountDisplay.textContent = e.target.value;
    });


    // --- 4. Fake Dashboard Logic ---
    const attackForm = document.getElementById('attackForm');
    const dashboard = document.getElementById('dashboard');
    const stopBtn = document.getElementById('stopBtn');
    const sentCountEl = document.getElementById('sentCount');
    const progressBar = document.getElementById('progressBar');
    const logsContainer = document.getElementById('logsContainer');

    let attackInterval;
    let currentSent = 0;
    let targetTotal = 0;

    attackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const targetNumber = document.getElementById('targetNumber').value;
        targetTotal = parseInt(rangeInput.value);
        currentSent = 0;
        
        // Reset Dashboard
        sentCountEl.textContent = '0';
        progressBar.style.width = '0%';
        logsContainer.innerHTML = `
            <div class="log-entry">> Establishing secure connection to ${targetNumber}...</div>
            <div class="log-entry success">> Connected to relay node 0x7A2.</div>
            <div class="log-entry">> Preparing payload sequence...</div>
        `;

        // Show Dashboard
        dashboard.classList.remove('hidden');

        // Start Fake Attack
        startAttack();
    });

    stopBtn.addEventListener('addEventListener', () => {
        abortAttack();
    });
    
    stopBtn.onclick = abortAttack;

    function startAttack() {
        if (attackInterval) clearInterval(attackInterval);
        
        addLog('> OPERATION STARTED', 'success');

        attackInterval = setInterval(() => {
            currentSent++;
            sentCountEl.textContent = currentSent;
            
            const percentage = (currentSent / targetTotal) * 100;
            progressBar.style.width = `${percentage}%`;

            // Random Logs
            if (currentSent % 10 === 0) {
                const logs = [
                    `> Packet ${currentSent} delivered successfully.`,
                    `> Bypassing carrier filtering...`,
                    `> Injecting payload chunk...`,
                    `> Routing through proxy pool...`
                ];
                addLog(logs[Math.floor(Math.random() * logs.length)], 'success');
            }

            if (currentSent >= targetTotal) {
                clearInterval(attackInterval);
                addLog('> OPERATION COMPLETE.', 'success');
                setTimeout(() => {
                    dashboard.classList.add('hidden');
                }, 4000);
            }
        }, 50); // Speed of fake sending
    }

    function abortAttack() {
        if (attackInterval) clearInterval(attackInterval);
        addLog('> OPERATION ABORTED BY USER.', 'error');
        setTimeout(() => {
            dashboard.classList.add('hidden');
        }, 2000);
    }

    function addLog(message, type = '') {
        const log = document.createElement('div');
        log.className = `log-entry ${type}`;
        log.textContent = message;
        logsContainer.appendChild(log);
        logsContainer.scrollTop = logsContainer.scrollHeight;
    }


    // --- 5. Statistics Counters ---
    const counters = document.querySelectorAll('.counter');
    let countersStarted = false;

    function initCounters() {
        if (countersStarted) return;
        countersStarted = true;

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // ms
            const step = target / (duration / 16); // 60fps

            let current = 0;
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.innerText = Number.isInteger(target) ? Math.ceil(current) : current.toFixed(1);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    }

    // Optional: Start counters on scroll if they are further down
    window.addEventListener('scroll', () => {
        const statsSection = document.getElementById('stats');
        const sectionPos = statsSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight;

        if(sectionPos < screenPos) {
            initCounters();
        }
    });

    // --- 6. FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });

});
