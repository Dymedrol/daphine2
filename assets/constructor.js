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

    let selectedCharmsCount = 0;
    let chainPrice = 0;

    function showStep(step) {
        const steps = $('.js-constructor-step');
        const currentStep = $('#step-' + step);
        steps.hide();
        currentStep.css('display', 'flex');
    }
    
    function changeCurrentChain() {
        const target = $(this);
        chainItems.removeClass('constructor-choice-item_active');
        target.addClass('constructor-choice-item_active');
        step1NextBtn.removeAttr("disabled");
    }

    function changeCurrentCharm() {
        const target = $(this);
        console.log(selectedCharmsCount < MAX_CHARMS);
        if (target.hasClass('constructor-choice-item_active')) {
            target.removeClass('constructor-choice-item_active');
            selectedCharmsCount--;
        } else {
            if (selectedCharmsCount < MAX_CHARMS) {
                target.addClass('constructor-choice-item_active');
                selectedCharmsCount++;
            }
        }

        if (selectedCharmsCount) {
            step2NextBtn.removeAttr("disabled");
        } else {
            step2NextBtn.attr("disabled");
        }


    }



    startButton.click(function () {showStep(1)});
    step1NextBtn.click(function () {showStep(2)});
    step2BackBtns.click(function () {showStep(1)});
    step2NextBtn.click(function () {showStep(3)});
    chainItems.click(changeCurrentChain);
    charmsItems.click(changeCurrentCharm);
});