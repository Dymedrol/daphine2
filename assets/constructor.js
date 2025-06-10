/**
 * Constructor 2.0 - Advanced Jewelry Customization Module
 * Enhanced interactive functionality for chain and charm selection
 */

$(document).ready(function() {
    // Early exit if constructor element doesn't exist
    if (!$('#constructor').length) {
        return;
    }

    // Cache DOM elements for better performance
    const $constructor = $('#constructor');
    const $steps = $('.js-constructor-step');
    const $startButton = $('#start-button');
    const $step1NextBtn = $('#step-1-next-btn');
    const $step2NextBtn = $('#step-2-next-btn');
    const $step2BackBtns = $('.js-step-2-back-btn');
    const $chainItems = $('.js-chain-item');
    const $charmsItems = $('.js-charms-item');
    const $chainPriceBlock = $('#constructor-choice-controls-price');
    const $totalPriceBlock = $('#constructor-choice-controls-total-price');
    const $charmsTemplates = $('#charms-templates');
    
    // Configuration constants
    const MAX_CHARMS = 3;
    const ANIMATION_DURATION = 300;
    
    // State variables
    let selectedCharmsCount = 0;
    let currentPic;
    let chainPrice = parseFloat($('.js-chain-item.constructor-choice-item_active').attr('data-price')) || 0;
    let charmsPrice = 0;
    let totalPrice = chainPrice;

    // Initialize price display
    updatePriceDisplay();

    /**
     * Update price display with formatted currency
     */
    function updatePriceDisplay() {
        $chainPriceBlock.text(formatPrice(chainPrice));
        const totalPriceFormatted = formatPrice(chainPrice + charmsPrice);
        $totalPriceBlock.text(totalPriceFormatted);
    }

    /**
     * Format price with proper decimals
     */
    function formatPrice(price) {
        return price.toFixed(2);
    }

    /**
     * Show specific step with smooth animation
     */
    function showStep(stepNumber) {
        const $currentStep = $(`#step-${stepNumber}`);
        
        // Add loading state
        $constructor.addClass('constructor-loading');
        
        // Hide all steps
        $steps.hide();
        
        // Show target step with animation
        setTimeout(() => {
            $currentStep.css('display', 'flex');
            $constructor.removeClass('constructor-loading');
            
            // Smooth scroll to top
            $('html, body').animate({
                scrollTop: 0
            }, ANIMATION_DURATION);
        }, 100);
    }

    /**
     * Handle chain selection with improved UX
     */
    function changeCurrentChain() {
        const $target = $(this);
        const targetCount = $target.attr('data-count');
        
        // Update visual state
        $('.constructor-result-chain').addClass('constructor-result-chain_hidden');
        $(`.constructor-result-chain[data-count='${targetCount}']`).removeClass('constructor-result-chain_hidden');
        
        // Update selection state
        $chainItems.removeClass('constructor-choice-item_active');
        $target.addClass('constructor-choice-item_active');
        
        // Update price
        chainPrice = parseFloat($target.attr('data-price')) || 0;
        updatePriceDisplay();
        
        // Add visual feedback
        $target.addClass('constructor-choice-item-selected');
        setTimeout(() => {
            $target.removeClass('constructor-choice-item-selected');
        }, 200);
    }

    /**
     * Handle charm selection with enhanced logic
     */
    function changeCurrentCharm() {
        const $target = $(this);
        const targetCount = $target.attr('data-count');
        const charmPrice = parseFloat($target.attr('data-price')) || 0;

        if ($target.hasClass('constructor-choice-item_active')) {
            // Remove charm
            removeCharm($target, targetCount, charmPrice);
        } else {
            // Add charm (if under limit)
            if (selectedCharmsCount < MAX_CHARMS) {
                addCharm($target, targetCount, charmPrice);
            } else {
                // Show feedback for max limit reached
                showMaxCharmsMessage();
            }
        }

        updatePriceDisplay();
        updateNextButtonState();
    }

    /**
     * Add charm to selection
     */
    function addCharm($target, targetCount, charmPrice) {
        selectedCharmsCount++;
        $target.addClass('constructor-choice-item_active');
        
        // Clone charm template to result area
        $charmsTemplates.find(`.constructor-result-charm[data-count='${targetCount}']`)
            .clone()
            .appendTo('.constructor-result-charms');
        
        charmsPrice += charmPrice;
        updateCharmsLayout();
        
        // Add visual feedback
        $target.addClass('constructor-choice-item-added');
        setTimeout(() => {
            $target.removeClass('constructor-choice-item-added');
        }, 300);
    }

    /**
     * Remove charm from selection
     */
    function removeCharm($target, targetCount, charmPrice) {
        selectedCharmsCount--;
        $target.removeClass('constructor-choice-item_active');
        
        // Remove from result area
        $('.constructor-result-charms').find(`.constructor-result-charm[data-count='${targetCount}']`).remove();
        
        charmsPrice -= charmPrice;
        updateCharmsLayout();
    }

    /**
     * Update charms layout based on count
     */
    function updateCharmsLayout() {
        const $charmsContainer = $('.constructor-result-charms');
        
        // Remove all layout classes
        $charmsContainer.removeClass('constructor-result-charms-1 constructor-result-charms-2 constructor-result-charms-3');
        
        // Add appropriate layout class
        const charmsCount = $charmsContainer.find('.constructor-result-charm').length;
        if (charmsCount > 0) {
            $charmsContainer.addClass(`constructor-result-charms-${charmsCount}`);
        }
    }

    /**
     * Show message when max charms limit is reached
     */
    function showMaxCharmsMessage() {
        // Create temporary message
        const $message = $('<div class="max-charms-message">Maximum 3 charms allowed</div>');
        $message.css({
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#dc2626',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            zIndex: 9999,
            opacity: 0
        });
        
        $('body').append($message);
        
        // Animate in and out
        $message.animate({ opacity: 1 }, 200);
        setTimeout(() => {
            $message.animate({ opacity: 0 }, 200, function() {
                $message.remove();
            });
        }, 2000);
    }

    /**
     * Update next button state based on selection
     */
    function updateNextButtonState() {
        if (selectedCharmsCount > 0) {
            $step2NextBtn.removeAttr("disabled").removeClass('disabled');
        } else {
            $step2NextBtn.attr("disabled", "disabled").addClass('disabled');
        }
    }

    /**
     * Add items to cart with improved error handling
     */
    function addToCart() {
        const items = [];
        const $finalContainer = $('.constructor-result-final');

        // Show loading state
        $constructor.addClass('constructor-loading');

        try {
            // Add selected chain
            const $selectedChain = $finalContainer.find('.constructor-result-chain:not(.constructor-result-chain_hidden)');
            if ($selectedChain.length) {
                items.push({
                    id: $selectedChain.attr('data-variant-id'),
                    quantity: 1
                });
            }

            // Add selected charms
            const $charms = $finalContainer.find('.constructor-result-charm');
            $charms.each(function() {
                items.push({
                    id: $(this).attr('data-variant-id'),
                    quantity: 1
                });
            });

            // Make cart request
            fetch('/cart/add.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ items })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(cart => {
                // Success - show final step
                showStep(3);
                $constructor.removeClass('constructor-loading');
                
                // Track analytics event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'add_to_cart', {
                        'event_category': 'Constructor 2.0',
                        'value': chainPrice + charmsPrice
                    });
                }
            })
            .catch(error => {
                console.error('Error adding items to cart:', error);
                $constructor.removeClass('constructor-loading');
                
                // Show error message
                showErrorMessage('Failed to add items to cart. Please try again.');
            });

        } catch (error) {
            console.error('Error preparing cart data:', error);
            $constructor.removeClass('constructor-loading');
            showErrorMessage('Error preparing your selection. Please try again.');
        }
    }

    /**
     * Show error message to user
     */
    function showErrorMessage(message) {
        const $error = $(`<div class="error-message">${message}</div>`);
        $error.css({
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#dc2626',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            zIndex: 9999,
            opacity: 0
        });
        
        $('body').append($error);
        
        $error.animate({ opacity: 1 }, 200);
        setTimeout(() => {
            $error.animate({ opacity: 0 }, 200, function() {
                $error.remove();
            });
        }, 5000);
    }

    /**
     * Handle image switching for products with multiple images (Mobile only)
     */
    function switchProductImage() {
        if (!currentPic) return;
        
        const $item = currentPic.closest('.constructor-choice-item-alt-pic');
        
        // Toggle show-featured class to switch images
        $item.toggleClass('show-featured');
        
        // Update dot indicators
        const $dots = $item.find(".constructor-choice-item-dots-dot");
        $dots.toggleClass('constructor-choice-item-dots-dot_active');
    }

    // Event Listeners
    $startButton.on('click', () => showStep(1));
    $step1NextBtn.on('click', () => showStep(2));
    $step2BackBtns.on('click', () => showStep(1));
    $step2NextBtn.on('click', addToCart);
    $chainItems.on('click', changeCurrentChain);
    $charmsItems.on('click', changeCurrentCharm);

    // Touch/swipe handling for mobile - only for items with alt images
    $('.constructor-choice-item-alt-pic').on('touchstart', function(e) {
        currentPic = $(e.target);
    });

    // Click handler for dots on mobile
    $('.constructor-choice-item-dots-dot').on('click', function(e) {
        e.stopPropagation(); // Prevent triggering item selection
        const $item = $(this).closest('.constructor-choice-item-alt-pic');
        currentPic = $item;
        switchProductImage();
    });

    // Initialize swipe functionality if available (Mobile only)
    if ($.fn.swipe && window.innerWidth <= 819) {
        $('.constructor-choice-item-alt-pic').swipe({
            swipe: switchProductImage,
            threshold: 50
        });
    }

    // Keyboard accessibility
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals or return to previous step
            const currentStep = $('.js-constructor-step:visible').attr('id');
            if (currentStep === 'step-2') {
                showStep(1);
            } else if (currentStep === 'step-1') {
                showStep(0);
            }
        }
    });

    // Initialize analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'constructor_2_0_loaded', {
            'event_category': 'Constructor 2.0'
        });
    }

    console.log('Constructor 2.0 initialized successfully');
});