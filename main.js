(function(angular) {
    'use strict';
    console.log('main.js slideshow');
    

    function GalleryCtrl() {
        var vm = this;
        // Filter posts getting only images
        var _images = _.filter(vm.items, function(item) {
            return item.item_type === 'image';
        });
        vm.images = _.each(_images, function(item) {
            var credit = item.meta.credit;
            var caption = item.meta.caption;
            caption = caption ? '"' + caption + '"': caption;
            var full_caption = credit ? caption + ' by ' + credit : caption;
            item.meta.full_caption = full_caption;
        });
    }
    angular.module('theme')
    .controller('PostsCtrl', PostsCtrl)
    .controller('GalleryCtrl', GalleryCtrl)
    .directive('lbSlideItem', ['asset', function(asset) {
        return {
            restrict: 'AE',
            scope: {
                ident: '=',
                item: '=',
                gallery: '='
            },
            templateUrl: asset.templateUrl('views/item.html'),
        }
    }])
    .directive('lbGallery', ['asset', function(asset) {
        return {
            restrict: 'AE',
            scope: {
                items: '='
            },
            bindToController: true,
            controller: GalleryCtrl,
            controllerAs: 'gallery',
            templateUrl: asset.templateUrl('views/gallery.html'),
            link: function(scope, element, attrs, parentController) {
                var slideSelector = 'img';
                var slideOptions = {
                    showHideOpacity: true,
                    getThumbBoundsFn: false
                };
                var justifiedGalleryOptions = {
                    margins: 3
                };
                scope.$watch(attrs.items, function(value) {
                    setTimeout(function() {
                        var el = angular.element(element).find('.gallery');
                        $(el[0]).justifiedGallery(justifiedGalleryOptions).on('jg.complete', function() {
                            $(this).photoSwipe(slideSelector, slideOptions);
                        });
                    }, 100);
                });
            }
        }
    }])
    .directive('lbSlidePosts', ['asset', function(asset) {
        return {
            restrict: 'E',
            scope: {
                posts: '=',
                timeline: '='
            },
            bindToController: true,
            controller: PostsCtrl,
            controllerAs: 'ctrl',
            templateUrl: asset.templateUrl('views/posts.html')
        }
    }]);
    function PostsCtrl() {
        var vm = this;
        var all_posts = vm.posts();
        _.each(all_posts, function(post) {
            // Show gallery only for posts with more than 1 image.
            post.showGallery = _.filter(post.items, function(item) {
                return item.item_type === 'image';
            }).length > 1;
        });
        vm.all_posts = all_posts;
    }
})(angular);
