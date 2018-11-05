for (let i = 0; i < $('ol li').length; i++) {
    let now = i * 150;
    $('ol li').eq(i).slideDown(400 + now);
}
for (let i = 0; i < 3; i++) {
    let now = $('.back img').eq(i).height();
    $('.back img').eq(i).height(now / 6);
}
$('#start').click(function () {
    $('.start_modal').slideUp(300);
    $('#logo').css({
        'left': '30px',
        'height': '30px'
    });
    $('.top').fadeIn(300);
    $('.controller_box').fadeIn(300, function () {
        $(this).css('display', 'flex');
    });
    $('#player').css({
        top: '200px',
        height: '50px'
    });
    setTimeout(function () {
        $('#player').css('transition', 'none');
        startFlag = true;
        running();

    }, 500);
    $('.wrap_back').append($(`<audio src="sound/background.mp3" autoplay loop></audio>`))
});

/**
 *
 * startFlag = Game Start Flag (true = play, false = stop)
 * MusicFlag = Music play Flag (true = play, false = paused)
 * ShootFlag = Player shoot Flag (true = can shoot, false cannot shoot)
 * scoreNum = Now playing score number
 * oilNUm = Now playing oil number
 * time = Now playing time
 * boomNum = Player shoot number
 * conVal = Player Controller type
 * speed = playing running speed
 * font_size = playing information font size number
 * playerObj = player ship obj, save player information
 */
var startFlag = false,
    musicFlag = true,
    shootFlag = true,
    overFlag = false,
    scoreNum = 0,
    oilNum = 15,
    time = 0,
    boomNum = 0,
    conVal = {
        left: false,
        up: false,
        right: false,
        down: false,
    },
    speed = 0,
    font_size = 23,
    playerObj = {
        x: 0,
        y: 0
    };

function running() {
    if (startFlag) {
        speed++;
        if (speed % 60 == 0) {
            if (oilNum <= 0) {
                stopGame();
                gameOver();
                return;
            }
            time++;
            oilNum--;
        }
        (speed % 180 == 0) && (create('oil'));
        (speed % 180 == 0) && (create('ship'));
        (speed % 260 == 0) && (create('friend'));
        (speed % 330 == 0) && (create('aestroid'));
        updateInformation();
        check($('#player'), $('.page span'));
        check($('.page .playerShoot'), $('.page span'));
        checkPlayerController();
        checkBoxBorder();
    }

    requestAnimationFrame(running);
}

function create(name) {
    let obj = $(`<span class="${name}" data-type="${name}" data-life="2" data-shot="1"></span>`);
    if (name == 'oil') {
        let randLeft = ~~(Math.random() * 860);
        obj.css('left', randLeft + 'px');
    } else {
        let randTop = ~~(Math.random() * 345) + 35;
        obj.css('top', randTop + 'px');
    }
    $('.page').append(obj);
}

/**
 *
 * @param e1 = element obj one
 * @param e2 = element obj two
 *
 * e1L = e1.left
 * e1T = e1.top
 * e1R = e1.right
 * e1b = e1.bottom
 * *
 * e2L = e2.left
 * e2T = e2.top
 * e2R = e2.right
 * e2b = e2.bottom
 */
function check(e1, e2) {
    for (let i = 0; i < e1.length; i++) {
        let e1L = e1.eq(i).offset().left;
        let e1T = e1.eq(i).offset().top;
        let e1R = e1L + e1.eq(i).width();
        let e1B = e1T + e1.eq(i).height()

        for (let j = 0; j < e2.length; j++) {
            let e2L = e2.eq(j).offset().left;
            let e2T = e2.eq(j).offset().top;
            let e2R = e2L + e2.eq(j).width();
            let e2B = e2T + e2.eq(j).height()

            if (e1L < e2R && e1R > e2L) {
                if (e1T < e2B && e1B > e2T) {
                    if (e1.eq(i).attr('data-type') == 'playerShoot') {
                        if (e2.eq(j).attr('data-type') == 'oil') {
                            return;
                        }
                        e1.eq(i).remove();
                        let now = e2.eq(j).attr('data-type');
                        if (now == 'ship') {
                            scoreNum += 5;
                            boomNum++;
                        } else if (now == 'friend') {
                            scoreNum -= 10;
                        } else if (now == 'aestroid') {
                            if (e2.eq(j).attr('data-life') == 2) {
                                e2.eq(j).attr('data-life', 1);
                                return;
                            } else {
                                scoreNum += 10;
                                boomNum++;
                            }
                        }
                        if (musicFlag && e2.eq(j).attr('class') != 'shipShoot') {
                            $('.wrap_back').append($(`<audio src="sound/destroyed.mp3" autoplay></audio>`))
                        }
                    } else {
                        let now = e2.eq(j).attr('data-type');
                        if (now == 'oil') {
                            oilNum += 15;
                        } else if (now != 'playerShoot') {
                            oilNum -= 15;
                            if (musicFlag && e2.eq(j).attr('class') != 'shipShoot') {
                                $('.wrap_back').append($(`<audio src="sound/destroyed.mp3" autoplay></audio>`))
                            }
                        }
                    }
                    e2.eq(j).remove();
                    updateInformation();

                }
            }
        }
    }
}

