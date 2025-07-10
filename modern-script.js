// Оптимизированный скрипт CleanDrive
document.addEventListener('DOMContentLoaded', function() {
    // Навигация и UI эффекты
    initNavigation();
    
    // Счетчик акции
    initCountdown();
    
    // Обработка формы
    initOrderForm();
    
    // Анимации при скролле
    initScrollAnimations();
    
    // Загрузка завершена
    document.body.classList.add('loaded');
});

// Обработка навигации и UI эффектов
function initNavigation() {
    // Эффект прокрутки для навбара
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Плавная прокрутка для навигационных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Инициализация счетчика обратного отсчета
function initCountdown() {
    const countdownHours = document.getElementById('countdown-hours');
    const countdownMinutes = document.getElementById('countdown-minutes');
    const countdownSeconds = document.getElementById('countdown-seconds');
    
    if (countdownHours && countdownMinutes && countdownSeconds) {
        function updateCountdown() {
            const now = new Date().getTime();
            const endTime = now + (24 * 60 * 60 * 1000); // 24 часа от текущего времени
            const timeLeft = endTime - now;
            
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            countdownHours.textContent = hours.toString().padStart(2, '0');
            countdownMinutes.textContent = minutes.toString().padStart(2, '0');
            countdownSeconds.textContent = seconds.toString().padStart(2, '0');
        }
        
        setInterval(updateCountdown, 1000);
        updateCountdown();
    }
}

// Обработка формы заказа
function initOrderForm() {
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        // Форматирование телефона
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\\D/g, '');
                if (value.length > 0) {
                    if (value[0] === '8') {
                        value = '7' + value.slice(1);
                    }
                    if (value[0] === '7') {
                        value = value.slice(0, 11);
                        const formatted = value.replace(/(\\d{1})(\\d{3})(\\d{3})(\\d{2})(\\d{2})/, '+$1 ($2) $3-$4-$5');
                        e.target.value = formatted;
                    }
                }
            });
        }
        
        // Обработка отправки формы
        orderForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = orderForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            // Показываем состояние загрузки
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправляем...';
            submitButton.disabled = true;
            
            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                city: document.getElementById('city').value || 'Не указан'
            };
            
            try {
                const response = await fetch('/api/telegram', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Успех - редирект на страницу благодарности
                    window.location.href = '/thank-you?name=' + encodeURIComponent(formData.name);
                } else {
                    throw new Error(result.error || 'Ошибка отправки');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('Произошла ошибка при отправке заявки. Попробуйте еще раз.', 'error');
                
                // Восстанавливаем состояние кнопки
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    }
}

// Инициализация анимаций при скролле
function initScrollAnimations() {
    // Анимация элементов при скролле
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

    // Наблюдаем за элементами для анимации
    document.querySelectorAll('.feature-card, .review-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Утилиты
function showNotification(message, type = 'info') {
    // Удаляем существующие уведомления
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#FF4444' : type === 'success' ? '#00FF7F' : '#0066FF'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}