window.addEventListener('load', () => {
    

    document.addEventListener('keydown', ballMoves)
    
    document.addEventListener('keydown', function startGame(event) {
        if( event.code == 'Space' ){
            
            selectWithComplexity.disabled = true;
            
            wrapContainer.classList.add('hideWrap');
            
            settingPossition();
    
            image = new Image();
            image.src = 'ball.png';
            image.addEventListener('load', draw);
            
            settingSpeed();

            this.disabled = true;
            this.removeEventListener('keydown', startGame )
        }
    })
    
    let canvas = document.querySelector('canvas'),
        ctx = canvas.getContext('2d'),
        wrapContainer = document.querySelector('.wrap'),
        wrapInscription = document.querySelector('.wrap__inscription'), 
        selectWithComplexity = document.querySelector('#complexity__select'),
        points = document.getElementById('points'),
        arrWithOptions = ['easy', 'medium', 'hard'],
        arrWithComplexity = [-2, -3, -4],
        yPosBall,
        xPosBall,
        imageWidth = 20,
        imageHeight = 20,
        xPosTopBarier = canvas.width + 1,
        yPosTopBarier = -1,
        xPosBottomBarier = canvas.width + 1,
        barierWidth = 50,
        spaceBetweenBariers = 70,
        minHeightForBarier = 10,
        maxHeightForBarier = canvas.height - spaceBetweenBariers - minHeightForBarier,
        pixelsOnClickSpace,
        valueForCreateNewBarier,
        speed,
        grav,
        posForPoint,
        arrWithBarier = [],
        image;
    
    arrWithOptions.forEach( ( elem, index ) => {
        let option = new Option(elem);
        option.value = arrWithComplexity[index];
        selectWithComplexity.add(option)
    });
    
    selectWithComplexity.addEventListener('change', function () {
        this.blur();
    });

    function ballMoves(event) {
        if( event.code == 'Space' ){
            yPosBall += pixelsOnClickSpace;
        }
    }
    
    const settingForSpeed = speed => {
        switch( speed ) {
            case -3:
                valueForCreateNewBarier = 300;
                grav = 2;
                pixelsOnClickSpace = -45;
                posForPoint = 0;
                break;
            case -4: 
                valueForCreateNewBarier = 301;
                grav = 2;
                pixelsOnClickSpace = -50;
                posForPoint = 1;
                break;
            default:
                valueForCreateNewBarier = 301;
                grav = 1;
                pixelsOnClickSpace = -30;
                posForPoint = -1;
        }
    }

    const createObjectWithBarier = () => {

        let HeightTopBarier = Math.ceil( Math.random() * ( maxHeightForBarier - minHeightForBarier ) +                             minHeightForBarier ),
            HeightBottomBarier,
            yPosBottomBarier;

            yPosBottomBarier = HeightTopBarier + spaceBetweenBariers;

        HeightBottomBarier = canvas.height - yPosBottomBarier + 1;

        arrWithBarier.push ({
            xPosTopBarier,
            yPosTopBarier,
            xPosBottomBarier,
            yPosBottomBarier,
            HeightTopBarier,
            HeightBottomBarier,
            barierWidth
        } )

    }

    createObjectWithBarier();

    const arrayCheck = (arr) => {
        arrWithBarier = arr.filter( elem => elem.xPosTopBarier > -barierWidth * 2); 
    } 

    const settingSpeed = () => {
            let { value } = selectWithComplexity;
            speed = +value;

            settingForSpeed(speed);
    }
    
    const settingPossition = () => {
            yPosBall = 30;
            xPosBall = 50;
    }
    
    function draw() {
        
        let check = false

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 97, 97, 32, 32, xPosBall, yPosBall, imageWidth, imageHeight );

        arrWithBarier.forEach( elem => {

            let { xPosTopBarier, yPosTopBarier, HeightTopBarier, xPosBottomBarier, yPosBottomBarier, HeightBottomBarier } = elem;

            if( xPosTopBarier == posForPoint ) points.innerHTML = ++points.innerHTML
            
            if( ( xPosBall >= xPosTopBarier && xPosBall <= xPosTopBarier + barierWidth && ( yPosBall <= HeightTopBarier || yPosBall >= yPosBottomBarier - imageHeight ) ) || ( xPosBall < ( xPosTopBarier || xPosBottomBarier ) && ( yPosBall <= HeightTopBarier || yPosBall >= yPosBottomBarier - imageHeight ) && ( xPosBall + imageWidth >= ( xPosTopBarier || xPosBottomBarier ) ) ) || ( yPosBall <= 0 || yPosBall + imageHeight >= canvas.height ) ) {
                check = true;
            }

            ctx.beginPath();
            ctx.rect(xPosTopBarier, yPosTopBarier, barierWidth, HeightTopBarier);
            ctx.rect(xPosBottomBarier, yPosBottomBarier, barierWidth, HeightBottomBarier);
            ctx.fillStyle = 'yellowgreen';
            ctx.strokeStyle = '#000';
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            elem.xPosTopBarier += speed 
            elem.xPosBottomBarier += speed

            if( xPosTopBarier == valueForCreateNewBarier ) createObjectWithBarier();

        } )

        yPosBall += grav;
        arrayCheck(arrWithBarier);

        if(!check) requestAnimationFrame(draw);
        
        else {
            
            document.removeEventListener('keydown', ballMoves);
            
            wrapContainer.classList.remove('hideWrap');
            wrapInscription.textContent = 'Press SPACE to restart';
            
            selectWithComplexity.disabled = false;
            
            
            document.addEventListener('keydown', function restartGame(event) {
                if( event.code == 'Space' ){
                    
                    this.addEventListener('keydown', ballMoves);
                    this.removeEventListener("keydown", restartGame);
                    
                    selectWithComplexity.disabled = true;
                    
                    settingSpeed();

                    settingPossition();

                    wrapContainer.classList.add('hideWrap');                    
                    points.innerHTML = '0';
                    
                    arrWithBarier = [];
                    createObjectWithBarier();
                    
                    draw();
                }
            })
        }
    }
    
})