/**
 * updateInformation: can update playing information number (PS: time, score, oil...)
 */
function updateInformation() {
    oilNum = oilNum > 30 ? 30 : oilNum;
    let now = ((oilNum - 30) / 30) * 100;
    $('.length').css('left', now + '%')
    $('.oil_num').text(oilNum);
    $('.score_num').text(scoreNum);
    $('.boom_num').text(boomNum);
    $('.time_num').text(time);
}

$(document).keydown(function (e) {
    switch (e.keyCode) {
        case 37:
            conVal['left'] = true;
            e.preventDefault();
            break;
        case 38:
            conVal['up'] = true;
            e.preventDefault();
            break;
        case 39:
            conVal['right'] = true;
            e.preventDefault();
            break;
        case 40:
            conVal['down'] = true;
            e.preventDefault();
            break;
        case 32:
            playerShoot();
            e.preventDefault();
            break;
        case 80:
            stopGame();
            break;
    }
}).keyup(function (e) {
    switch (e.keyCode) {
        case 37:
            conVal['left'] = false;
            e.preventDefault();
            break;
        case 38:
            conVal['up'] = false;
            e.preventDefault();
            break;
        case 39:
            conVal['right'] = false;
            e.preventDefault();
            break;
        case 40:
            conVal['down'] = false;
            e.preventDefault();
            break;
        case 32:
            shootFlag = true;
            e.preventDefault();
            break;
    }
    if ($('#name').val()) {
        $('#continue').css({
            'opacity': '1',
            'cursor': 'pointer'
        })
    } else {
        $('#continue').css({
            'opacity': '.7',
            'cursor': 'no-drop'
        })
    }
});

$('.music').click(function () {
    if (startFlag) {
        stopMusic();
    }
})

function stopMusic() {
    if (musicFlag) {
        for (let i = 0; i < $('audio').length; i++) {
            $('audio')[i].volume = 0;
            $('.music')[0].src = 'images/mu_st.png';
        }
    } else {
        for (let i = 0; i < $('audio').length; i++) {
            $('audio')[i].volume = 1;
            $('.music')[0].src = 'images/mu_op.png';
        }
    }
    musicFlag = !musicFlag;
}

$('.game').click(stopGame);

function stopGame() {
    if (!overFlag) {
        if (startFlag) {
            for (let i = 0; i < $('.back img').length; i++) {
                $('.back img').eq(i).css('animation-play-state', 'paused');
            }
            $('.back').css('animation-play-state', 'paused');
            for (let i = 0; i < $('.page').children().length; i++) {
                $('.page').children().eq(i).css('animation-play-state', 'paused');
                if ($('.page').children().eq(i).attr('data-type') == 'friend') {
                    $('.page').children().eq(i).css('background', 'url(images/friend.png)no-repeat center / cover')
                }
            }
            for (let i = 0; i < $('.controller_box div').length; i++) {
                $('.controller_box div').eq(i).removeClass('mouse');
            }
            $('#player')[0].src = "images/player.png";
            $('.game')[0].src = 'images/game_st.png';
            musicFlag = true;

        } else {
            for (let i = 0; i < $('.back img').length; i++) {
                $('.back img').eq(i).css('animation-play-state', 'running');
            }
            $('.back').css('animation-play-state', 'running');
            for (let i = 0; i < $('.page').children().length; i++) {
                $('.page').children().eq(i).css('animation-play-state', 'running');
                if ($('.page').children().eq(i).attr('data-type') == 'friend') {
                    $('.page').children().eq(i).css('background', 'url(images/friend.gif)no-repeat center / cover')
                }
            }
            for (let i = 0; i < $('.controller_box div').length; i++) {
                $('.controller_box div').eq(i).addClass('mouse');
            }
            $('#player')[0].src = "images/player.gif";
            $('.game')[0].src = 'images/game_op.png';
        }
        stopMusic();
        startFlag = !startFlag;
    }
}

