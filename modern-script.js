// Современный скрипт CleanDrive в стиле set24.kz
document.addEventListener('DOMContentLoaded', function() {
    // Навигация и UI эффекты
    initNavigation();
    
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
                window.scrollTo({
                    top: target.offsetTop - 80, // Учитываем высоту navbar
                    behavior: 'smooth'
                });
            }
        });
    });

    // Анимация для элементов при загрузке главного экрана
    const heroElements = document.querySelectorAll('.hero .animated');
    heroElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
}

// Инициализация анимаций при скролле
function initScrollAnimations() {
    // Анимации при скролле для карточек и других элементов
    const animatedElements = document.querySelectorAll('.animated:not(.hero *)');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });

    // Добавляем стили для анимации
    if (!document.getElementById('animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            .animated {
                transition: opacity 0.5s ease, transform 0.5s ease;
            }
            .animated.visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            .delay-1.visible {
                transition-delay: 0.1s;
            }
            .delay-2.visible {
                transition-delay: 0.2s;
            }
            .delay-3.visible {
                transition-delay: 0.3s;
            }
        `;
        document.head.appendChild(style);
    }
}

// Обработка формы заказа
function initOrderForm() {
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Получаем данные из формы
            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                city: document.getElementById('city')?.value || ''
            };
            
            // Валидация
            if (!formData.name || !formData.phone) {
                showNotification('Пожалуйста, заполните обязательные поля', 'error');
                return;
            }
            
            // Показываем уведомление о начале обработки
            showNotification('Отправка заказа...', 'info');
            
            try {
                // Отправляем данные на сервер
                const response = await fetch('/api/telegram', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Успешно отправлено
                    showNotification('Заказ успешно отправлен! Мы свяжемся с вами в ближайшее время.', 'success');
                    orderForm.reset();
                    
                    // Перенаправляем на страницу благодарности через 2 секунды
                    setTimeout(() => {
                        window.location.href = '/thank-you.html';
                    }, 2000);
                } else {
                    // Ошибка отправки
                    showNotification(`Ошибка при отправке: ${result.error || 'Попробуйте позже'}`, 'error');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                showNotification('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.', 'error');
            }
        });
        
        // Маска для телефона
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0 && value[0] !== '7') {
                    value = '7' + value;
                }
                
                let formattedValue = '';
                if (value.length > 0) {
                    formattedValue += '+' + value.substring(0, 1);
                }
                if (value.length > 1) {
                    formattedValue += ' (' + value.substring(1, 4);
                }
                if (value.length > 4) {
                    formattedValue += ') ' + value.substring(4, 7);
                }
                if (value.length > 7) {
                    formattedValue += '-' + value.substring(7, 9);
                }
                if (value.length > 9) {
                    formattedValue += '-' + value.substring(9, 11);
                }
                
                e.target.value = formattedValue;
            });
        }
    }
}

// Показываем уведомление
function showNotification(message, type = 'info') {
    // Проверяем, существует ли уже контейнер для уведомлений
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
        
        // Добавляем стили для уведомлений
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                }
                .notification {
                    padding: 15px 20px;
                    margin-bottom: 10px;
                    border-radius: 8px;
                    color: white;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
                    display: flex;
                    align-items: center;
                    max-width: 350px;
                    opacity: 0;
                    transform: translateX(50px);
                    transition: all 0.3s ease;
                }
                .notification.show {
                    opacity: 1;
                    transform: translateX(0);
                }
                .notification i {
                    margin-right: 10px;
                    font-size: 1.2rem;
                }
                .notification-info {
                    background: linear-gradient(135deg, #4a7ef7, #617ef6);
                }
                .notification-success {
                    background: linear-gradient(135deg, #42b883, #3e9e74);
                }
                .notification-error {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Добавляем иконку в зависимости от типа уведомления
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    // Добавляем уведомление в контейнер
    notificationContainer.appendChild(notification);
    
    // Добавляем класс для анимации
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Удаляем уведомление через 5 секунд
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}
