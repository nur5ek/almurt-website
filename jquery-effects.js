/**
 * jQuery Effects - Плавные анимации и улучшения UI
 * Almurt Website
 */

// Проверяем, что jQuery загружен
if (typeof jQuery === 'undefined') {
    console.warn('jQuery не загружен. jQuery-эффекты отключены.');
} else {

$(document).ready(function() {
    // Плавное появление элементов при загрузке страницы
    initFadeInAnimations();
    
    // Улучшенные эффекты для карточек товаров
    initProductCardEffects();
    
    // Улучшенные эффекты для кнопок
    initButtonEffects();
    
    // Плавная прокрутка для якорных ссылок
    initSmoothScroll();
    
    // Эффекты для полей ввода
    initInputEffects();
    
    // Анимация корзины при добавлении товара
    initCartAnimation();
});

/**
 * Плавное появление элементов при загрузке
 */
function initFadeInAnimations() {
    // Скрываем и плавно показываем основные элементы
    $('.welcome-banner, .categories-section, .catalog-section, .cart-container, .checkout-container, .profile-container, .auth-box, .success-box')
        .css({ opacity: 0 })
        .animate({ opacity: 1 }, 600);
    
    // Последовательное появление карточек категорий
    $('.category-card').each(function(index) {
        var $card = $(this);
        $card.css({ opacity: 0 });
        setTimeout(function() {
            $card.animate({ opacity: 1 }, 400);
        }, index * 100);
    });
    
    // Появление элементов сайдбара
    $('.category-btn').each(function(index) {
        var $btn = $(this);
        $btn.css({ opacity: 0 });
        setTimeout(function() {
            $btn.animate({ opacity: 1 }, 300);
        }, index * 50);
    });
}

/**
 * Эффекты для карточек товаров
 */
function initProductCardEffects() {
    // Эффект подсветки при наведении на карточки товаров
    $(document).on('mouseenter', '.product-card', function() {
        $(this).stop().animate({
            'box-shadow': '0 8px 25px rgba(46, 204, 113, 0.25)'
        }, 200);
    });
    
    $(document).on('mouseleave', '.product-card', function() {
        $(this).stop().animate({
            'box-shadow': '0 2px 8px rgba(0,0,0,0.1)'
        }, 200);
    });
    
    // Эффект пульсации для кнопки "В корзину"
    $(document).on('click', '.add-to-cart-btn', function() {
        var $btn = $(this);
        $btn.addClass('pulse-effect');
        setTimeout(function() {
            $btn.removeClass('pulse-effect');
        }, 300);
    });
}

/**
 * Эффекты для кнопок
 */
function initButtonEffects() {
    // Эффект ряби при клике на кнопки
    $(document).on('click', '.banner-btn, .submit-btn, .checkout-btn, .place-order-btn, .back-to-home-btn', function(e) {
        var $btn = $(this);
        
        // Добавляем эффект подсветки
        $btn.css('box-shadow', '0 0 20px rgba(46, 204, 113, 0.6)');
        
        setTimeout(function() {
            $btn.css('box-shadow', '');
        }, 400);
    });
    
    // Плавное изменение цвета для icon-btn
    $('.icon-btn').on('mouseenter', function() {
        $(this).find('.header-icon').css('transition', 'transform 0.3s');
        $(this).find('.header-icon').css('transform', 'scale(1.1)');
    }).on('mouseleave', function() {
        $(this).find('.header-icon').css('transform', 'scale(1)');
    });
}

/**
 * Плавная прокрутка
 */
function initSmoothScroll() {
    // Плавная прокрутка для всех якорных ссылок
    $('a[href*="#"]').not('[href="#"]').on('click', function(e) {
        var target = $(this.hash);
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 600, 'swing');
        }
    });
}

/**
 * Эффекты для полей ввода
 */
function initInputEffects() {
    // Плавный эффект фокуса - используем CSS классы для лучшей производительности
    $(document).on('focus', 'input, textarea', function() {
        $(this).parent('.form-group').addClass('form-group-focused');
    });
    
    $(document).on('blur', 'input, textarea', function() {
        $(this).parent('.form-group').removeClass('form-group-focused');
    });
    
    // Эффект подсветки для строки поиска
    $('#searchInput').on('focus', function() {
        $(this).closest('.search-bar').addClass('search-bar-focused');
    }).on('blur', function() {
        $(this).closest('.search-bar').removeClass('search-bar-focused');
    });
}

/**
 * Анимация иконки корзины
 */
function initCartAnimation() {
    // Анимация бейджа корзины при добавлении товара
    $(document).on('click', '.add-to-cart-btn', function() {
        var $badge = $('#cartCount');
        
        // Используем CSS классы для анимации
        $badge.addClass('cart-badge-pulse');
        setTimeout(function() {
            $badge.removeClass('cart-badge-pulse');
        }, 300);
        
        // Эффект подпрыгивания для иконки корзины
        var $cartIcon = $('a[href="cart.html"] .header-icon');
        $cartIcon
            .animate({ marginTop: '-5px' }, 100)
            .animate({ marginTop: '0' }, 100);
    });
}

// Добавляем CSS стили для jQuery анимаций
$('<style>')
    .prop('type', 'text/css')
    .html(`
        .pulse-effect {
            animation: pulse 0.3s ease-in-out;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(0.95); }
            100% { transform: scale(1); }
        }
        
        .form-group {
            transition: transform 0.2s ease;
        }
        
        .form-group-focused {
            transform: scale(1.01);
        }
        
        .search-bar {
            transition: box-shadow 0.3s ease;
        }
        
        .search-bar-focused {
            box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);
        }
        
        #cartCount {
            transition: transform 0.15s ease;
        }
        
        .cart-badge-pulse {
            animation: badge-pulse 0.3s ease-in-out;
        }
        
        @keyframes badge-pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.5); }
            100% { transform: scale(1); }
        }
        
        .header-icon {
            transition: transform 0.3s ease;
        }
    `)
    .appendTo('head');

} // Закрытие проверки jQuery
