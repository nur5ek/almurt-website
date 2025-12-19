// jQuery Interactive Elements
$(document).ready(function() {
    
    // Smooth animations for category cards
    $('.category-card').on('mouseenter', function() {
        $(this).stop().css('transform', 'translateY(-8px)');
    }).on('mouseleave', function() {
        $(this).stop().css('transform', 'translateY(0)');
    });

    // Fade in animation for product cards
    function animateProductCards() {
        $('.product-card').each(function(index) {
            const $card = $(this);
            $card.css({
                opacity: 0,
                transform: 'translateY(20px)'
            });
            
            setTimeout(function() {
                $card.css({
                    opacity: 1,
                    transform: 'translateY(0)',
                    transition: 'opacity 0.4s ease, transform 0.4s ease'
                });
            }, index * 50);
        });
    }

    // Animate products when category changes
    $(document).on('categoryChanged', function() {
        animateProductCards();
    });

    // Smooth scroll with jQuery
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 100
            }, 600);
        }
    });

    // Add to cart animation with jQuery
    $(document).on('click', '.add-to-cart-btn', function() {
        const $btn = $(this);
        const originalText = $btn.text();
        
        $btn.prop('disabled', true)
            .text('Добавлено!')
            .css('background-color', '#27ae60');
        
        setTimeout(function() {
            $btn.prop('disabled', false)
                .text(originalText)
                .css('background-color', '');
        }, 1500);
    });

    function switchBannerImage() {
        const $img1 = $('#bannerImg1');
        const $img2 = $('#bannerImg2');
        
        if ($img1.hasClass('active')) {
            $img1.fadeOut(500, function() {
                $img1.removeClass('active');
                $img2.fadeIn(500).addClass('active');
            });
        } else {
            $img2.fadeOut(500, function() {
                $img2.removeClass('active');
                $img1.fadeIn(500).addClass('active');
            });
        }
    }

    // Enhanced banner slider with jQuery
    if ($('#bannerImg1').length && $('#bannerImg2').length) {
        setInterval(switchBannerImage, 4000);
    }

    // Category button active state with smooth transition
    $('.category-btn').on('click', function() {
        $('.category-btn').removeClass('active');
        $(this).addClass('active').fadeIn(200);
    });

    // Product card hover effect with jQuery
    $(document).on('mouseenter', '.product-card', function() {
        $(this).stop().css({
            transform: 'translateY(-5px)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
        });
    }).on('mouseleave', '.product-card', function() {
        $(this).stop().css({
            transform: 'translateY(0)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        });
    });

    // Alert animation with jQuery
    window.showAlertWithJQuery = function(message, type) {
        const alertClass = type === 'error' ? 'alert-error' : 'alert-success';
        const $alert = $('<div>')
            .addClass('alert ' + alertClass)
            .text(message)
            .css({
                opacity: 0,
                transform: 'translateX(400px)'
            })
            .appendTo('#alertContainer');
        
        $alert.animate({
            opacity: 1,
            transform: 'translateX(0)'
        }, 300);
        
        setTimeout(function() {
            $alert.animate({
                opacity: 0,
                transform: 'translateX(400px)'
            }, 300, function() {
                $alert.remove();
            });
        }, 3000);
    };

    function showCatalogWithAnimation() {
        $('#catalogSection').fadeIn(400);
        $('.welcome-banner, .categories-section').fadeOut(300);
    }

    window.animateProductCards = animateProductCards;
    window.showCatalogWithAnimation = showCatalogWithAnimation;
});

