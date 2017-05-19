

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var likesFly = function () {
    function likesFly() {
        _classCallCheck(this, likesFly);

        var _this = this;
        this.addHeartBlock();

        var a = document.querySelectorAll('.shirt__like');

        // for (var i = 0; i < a.length; i++) {

        //     a[i].addEventListener('click', function () {

        //         var element = this;
        //         if (this.classList.contains('shirt__like--active')) {
        //             _this.animation(element);
        //         }
        //     });
        // }
        var start = setInterval(function() {

            if (window.$ === undefined) return;
            $('.shirt__like').on('click',function(e){
                e.preventDefault();
                var $this = $(this),
                    params = {
                        'product_id': $this.data('id')
                    },
                    like_session_id = $.cookie('like_session_id');
                if (like_session_id && like_session_id !== 'undefined') params['like_session_id'] = like_session_id;
                $.ajax({
                    cache       : false,
                    url         : "/favor/",
                    type: 'get',
                    dataType: "json",
                    data: params,
                    success: function(res) {
                        $.cookie('like_session_id',res.like_session_id,{ expires: 30, path: '/' });
                        if (!$this.hasClass('shirt__like--active')) {
                            $this.addClass('shirt__like--active');

                            _this.animation($this[0]);

                        } else {
                            $this.removeClass('shirt__like--active');
                            if ($this.hasClass('shirt__like_favorites')) {
                                $this.closest('.clothing__shirt').slideUp();
                            }
                        }
                        var likedProducts = document.querySelector('.likedProducts');
                        if (res.favCount) {
                            likedProducts.setAttribute('href','/favorites/');
                            likedProducts.classList.add('likedProducts--active');

                        } else {
                            likedProducts.removeAttribute('href');
                            likedProducts.classList.remove('likedProducts--active');

                        }

                        setTimeout(function(){
                            var likedProductsCount = document.querySelectorAll('.likedProducts__count');
                            for (var i = 0; i < likedProductsCount.length; i++) {
                                likedProductsCount[i].innerHTML = res.favCount || '';
                            }
                        },1000);

                        if (typeof dataLayer!= 'undefined') dataLayer.push({event: 'autoEvent', eventCategory: 'catalogLike', eventAction: $this.data('id')});
                    }
                });
            });

            clearInterval(start);
        },500);
    }

    _createClass(likesFly, [{
        key: 'addHeartBlock',
        value: function addHeartBlock() {
            document.body.insertAdjacentHTML('afterbegin', '\n\t\t\t<div class="fixed__likedProducts fixed__likedProducts--hidden">\n                <a href="" class="likedProducts">\n                    <svg class="likedProducts__heart" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 21 18" version="1.1">\n                        <use xlink:href="#icon-likedProductsHeart" fill="inherit"></use>\n                    </svg>\n                    <div class="likedProducts__count"></div>\n                </a><span class="verticalAlignMethod"></span>\n            </div>');
            this.block = document.querySelector('.fixed__likedProducts');
            // var count = document.querySelector('.n-navbar__item--right .likedProducts').innerHTML;
            // this.block.innerHTML = count;
        }
    }, {
        key: 'animation',
        value: function animation(element) {
            console.log(element);
            var scrollY = window.scrollY || self.pageYOffset || document.documentElement && document.documentElement.scrollTop || document.body && document.body.scrollTop;
            
            var firstLiked = document.querySelector('.n-navbar__item--right .likedProducts');
            var secondLiked = document.querySelector('.n-products-page__head .likedProducts');
            var thirdLiked = document.querySelector('.filter__likedProducts .likedProducts');

            switch (true) {
                case document.body.clientWidth > 1000 && firstLiked && firstLiked.getBoundingClientRect().bottom > 0:
                    
                    this.deleteFly(this.fly(element, firstLiked));
                    return;
                    break;
                case document.body.clientWidth > 1000 && secondLiked && secondLiked.getBoundingClientRect().bottom > 0 && getComputedStyle(secondLiked).display !== 'none':
                    
                    this.deleteFly(this.fly(element, secondLiked));
                    return;
                    break;
                case document.body.clientWidth < 1000 && thirdLiked && thirdLiked.getBoundingClientRect().bottom > 0:
                    
                    this.deleteFly(this.fly(element, thirdLiked));
                    return;
                    break;
            }

            this.blockMovie(element);
        }
    }, {
        key: 'blockMovie',
        value: function blockMovie(element) {

            this.block.classList.add('fixed__likedProducts--show');
            if (document.querySelector('.n-header-mob-fixed-hide')) {
                this.block.style.top = '15px';
            } else {
                this.block.style.top = '80px';
            }

            var a = function (event) {
                var _this2 = this;
                if (!this.block.classList.contains('fixed__likedProducts--show')) {
                    return;
                }
                if (event.propertyName !== 'transform') {
                    return;
                }
                var copy = this.fly(element, this.block);

                copy.addEventListener('transitionend', function () {

                    _this2.block.classList.remove('fixed__likedProducts--show');

                    this.remove();
                });

                this.block.removeEventListener('transitionend', a);
            }.bind(this);

            this.block.addEventListener('transitionend', a);
        }
    }, {
        key: 'fly',
        value: function fly(element, toElement) {
            console.log(toElement);

            var pageY = pageYOffset;

            var thisParam = element.getBoundingClientRect();

            var copy = element.cloneNode(true);

            copy.style.position = 'fixed';

            copy.style.top = thisParam.top + 'px';

            copy.style.left = thisParam.left + 'px';
            copy.style.zIndex = '999999';
            copy.style.opacity = '1';

            copy.style.transition = 'top .7s cubic-bezier(0.24, 0.65, 0.36, 0.84), left .7s cubic-bezier(0.15, 0.8, 1, 1),transform .7s cubic-bezier(0.15, 0.8, 1, 1),opacity .7s linear';

            document.body.prepend(copy);

            var blockParam = toElement.querySelector('.likedProducts__heart').getBoundingClientRect();

            setTimeout(function () {
                var top = blockParam.top - thisParam.top + 5 + 'px';
                var left = blockParam.left - thisParam.left + 5 + 'px';
                copy.style.transform = 'translate(' + left + ',' + top + ') scale(.7)';
                copy.style.opacity = '.3';
            }, 4);

            return copy;
        }
    }, {
        key: 'deleteFly',
        value: function deleteFly(el) {
            el.addEventListener('transitionend', function () {

                if (event.propertyName !== 'transform') {
                    return;
                }
                this.remove();
            });
        }
    }]);

    return likesFly;
}();

// document.addEventListener('DOMContentLoaded', function () {
//     try {
//        new likesFly();
//     } catch (err) {
//         console.log(err.message);
//     }
// });
//  Пока нет нового подвала
function(){
    var a = setInterval(function(){
        if (!window.$) return;
        new likesFly();
        clearInterval(a);
    },400);
}