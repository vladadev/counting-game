$(document).ready(function() {
    
    // Form fields
    const   nicknameInput = document.querySelector('#nickname'),
            amount = document.querySelector('#amount-of-numbers'),
            speedRange = document.querySelector('#speed-range'),
            resultState = document.querySelector('#negative-check');

    // Buttons
    const startGameBtn = document.querySelector('#button-start-game'),
          submitResultBtn = document.querySelector('#button-submit-result'),
          closeGameBtn = document.querySelector('#button-close-game');

    // Display numbers element
    const displayElement = document.querySelector('#display-num-elem');

    // Countdown bar
    const barTwo = document.querySelector('.countdown-bar-2');

    const modal = (username, calculatedMathEquation) => {

        let modal = document.querySelector('#myModal');

        submitResultBtn.addEventListener('click', () => {
           
            modal.style.display = 'block';

            let feedbackH1 = $('.modal-content h1'),
                feedbackP = $('.modal-content p'),
                userAnswer = Number($('#result').val());

            if(!userAnswer) {

                feedbackH1.html(`Yo, ${username}`);
                feedbackP.html(`Close this modal, and enter your result before submiting!`);
            } else {

                if(userAnswer === calculatedMathEquation) {
                    feedbackH1.html(`Good job ${username}`);
                    feedbackP.html(`Your answer '${userAnswer}' is correct! ✅`);
                } 
                else {
                    feedbackH1.html(`Better luck next time ${username}`);
                    feedbackP.html(`Your answer '${userAnswer}' is not correct! ❌ <br>
                    <small class="text-muted">You can close modal and try again...</small>`);
                }
            }  
        })

        let closeModalBtn = document.querySelector('.close-modal');
        closeModalBtn.addEventListener('click', () => {

            modal.style.display = 'none';
        })

        window.addEventListener('click', (event) => {
            if( event.target == modal ) {
                modal.style.display = 'none';
            }
        })
    }

    const countdown = () => {
        let num = 5,
            dotStartNum = 3,
            dotStr = '',
            amountOfDisplayedDots = 0;

        let barPercentage = 0,
            numOfIterations = 5;
            
        const dots = () => {

            if(dotStartNum <= 3 && dotStartNum >= 1) {
                dotStr += '.';
                amountOfDisplayedDots ++;

                if(amountOfDisplayedDots > 3) {
                    dotStr = '.';
                    amountOfDisplayedDots = 1;
                }

                return dotStr;
            }
        }
        setInterval(() => {
    
            if(num <= 5 && num >= 0) {
                
                // Fill countdown bar
                barPercentage += fillProgressBar(numOfIterations);
                barTwo.style.width = `${barPercentage}%`;

                // Countdown
                $('.countdown-number').html(`${num--} ${dots()}`);

                if(num === -1) {

                    switchToGame();
                    startGame();
                }
            }

        }, 1000)
    }

    const fillProgressBar = (devidedByNumber) => {

        let percentageWidth = 100 / devidedByNumber;
        return percentageWidth
    }

    const randomOperator = () => {

        let operators = ['+', '-'];
        let randomOperator = Math.floor(Math.random() * operators.length);

        return operators[randomOperator];
    }

    const convertSpeed = (speedRangeNum) => {

        let convertedSpeed;
        switch(speedRangeNum) {

            case 0.5:
                convertedSpeed = 500
                break;
            case 1:
                convertedSpeed = 1000
                break;
            case 1.5:
                convertedSpeed = 1500
                break;
            case 2:
                convertedSpeed = 2000
                break;
            case 2.5:
                convertedSpeed = 2500
                break;
            case 3:
                convertedSpeed = 3000
                break;
            default:
                convertedSpeed = 1000
        }

        return convertedSpeed;
    }

    const startGame = () => {

        let getUser = sessionStorage.getItem('user'),
            userObj = JSON.parse(getUser),
            gameInfo = JSON.parse(calculateGameInfo(userObj.amountOfNumbers, userObj.isNegativeAllowed)),
            calculatedMathEquation = gameInfo.calculatedMathEquation;
            finalArr = gameInfo.finalArr;
        
        let speedRangeNum = Number(userObj.speedRange);

        // Number current / total 
        let currentNumIndex =  document.querySelector('.current-num-index');
        console.log(`Result for testing: ${calculatedMathEquation}`);
        
        let index = 0,
            interval = setInterval(() => {
            
            // Display number from arr
            displayElement.innerHTML = finalArr[index];

            // Number current update
            currentNumIndex.innerHTML = `${index + 1} / ${finalArr.length}`;

            // After all numbers are displayed
            if( index === finalArr.length - 1 ) {
                
                setTimeout(() => {

                    $('.row-number').addClass('d-none');
                    $('.after-game-block').removeClass('d-none');
                }, 1000)

                clearInterval(interval);
            } 
            else {
                index++;
            }

        }, convertSpeed(speedRangeNum)) 

        modal(userObj.nickname, calculatedMathEquation);
    }

    const calculateGameInfo = ( amount, negativeAllowed ) => {

        let arr = [],
            finalArr,
            calculatedMathEquation,
            mathEquation = '';

        for( let i = 0; i < amount; i++ ) {

            let randomNum = Math.floor(Math.random() * 100) + 1;
            arr.push(randomNum);

            if( arr.length > 1 ) {

                for( let j = 0; j < arr.length; j++ ) {
                    mathEquation += `${arr[j]} ${randomOperator()}`;
                }

                let slicedEquation = mathEquation.slice(0, -1);
                calculatedMathEquation = eval(slicedEquation);

                if( calculatedMathEquation < 0 && !negativeAllowed ) {
                    arr.pop();
                    i--;
                }

                finalArr = slicedEquation.split(' ', amount);
            }
        }
        
        return JSON.stringify({
            finalArr,
            calculatedMathEquation
        })
    }

    const isInPage = (pageNode) => {

        return (pageNode === document.body) ? false : document.body.contains(pageNode);
    }

    const switchToCountdown = () => {

        $('#game').addClass('d-none');
        $('#game-starting').removeClass('d-none');
        countdown();
    }

    const switchToGame = () => {

        $('#game-starting').addClass('d-none');
        $('#game-started').removeClass('d-none');
    }

    const formValidState = () => {

        let err = {
            nick: true,
            amount: true
        }

        if(nicknameInput.value === '') {
            err.nick = false;
        }
        
        if(amount.value === '0') {
            err.amount = false;
        }

        return err;
    }

    if( isInPage(startGameBtn) || isInPage(closeGameBtn) || isInPage(speedRange)) {

        startGameBtn.addEventListener('click', () => {

            // Form validation *here
            let isFormOk = true,
                formState = formValidState(),
                errorMsgs = [],
                errorElement = $('#form-error'),
                errorHtml = '';

            errorElement.html('');
            
            if(!formState.nick) {

                errorMsgs.push('Nickname is required!');
                isFormOk = false;
            }
            if(!formState.amount) {

                errorMsgs.push('You have to chose amount of numbers!');
                isFormOk = false;
            }
            
            if(isFormOk) {
    
                // User obj.
                const user = {
                    nickname: nicknameInput.value,
                    amountOfNumbers: amount.value,
                    speedRange: speedRange.value,
                    isNegativeAllowed: resultState.checked
                }
    
                // Saving user to sessionStorage
                sessionStorage.setItem('user', JSON.stringify(user))
    
                // Hide form, display countdown / start game
                switchToCountdown()
    
            } 
            else {
                
                errorHtml += `<ul>`;
                for(let i = 0; i < errorMsgs.length; i++) {
                    errorHtml += `<li>${errorMsgs[i]}</li>`;
                }
                errorHtml += `</ul>`;

                errorElement.html(errorHtml);
                errorElement.removeClass('d-none');
            }
        })

        // Close game
        closeGameBtn.addEventListener('click', () => {

            $('#game').removeClass('d-none')
            if(!$('#game-started').hasClass('d-none')) {

                $('#game-started').addClass('d-none')
            }

            // Reset countdown bar
            barTwo.style.width = `0%`;
            window.location.reload();
        })

        // Display time interval
        let interval = document.querySelector('.interval');
        interval.innerHTML = `${speedRange.value} s`;
        speedRange.addEventListener('input', () => {

            interval.innerHTML = `${speedRange.value} s`;
        })
    }
})
