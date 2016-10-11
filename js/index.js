$(function () {
    //红桃：H，黑桃：S,梅花：Cart 方块：Disc

    $('.scene').on('mousedown', false)	//清除浏览器默认
    //把所有的牌处理好
    function makepoker() {
        var poker = [];
        var table = {};
        var colors = ['s', 'h', 'c', 'd']

        while (poker.length !== 52) {
            var n = Math.ceil(Math.random() * 13)
            var index = Math.floor(Math.random() * 4)
            var c = colors[index]
            var v = {color: c, number: n}
            if (!table[n + c]) {
                table[n + c] = true;
                poker.push(v)
            }
        }
        return poker;
    }

    function setpoker(poker) {
        var dict = {1: 'A', 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 'T', 11: 'J', 12: 'Q', 13: 'K'}
        var index = 0;
        var poke = 0
        // match=poker[number].splice(0,28)
        // console.log(match)
        //上面的牌
        for (var i = 0; i < 7; i++) {
            for (var j = 0; j < i + 1; j++) {
                poke = poker[index]
                index += 1
                $('<div>').addClass('pai')
                    .attr('id', i + '_' + j)
                    .addClass('exit')
                    .attr('data-number', poke.number)
                    .css({'backgroundImage': 'url(img/' + dict[poke.number] + poke.color + '.png)'})
                    .appendTo('.scene')
                    .delay(index * 30)
                    .animate({
                        top: i * 50,
                        left: (6 - i) * 60 + j * 125 + 20,
                        opacity: 1

                    })
            }
        }

        //下面的那摞牌
        for (; index < poker.length; index++) {
            v = poker[index];
            $('<div>').addClass('pai left')
                .attr('data-number', v.number)
                .css({'backgroundImage': 'url(img/' + dict[v.number] + v.color + '.png'})
                .appendTo('.scene')
                .delay(index * 20)
                .animate({
                    top: 480,
                    left: 190,
                    opacity: 1
                })
        }
        ;
    }

    // setpoker(makepoker())
    $('#a').on('click', function () {
        $('#a').removeClass('success')
    })

    var prev = null;

    function getNumber(a) {
        return parseInt($(a).attr('data-number'))
    }

    //判断纸牌是否被压
    function isCanClick(el) {
        var x = parseInt($(el).attr('id').split('_')[0])
        var y = parseInt($(el).attr('id').split('_')[1])
        if (( $('#' + (x + 1) + '_' + y).length ) || ( $('#' + (x + 1) + '_' + (y + 1)).length )) {
            return false;
        } else {
            return true;
        }
    }

    //纸牌消除
    var mindex = 0
    $('.scene').on('click', '.pai', function () {
        if ($(this).attr('id') && !isCanClick(this)) {
            return;
        }

        //点击牌的时候牌的样式
        var number = getNumber(this)
        $(this).addClass('active')

        //点击判断  如果是第一次点击走进else，先判断所点击的数字是不是13 是的话直接去掉 不是的话获取到所点击的纸牌的值
        // 如果是第二次点击 就进入if判断 两次点击的数字之和为13 就消掉，否则样式去掉
        if (prev) {
            if (getNumber(prev) + getNumber(this) === 13) {
                prev.add(this).animate({
                        left: 700,
                        top: 0
                    })
                    .queue(function () {
                        $(this).detach().dequeue()
                    })
                mindex++
                $('.score').text('SCORE:' + mindex * 10)
                $('.rest').text('MATCH:' + mindex)

            } else {
                prev.add(this).removeClass('active')

            }
            prev = null;
        } else {
            if (number === 13) {
                $(this).animate({
                        left: 700,
                        top: 0
                    })
                    .queue(function () {
                        $(this).detach().dequeue()
                    })
                mindex++
                $('.score').text('SCORE:' + mindex * 10)
                $('.rest').text('MATCH:' + mindex)
                return;
            }
            prev = $(this)
        }

        //如果上面的牌没有了 就表明游戏结束
        console.log($('.exit').length)
        if ($('.exit').length == 0) {
            $('#a').addClass('success').text('恭喜你,成功消除掉啦！');
            return;
        }

        // console.log(f)
    })

    var removeR = $('.move-r');
    var zindex = 50
    removeR.on('click', function () {
        return function () {
            if (!$('.left').length) {
                $('#a').addClass('success').text('亲，没牌啦！');
                return;
            }
            if ($('.pai').hasClass('active')) {
                $('.pai').removeClass('active')
            }
            zindex++;
            $('.left').last()
                .css({'z-Index': zindex})
                .animate({left: 580})
                .queue(function () {
                    $(this)
                        .removeClass('left')
                        .addClass('right')
                        .dequeue()
                })

        }
    }())

    var removeL = $('.move-l');
    var lnumber = 0;
    removeL.on('click', function () {
        return function () {
            if (!$('.left').length) {
                lnumber += 1;
            }
            $('.number').animate({fontSize: 20}).text(3 - lnumber)
            if (!$('.right').length) {
                $('#a').addClass('success').text('亲，没牌啦！');
                return;
            }
            if ($('.left').length) {
                return;
            }
            if (lnumber >= 3) {
                $('.number').animate({fontSize: 20}).text(0)
                $('#a').addClass('success').text('很遗憾，您输了！');
                return;
            }
            $('.right').each(function (i, v) {
                $(this)
                    .delay(i * 30)
                    .css({'z-Index': '0'})
                    .animate({left: 190})
                    .queue(function () {
                        $(this)
                            .removeClass('right')
                            .addClass('left')
                            .dequeue()
                    })
            })

        }
    }())
    //计时 点击第一张牌的时候开始计时
    var tindex = 0;
    var m = 0;
    time();
    // var t = setInterval(time, 1000)

    function time() {
        tindex++;
        // m=Math.floor(tindex/60);
        if (tindex >= 60) {
            tindex = 0;
            m++
        }
        $('.time').text('TIME:' + m + ':' + tindex)
    }

    var tf = true;

    $('.time').on('click', function () {
        if (tf) {
            tf = false;
            $('.pause').text('点击继续')
            clearInterval(t);

        } else {
            tf = true;
            $('.pause').text('点击暂停')
            t = setInterval(time, 1000)

        }
    })
    // $('.pause').hide()
    $('.time').hover(function () {
        $('.pause').css({
            'box-shadow': '10px 10px 10px 5px purple'
        }).animate({
            'top': '270px',
            'right': '50px',
            'opacity': '1'
        })
    }, function () {
        $('.pause').css({
            'box-shadow': '0 0 0 0 purple'
        }).animate({
            'top': '320px',
            'right': '0px',
            'opacity': '0'
        })
    })

    //重新发牌
    $('.restart').on('mousedown', false)
    $('.restart').on('click', function () {
        $('.pai').remove()
        $('.score').text('SCORE: 0')
        $('.rest').text('MATCH: 0')
        f = false;
        rnumber = 0;
        $('.time').text('TIME:' + 0 + ':' + 0)
        mindex = 0;
        tindex = 0
        setpoker(makepoker())
    })

    $('.scene').hide()
    $('.rest').hide();
    $('.restart').hide()
    $('.score').hide()
    $('.time').hide()
    var bf = true;
    $('.button').on('click', function () {
        if (bf) {
            bf = false;
            var t = setInterval(time, 1000)
            $('.scene').show()
            $('.rest').show();
            $('.restart').show()
            $('.score').show()
            $('.time').show()
            $('.start').hide()
            setpoker(makepoker())
        } else {
            bf = true;
            $('.scene').hide()
            $('.rest').hide();
            $('.restart').hide()
            $('.score').hide()
            $('.time').hide()
        }

    })
})