function gameOver() {
    $('.page').remove();
    $('.top').slideUp(200);
    $('.controller_box').remove();
    $('#player').slideUp(200);
    $('.start_modal').html('<label> Name: <input type="text" id="name" placeholder="Enter Your Name" /> </label> <button id="continue" onClick="postName()">Continue</button>').slideDown(300);
    $('#logo').css({
        left: '50%',
        height: '80px'
    });
    overFlag = true;
}

function postName() {
    if ($('#name').val()) {
        let name = $('#name').val();
        let ranking;
        if (localStorage.getItem('ranking')) {
            ranking = JSON.parse(localStorage.getItem('ranking'));
        } else {
            ranking = [];
        }
        ranking.push({
            name: name,
            score: scoreNum,
            time: time
        });
        localStorage.setItem('ranking', JSON.stringify(ranking));
        ranking.sort(function (a, b) {
            return (a.score == b.score) && (b.time - a.time) || (b.score - a.score);
        });
        $('.start_modal').html(`
            <div class="rank_top">
                <h3>Position</h3>
                <h3>Name</h3>
                <h3>Score</h3>
                <h3>Time</h3>
            </div>
            <ul id="ranking" title="Can Scroll">
            
            </ul>
            <button id="over" onclick="window.location.reload();">Start Game</button>
        `);
        for (let i in ranking) {
            ranking[i]['position'] = i / 1 + 1;
            if (i != 0) {
                if (ranking[i]['score'] == ranking[i - 1]['score'] && ranking[i]['time'] == ranking[i - 1]['time']) {
                    ranking[i]['position'] = ranking[i - 1]['position']
                }
            }
            $('#ranking').append(` 
                <li>
                    <p>${ranking[i]['position']}</p>
                    <p>${ranking[i]['name']}</p>
                    <p>${ranking[i]['score']}</p>
                    <p>${ranking[i]['time']}</p>
                </li>
            `);
        }
    } else {
        alert('Please Enter Your Name');
    }
}
//
// $('.controller_box div').hover(function () {
//     let now = $(this).attr('data-type');
//     conVal[now] = true;
// }, function () {
//     let now = $(this).attr('data-type');
//     conVal[now] = false;
// })

function checkPlayerController() {
    (conVal['left'] == true && $('#player').offset().left - $('.game_board').offset().left > 10) && (playerObj.x -= 7);
    (conVal['up'] == true && $('#player').offset().top - $('.game_board').offset().top > 40) && (playerObj.y -= 7);
    (conVal['right'] == true && $('#player').offset().left - $('.game_board').offset().left < 850) && (playerObj.x += 7);
    (conVal['down'] == true && $('#player').offset().top - $('.game_board').offset().top < 420) && (playerObj.y += 7);

    $('#player').css('transform', `translate(${playerObj.x}px, ${playerObj.y}px)`);

}

function checkBoxBorder() {
    for (let i = 0; i < $('.page').children().length; i++) {
        let now = $('.page').children().eq(i);
        (now.attr('class') == 'oil' && now.offset().top - $('.game_board').offset().top > 480) && (now.remove());
        (now.attr('class') == 'playerShoot' && now.offset().left - $('.game_board').offset().left > 960) && (now.remove());
        (now.attr('class') != 'playerShoot' && now.attr('class') != 'playerShoot' && now.offset().left - $('.game_board').offset().left < -100) && (now.remove());
        if (now.offset().left - $('.game_board').offset().left < 900 && now.attr('data-type') == 'ship') {
            if (now.attr('data-shot') == 1) {
                now.attr('data-shot', 0);
                let obj = $(`<span class="shipShoot" data-type="shipShoot"></span>`);
                obj.css({
                    left: now.offset().left - $('.game_board').offset().left + 'px',
                    top: now.offset().top + now.height() / 2 - $('.game_board').offset().top + 'px',
                })
                $('.page').append(obj);
            }
        }
    }
}

function playerShoot() {
    if (shootFlag && startFlag) {
        let obj = $(`<b class="playerShoot" data-type="playerShoot"></b>`);
        obj.css({
            left: $('#player').offset().left - $('.game_board').offset().left + $('#player').width() + 'px',
            top: $('#player').offset().top - $('.game_board').offset().top + $('#player').height() / 2 + 'px',
        });
        if (musicFlag) {
            $('.wrap_back').append($(`<audio src="sound/shoot.mp3" autoplay></audio>`))
        }
        $('.page').append(obj);
    }
    shootFlag = false;

}

$('.font').click(function (e) {
    if (startFlag) {
        let now = e.target.className;
        (now == 'num_up' && font_size < 30) && (font_size++);
        (now == 'num_down' && font_size > 16) && (font_size--);
        $('.top').css('font-size', font_size + 'px');
    }
})