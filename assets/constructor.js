$( document ).ready(function() {

    if (!$('#constructor').length) {
        return;
    }

    const steps = $('.js-constructor-step');
    const startButton = $('#start-button');
    const step1NextBtn = $('#step-1-next-btn');
    const step2NextBtn = $('#step-2-next-btn');
    const step2BackBtns= $('.js-step-2-back-btn');
    const chainItems = $('.js-chain-item');
    const charmsItems = $('.js-charms-item');
    const MAX_CHARMS = 3;
    const chainPriceBlock = $('#constructor-choice-controls-price');
    const totalPriceBlock = $('#constructor-choice-controls-total-price');
    const charmsTemplates = $('#charms-templates');

    let selectedCharmsCount = 0;

    let chainPrice = $('.js-chain-item.constructor-choice-item_active').attr('data-price');
    chainPriceBlock.text(chainPrice);

    let charmsPrice = 0;
    let totalPrice = chainPrice;
    let totalPriceText = Number(totalPrice) + charmsPrice + '.00';
    totalPriceBlock.text(totalPriceText);

    function renderPrice () {
        chainPriceBlock.text(chainPrice);
        totalPriceText = Number(chainPrice) +  Number(charmsPrice) + '.00';
        totalPriceBlock.text(totalPriceText);
    }

    function showStep(step) {
        const steps = $('.js-constructor-step');
        const currentStep = $('#step-' + step);
        steps.hide();
        currentStep.css('display', 'flex');
    }
    
    function changeCurrentChain() {
        const target = $(this);
        const targetCount = target.attr('data-count');
        $('.constructor-result-chain').addClass('constructor-result-chain_hidden');
        $(`.constructor-result-chain[data-count='${targetCount}']`).removeClass('constructor-result-chain_hidden');
        chainItems.removeClass('constructor-choice-item_active');
        target.addClass('constructor-choice-item_active');
        chainPrice = Number(target.attr('data-price'));
        renderPrice();
    }

    function changeCurrentCharm() {
        const target = $(this);
        const targetCount = target.attr('data-count');

        if (target.hasClass('constructor-choice-item_active')) {
            selectedCharmsCount--;
            target.removeClass('constructor-choice-item_active');
            $('.constructor-result-charms').find(`.constructor-result-charm[data-count='${targetCount}']`).remove();
            charmsPrice = charmsPrice - Number(target.attr('data-price'));
            $('.constructor-result-charms').removeClass('constructor-result-charms-1');
            $('.constructor-result-charms').removeClass('constructor-result-charms-2');
            $('.constructor-result-charms').removeClass('constructor-result-charms-3');
            $('.constructor-result-charms').addClass(`constructor-result-charms-${$('.constructor-step-2  .constructor-result-charms').find('.constructor-result-charm').length}`);
        } else {
            if (selectedCharmsCount < MAX_CHARMS) {
                selectedCharmsCount++;
                target.addClass('constructor-choice-item_active');
                charmsTemplates.find(`.constructor-result-charm[data-count='${targetCount}']`).clone().appendTo('.constructor-result-charms');
                charmsPrice = charmsPrice + Number(target.attr('data-price'));

                $('.constructor-result-charms').removeClass('constructor-result-charms-1');
                $('.constructor-result-charms').removeClass('constructor-result-charms-2');
                $('.constructor-result-charms').removeClass('constructor-result-charms-3');
                $('.constructor-result-charms').addClass(`constructor-result-charms-${$('.constructor-step-2  .constructor-result-charms').find('.constructor-result-charm').length}`);
            }
        }

        renderPrice();

        if (selectedCharmsCount) {
            step2NextBtn.removeAttr("disabled");
        } else {
            step2NextBtn.attr("disabled");
        }
    }

    function addTocart() {
        let items = [];
        const finalContainer = $('.constructor-result-final');

        $('#constructor').addClass('constructor-loading');
        const selectedChain = finalContainer.find('.constructor-result-chain:not(.constructor-result-chain_hidden)');
        const chain = {
            id: selectedChain.attr('data-variant-id'),
            quantity: 1
        }
        items.push(chain);

        const charms = finalContainer.find('.constructor-result-charm');
        charms.each(function( index ) {
            const charm = {
                id: $(this).attr('data-variant-id'),
                quantity: 1
            }
            items.push(charm);
        });

        const data = {
            items
        };

        fetch('/cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error adding product to cart');
                }
                return response.json();
            })
            .then(cart => {
                showStep(3)
                $('#constructor').removeClass('constructor-loading');
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });






    }



    startButton.click(function () {showStep(1)});
    step1NextBtn.click(function () {showStep(2)});
    step2BackBtns.click(function () {showStep(1)});
    step2NextBtn.click(function () {addTocart()});
    chainItems.click(changeCurrentChain);
    charmsItems.click(changeCurrentCharm);
});