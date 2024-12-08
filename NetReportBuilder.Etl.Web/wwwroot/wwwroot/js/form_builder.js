

// custom js Here  


$(document).ready(function () {

    // custom dropdown jquery
    $('.select-dropcustom__button').on('click', function () {
        $('.select-dropcustom__list').toggleClass('active');
    });

    // Select dropdown item
    $('.select-dropcustom__list-item').on('click', function () {
        var itemValue = $(this).data('value');
        console.log(itemValue);
        $('.select-dropcustom__button span').text($(this).text()).parent().attr('data-value', itemValue);
        $('.select-dropcustom__list').toggleClass('active');
    });

    // Close dropdown when click occurs outside
    $(document).on('click', function (event) {
        var $target = $(event.target);
        if (!$target.closest('.select-dropcustom').length) {
            $('.select-dropcustom__list').removeClass('active');
        }
    });

    // custom dropdown jquery



    // horoizental tab

    $('.tab_horoizental .tab-link').click(function () {

        var tabID = $(this).attr('data-tab');

        $(this).addClass('active').siblings().removeClass('active');

        $('#tab-' + tabID).addClass('active').siblings().removeClass('active');
    });


    // horoizental tab

    $('.dropdown__custom').click(function (e) {
        e.stopPropagation();
        $('.dropdown-menu').toggleClass('show');
    });

    $(document).click(function () {
        $('.dropdown-menu').removeClass('show');
    });

    $('.dropdown-menu').click(function (e) {
        e.stopPropagation();
    });


    $(".dropdown__custom .nav-link").click(function () {
        $(".dropdown-menu").slideToggle();
    });



    $(function () {
        $('[data-bs-toggle="tooltip"]').tooltip();
    });





    // left side bar hide

    $(".collapse_icon").click(function () {
        $(".leftchart__section .tab-content").toggle();

        $(".leftchart__section").toggleClass("left_sideremove");
        $(".chart_right").toggleClass("full-display");

        let icon = $(this).find("i");
        if (icon.hasClass("bi-chevron-left")) {
            icon.removeClass("bi-chevron-left").addClass("bi-chevron-right");
        } else {
            icon.removeClass("bi-chevron-right").addClass("bi-chevron-left");
        }
    });




    $(document).ready(function () {
        $(".active__items").click(function (e) {
            e.preventDefault();
            $(".active__items").removeClass("active");
            $(this).addClass("active");
        });
    });




    // left side bar hide





    // right side bar hide


    $(".collapse_icon_right").click(function () {

        $(".dashboard-nav .tab_dashboard").toggle();
        $(".dashboard").toggleClass("right_sideremove");
        $(".dashboard-nav").toggleClass("full-display-right");


        let icon = $(this).find("i");
        if (icon.hasClass("bi-chevron-left")) {
            icon.removeClass("bi-chevron-left").addClass("bi-chevron-right");
        } else {
            icon.removeClass("bi-chevron-right").addClass("bi-chevron-left");
        }
    });

    // right side bar hide



    //    left sidebar menu active in-active

    $('.b-dashboard-menu a').click(function (event) {
        event.preventDefault();

        var link = $(this);
        var closest_ul = link.closest("ul");
        var closest_li = link.closest("li");
        var link_status = closest_li.hasClass("-is-active");

        if (!link_status) {
            closest_ul.find("li -is-active").removeClass("-is-active");
            closest_li.addClass("-is-active");
        } else {
            closest_li.removeClass("-is-active");
        }

        closest_li.children("ul").slideToggle();
    });



    //    left sidebar menu active in-active



}); 