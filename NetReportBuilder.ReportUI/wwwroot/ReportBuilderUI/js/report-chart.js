

// custom js Here  


$(document).ready(function() {


    // $('.datasource_tabs').click(function(){

    //     $('#show_newData').addClass("d-none");
    //      $('#show_sharedData').addClass("d-block");


    // });
    

    $('.dataset_tabs').click(function(){

        $('#show_sharedData').removeClass("d-block");
        $('#show_sharedData').addClass("d-none");
        $('#show_newData').removeClass("d-none");
        $('#show_newData').addClass("d-block");
    });

    
    
    $('#clickShared').click(function(){
        $('#show_data').removeClass("d-none");
        $('#removeBlog').addClass("d-none");
        $('#show_data').addClass("d-block");
    });



    $('#SharedDsource').click(function(){
        $('#new_connect').removeClass("d-none");
        $('#removeBlog').addClass("d-none");
        $('#new_connect').addClass("d-block");
    });






    $('.v-tab-check').click(function(){
        $('.shared_text').addClass("d-none");
        $('#removeBlog').removeClass("d-none");
    });


 // custom dropdown jquery
     $('.select-dropcustom__button').on('click', function() {
        $('.select-dropcustom__list').toggleClass('active');
    });

    // Select dropdown item
    $('.select-dropcustom__list-item').on('click', function() {
        var itemValue = $(this).data('value');
        console.log(itemValue);
        $('.select-dropcustom__button span').text($(this).text()).parent().attr('data-value', itemValue);
        $('.select-dropcustom__list').toggleClass('active');
    });

    // Close dropdown when click occurs outside
    $(document).on('click', function(event) {
        var $target = $(event.target);
        if (!$target.closest('.select-dropcustom').length) {
            $('.select-dropcustom__list').removeClass('active');
        }
    });

 // custom dropdown jquery



    

    $('.open-modal').click(function() {
        $('.modal-backdrop').addClass('show');
        $('.modal').addClass('show');
      });
    
      $('.close-modal').click(function() {
        $('.modal-backdrop').removeClass('show');
        $('.modal').removeClass('show');
      });

    new WOW().init();

    // auto search dropdown picker
    $('.js-example-basic-single').select2();

    // without serach picker

    $('.js-example-basic-single-no-search').select2({
        minimumResultsForSearch: Infinity
    });

    // horoizental tab

    $('.tab_horoizental .tab-link').click( function() {
	
        var tabID = $(this).attr('data-tab');
        
        $(this).addClass('active').siblings().removeClass('active');
        
        $('#tab-'+tabID).addClass('active').siblings().removeClass('active');
    });

   
   // horoizental tab

    $('.dropdown__custom').click(function(e) {
        e.stopPropagation();
        $('.dropdown-menu').toggleClass('show');
      });
    
      $(document).click(function() {
        $('.dropdown-menu').removeClass('show');
      });
    
      $('.dropdown-menu').click(function(e) {
        e.stopPropagation();
      });


    $(".dropdown__custom .nav-link").click(function(){
        $(".dropdown-menu").slideToggle();
      });



    $(function () {
        $('[data-bs-toggle="tooltip"]').tooltip();
      });





// left side bar hide

   var toggleDashboard = document.querySelector('.b-dashboard-toggler');
   var dashbrdGroups = document.getElementById('dashbrdGroups');
   var colRight = document.getElementById('colRight');

   toggleDashboard.addEventListener('click', function() {
       dashbrdGroups.classList.toggle('hidden');
       colRight.classList.toggle('full-display');
   });

// left side bar hide





// right side bar hide



// right side bar hide
   


//    left sidebar menu active in-active

$('.b-dashboard-menu a').click(function(event) {
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



   function fct_makeResizableDiv(div) {
       const element = document.querySelector(div);
       const resizer = document.querySelectorAll(div + ' .b-dashboard-resizer')
       const minimum_size = 20;
       let original_width = 0;
       let original_height = 0;
       let original_x = 0;
       let original_y = 0;
       let original_mouse_x = 0;
       let original_mouse_y = 0;
       for (let i = 0;i < resizer.length; i++) {
           const currentResizer = resizer[i];
           currentResizer.addEventListener('mousedown', function(e) {
               e.preventDefault()
               original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
               original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
               original_x = element.getBoundingClientRect().left;
               original_y = element.getBoundingClientRect().top;
               original_mouse_x = e.pageX;
               original_mouse_y = e.pageY;
               window.addEventListener('mousemove', fct_resize)
               window.addEventListener('mouseup', fct_stopResize)
           })

           function fct_resize(e) {      
                   const width = original_width + (e.pageX - original_mouse_x)
                   if (width > minimum_size) { element.style.width = width + 'px' }
               
           }

           function fct_stopResize() { window.removeEventListener('mousemove', fct_resize); }
       }
   } 
   fct_makeResizableDiv('#dashbrdGroups');



}); 
