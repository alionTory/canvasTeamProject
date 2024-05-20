$(function () {
    $('#startGame').click(function () {
        $('#mainMenu').removeClass('visible');
        $('#difficultyMenu').addClass('visible');
    });

    $('.difficultyBtn').click(function () {
        let difficulty = $(this).data('difficulty');
        if (difficulty === 'easy') {
            level = 1;
        } else if (difficulty === 'medium') {
            level = 2;
        } else if (difficulty === 'hard') {
            level = 3;
        }
        $('#difficultyMenu').removeClass('visible');
        startGame(level);
    });

    $('#settings').click(function () {
        $('#mainMenu').removeClass('visible');
        $('#settingsMenu').addClass('visible');
    });

    $('#backToMenu').click(function () {
        $('#settingsMenu').removeClass('visible');
        $('#mainMenu').addClass('visible');
    });

    $('#backToMainFromDifficulty').click(function () {
        $('#difficultyMenu').removeClass('visible');
        $('#mainMenu').addClass('visible');
    });
    $('.difficultyBtn').hover(function () {
        $(this).css('background-position', 'right center');
    }, function () {
        $(this).css('background-position', 'left center');
    });


    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function updateTitleGlow() {
        const title = document.getElementById('title');
        let color = getRandomColor();

        title.style.textShadow = `
            0 0 5px rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.6),
            0 0 10px rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.5),
            0 0 15px rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.4),
            0 0 20px rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.3),
            0 0 25px rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.2),
            0 0 30px rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.1),
            0 0 35px rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.05)
        `;
    }

    setInterval(updateTitleGlow, 1500);

    // Make sure the main menu is visible by default
    $('#mainMenu').addClass('visible');

    $('#changeVolume').click(function () {
        $('#settingsMenu').hide();
        $('#volumeMenu').show();
    });

    $('#backFromVol').click(function () {
        $('#volumeMenu').hide();
        $('#settingsMenu').show();
    });

    $('#volumeSlider').on('input change', function () {
        let volume = $(this).val();
        adjustVolume(volume);
    });

    let currentSkinIndex = 0;
    const skins = ["imgFolder/player.png", "imgFolder/player2.png", "imgFolder/player3.png"]; // 스킨 이미지 파일 이름

    $('#changeSkin').click(function () {
        $('#settingsMenu').hide();
        $('#skinSelector').show();
        updateSkinPreview();
    });

    $('#prevSkin').on('click', function () {
        currentSkinIndex = (currentSkinIndex - 1 + skins.length) % skins.length;
        updateSkinPreview();
    });

    $('#nextSkin').on('click', function () {
        currentSkinIndex = (currentSkinIndex + 1) % skins.length;
        updateSkinPreview();
    });
    function updateSkinPreview() {
        $('#skinPreview').attr('src', skins[currentSkinIndex]);
    }
    $('#backFromSkin').click(function () {
        $('#skinSelector').hide();
        $('#settingsMenu').show();
    });

    // Canvas 설정
    const starCanvas = document.getElementById('shootingStarCanvas');
    const ctx = starCanvas.getContext('2d');
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;

    // 별을 저장할 배열
    const stars = [];
    const shootingStars = [];

    // 별 클래스
    class Star {
        constructor(x, y, size, velocity) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.velocity = velocity;
        }

        draw() {
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }

        update() {
            this.x -= this.velocity;
            if (this.x < -this.size) {
                this.x = starCanvas.width + this.size;
                this.y = Math.random() * starCanvas.height;
            }
            this.draw();
        }
    }

    // 별똥별 클래스
    class ShootingStar {
        constructor() {
            this.x = Math.random() * starCanvas.width;
            this.y = 0;
            this.length = Math.random() * 80 + 10;
            this.velocity = Math.random() * 10 + 6;
            this.opacity = 1;
            this.fade = 0.03;
        }

        draw() {
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.length, this.y + this.length);
            ctx.stroke();
        }

        update() {
            if (this.opacity > 0) {
                this.opacity -= this.fade;
            }
            this.x += this.velocity;
            this.y += this.velocity;
            if (this.opacity > 0) {
                this.draw();
            }
        }
    }

    // 별 생성
    function initStars() {
        const starCount = 150;
        for (let i = 0; i < starCount; i++) {
            const x = Math.random() * starCanvas.width;
            const y = Math.random() * starCanvas.height;
            const size = Math.random() * 2;
            const velocity = Math.random() * 0.5 + 0.1;
            stars.push(new Star(x, y, size, velocity));
        }
    }

    // 별똥별 생성
    function initShootingStars() {
        if (Math.random() > 0.97) {
            shootingStars.push(new ShootingStar());
        }
    }

    // 애니메이션
    function animate() {
        ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);
        stars.forEach(star => star.update());
        shootingStars.forEach((shootingStar, index) => {
            shootingStar.update();
            if (shootingStar.opacity <= 0) {
                shootingStars.splice(index, 1);
            }
        });
        initShootingStars();
        requestAnimationFrame(animate);
    }

    // 초기화 및 애니메이션 시작
    initStars();
    animate();

    // 창 크기 조정 시 캔버스 크기 조정
    window.addEventListener('resize', function () {
        starCanvas.width = window.innerWidth;
        starCanvas.height = window.innerHeight;
        stars.length = 0;
        initStars();
    });

    function adjustVolume(volume) {
        // 배경 음악 요소를 찾아 음량 설정
        // document.getElementById('backgroundMusic').volume = volume;
        console.log("Volume set to: " + volume);
    }

});