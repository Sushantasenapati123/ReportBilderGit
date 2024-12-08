

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




$(document).ready(function () {
    $(".form_bal_chart").draggable({
        helper: function () {
            return getNumberFieldHTML();
        },
        connectToSortable: ".form_builder_area"
    });
    $(".bar_charts").draggable({
        helper: function () {
            return getBarChartFieldHTML();
        },
        connectToSortable: ".form_builder_area"
    });
    $(".pie_charts").draggable({
        helper: function () {
            return getPieChartFieldHTML();
        },
        connectToSortable: ".form_builder_area"
    });
    $(".exploded_pie").draggable({
        helper: function () {
            return getExplodedPieChartFieldHTML();
        },
        connectToSortable: ".form_builder_area"
    });
    $(".area_charts").draggable({
        helper: function () {
            return getAreaChartFieldHTML();
        },
        connectToSortable: ".form_builder_area"
    });
    $(".smooth_area").draggable({
        helper: function () {
            return getSmoothAreaChartFieldHTML();
        },
        connectToSortable: ".form_builder_area"
    });   
    $(".stacked_areachart").draggable({
        helper: function () {
            return getStackedAreaChartFieldHTML();
        },
        connectToSortable: ".form_builder_area"
    });
    $(".stacked_charts").draggable({
        helper: function () {
            return getStackedChartFieldHTML();
        },
        connectToSortable: ".form_builder_area"
    });
    $(".table_creation").draggable({
        helper: function () {
            return getTableCreationHTML();
        },
        connectToSortable: ".form_builder_area"
    });
    $(".matrix_data").draggable({
        helper: function () {
            return getMatrixCreationHTML();
        },
        connectToSortable: ".form_builder_area"
    });
    $(".list_data").draggable({
        helper: function () {
            return getListCreationHTML();
        },
        connectToSortable: ".form_builder_area"
    });
    $(".map_data").draggable({
        helper: function () {
            return getMapCreationHTML();
        },
        connectToSortable: ".form_builder_area"
    });
    $(".form_builder_area").sortable({
        cursor: 'move',
        placeholder: 'placeholder',
        start: function (e, ui) {
            ui.placeholder.height(ui.helper.outerHeight());
        },
        stop: function (ev, ui) {
            getPreview();
        }
    });
    $(".form_builder_area").disableSelection();



    //Column Chart
    function getNumberFieldHTML() {
        var field = generateField();
        var html = `
        <div class="all_div">
            <div class="builder_heading">
                <label> Column </label>
                <button class="btn btn-primary btn-sm pull-right remove_bal_field" data-field="${field}" type="button">
                    <i class="bi bi-x-lg" title="Close"></i>
                </button>
            </div>
        </div>
        <div class="form_output" data-field="${field}" data-type="text">
            <div class="body_drag">
                <div id="columngraph"></div>
            </div>
        </div>`;
    
        var $html = $('<div>').addClass('li_' + field + ' form_builder_field chart__properties').html(html);
    
        $('body').append($html);
    
        // Initialize Highcharts chart
        Highcharts.chart('columngraph', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Column Chart',
                align: 'left'
            },
            xAxis: {
                categories: ['A', 'B', 'C', 'D']
            },
            yAxis: {
                allowDecimals: false,
                min: 0,
                title: {
                    text: 'Count medals'
                }
            },
            tooltip: {
                headerFormat: '<b>{point.key}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal'
                }
            },
            series: [{
                name: 'A',
                data: [148, 133, 124],
                stack: 'A'
            }, {
                name: 'B',
                data: [102, 98, 65],
                stack: 'B'
            }, {
                name: 'C',
                data: [113, 122, 95],
                stack: 'C'
            }]
        });
    
     
        $('.chart__properties').addClass('d-block').removeClass('d-none');
    

        $html.addClass('d-block').removeClass('d-none');

        $html.on('dragstop', function() {
            $(this).removeClass('d-block').addClass('d-none');
        });
    
        $html.find('.remove_bal_field').on('click', function() {
            $('.chart__properties').removeClass('d-block').addClass('d-none');
        });
    
        return $html;
    }
    
    //Bar Chart
    function getBarChartFieldHTML() {
        var field = generateField();
        var html = `
        <div class="all_div">
            <div class="builder_heading">
                <label> Bar </label>
                <button class="btn btn-primary btn-sm pull-right remove_bal_field" data-field="${field}" type="button">
                    <i class="bi bi-x-lg" title="Close"></i>
                </button>
            </div>
        </div>
        <div class="form_output" data-field="${field}" data-type="text">
            <div class="body_drag">
                <div id="barchart"></div>
            </div>
        </div>`;
    

        var $html = $('<div>').addClass('li_' + field + ' form_builder_field').html(html);
    

        $('body').append($html);
    
        // Initialize Highcharts chart
        Highcharts.chart('barchart', {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Bar Chart'
            },
            xAxis: {
                categories: ['F', 'E', 'D', 'C', 'B', 'A']
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Goals'
                }
            },
            legend: {
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [{
                name: 'Series 1',
                data: [4, 4, 6, 10, 12, 14]
            }, {
                name: 'Series 2',
                data: [5, 3, 12, 14, 12, 10]
            }]
        });
        
    
        return $html;
    }

    //Pie Chart
    function getPieChartFieldHTML() {
        var field = generateField();
        var html = `
        <div class="all_div">
            <div class="builder_heading">
                <label> Pie </label>
                <button class="btn btn-primary btn-sm pull-right remove_bal_field" data-field="${field}" type="button">
                    <i class="bi bi-x-lg" title="Close"></i>
                </button>
            </div>
        </div>

        <div class="form_output" data-field="${field}" data-type="text">
            <div class="body_drag">
                <div id="piechart"></div>
            </div>
        </div>`;
    

        var $html = $('<div>').addClass('li_' + field + ' form_builder_field').html(html);
    

        $('body').append($html);
    
        // Initialize Highcharts chart
        const colors = Highcharts.getOptions().colors.map((c, i) =>
            Highcharts.color(Highcharts.getOptions().colors[0])
                .brighten((i - 3) / 7)
                .get()
        );

// Build the chart
Highcharts.chart('piechart', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Pie Chart Title',
        align: 'left'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            colors,
            borderRadius: 5,
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
                distance: -50,
                filter: {
                    property: 'percentage',
                    operator: '>',
                    value: 4
                }
            }
        }
    },
    series: [{
        name: 'Share',
        data: [
            { name: 'Category 1', y: 74.03 },
            { name: 'Category 2', y: 12.66 },
            { name: 'Category 3', y: 4.96 },
            { name: 'Category 4', y: 2.49 },
            { name: 'Category 5', y: 2.31 },
            { name: 'Category 6', y: 3.398 }
        ]
    }]
});

        
    
        return $html;
    }
    
    //Exploded Pie Chart
    function getExplodedPieChartFieldHTML() {
        var field = generateField();
        var html = `
        <div class="all_div">
            <div class="builder_heading">
                <label> Pie </label>
                <button class="btn btn-primary btn-sm pull-right remove_bal_field" data-field="${field}" type="button">
                    <i class="bi bi-x-lg" title="Close"></i>
                </button>
            </div>
        </div>

        <div class="form_output" data-field="${field}" data-type="text">
            <div class="body_drag">
                <div id="explodpiechart"></div>
            </div>
        </div>`;
    

        var $html = $('<div>').addClass('li_' + field + ' form_builder_field').html(html);
    

        $('body').append($html);
    
        // Initialize Highcharts chart
        const colors = Highcharts.getOptions().colors.map((c, i) =>
            Highcharts.color(Highcharts.getOptions().colors[0])
                .brighten((i - 3) / 7)
                .get()
        );

// Build exploded pie chart
Highcharts.chart('explodpiechart', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Exploded Pie Chart',
        align: 'left'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },
    series: [{
        name: 'All Category',
        colorByPoint: true,
        data: [{
            name: 'Category 1',
            y: 74.77,
            sliced: true,
            selected: true
        },  {
            name: 'Category 2',
            y: 12.82
        },  {
            name: 'Category 3',
            y: 4.63
        }, {
            name: 'Category 4',
            y: 2.44
        }, {
            name: 'Category 5',
            y: 2.02
        }, {
            name: 'Category 6',
            y: 3.28
        }]
    }]
});

        
        return $html;
    }
    
    //AreaChart
    function getAreaChartFieldHTML() {
        var field = generateField();
        var html = `
        <div class="all_div">
            <div class="builder_heading">
                <label> Area </label>
                <button class="btn btn-primary btn-sm pull-right remove_bal_field" data-field="${field}" type="button">
                    <i class="bi bi-x-lg" title="Close"></i>
                </button>
            </div>
        </div>
        <div class="form_output" data-field="${field}" data-type="text">
            <div class="body_drag">
                <div id="areagraph"></div>
            </div>
        </div>`;
    

        var $html = $('<div>').addClass('li_' + field + ' form_builder_field').html(html);
        
    

        $('body').append($html);
    
        // Initialize Highcharts chart
        Highcharts.chart('areagraph', {
            chart: {
                type: 'area'
            },
            title: {
                text: 'Area Charts',
                align: 'left'
            },

            yAxis: {
                title: {
                    useHTML: true,
                    text: 'Area Charts'
                }
            },
            tooltip: {
                shared: true,
                headerFormat: '<span style="font-size:12px"><b>{point.key}</b></span>' +
                    '<br>'
            },
            plotOptions: {
                series: {
                    pointStart: 2012
                },
                area: {
                    stacking: 'normal',
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: '#666666'
                    }
                }
            },
            series: [{
                name: 'Series 1',
                data: [13234, 12729]
            }, {
                name: 'Series 2',
                data: [6685, 6535]
        
            }]
        });
        
    
        return $html;
    }

    //Smooth Area Chart
    function getSmoothAreaChartFieldHTML() {
        var field = generateField();
        var html = `
        <div class="all_div">
            <div class="builder_heading">
                <label> Smooth Area </label>
                <button class="btn btn-primary btn-sm pull-right remove_bal_field" data-field="${field}" type="button">
                    <i class="bi bi-x-lg" title="Close"></i>
                </button>
            </div>
        </div>
        <div class="form_output" data-field="${field}" data-type="text">
            <div class="body_drag">
                <div id="smoothgraph"></div>
            </div>
        </div>`;
    

        var $html = $('<div>').addClass('li_' + field + ' form_builder_field').html(html);
        
    

        $('body').append($html);
    
        // Initialize Highcharts chart
Highcharts.chart('smoothgraph', {
    chart: {
        type: 'area'
    },
    accessibility: {
        description: 'Smooth Area Graph'
    },
    title: {
        text: 'US and USSR nuclear stockpiles'
    },
    subtitle: {
        text: 'Source: <a href="https://fas.org/issues/nuclear-weapons/status-world-nuclear-forces/" ' +
            'target="_blank">FAS</a>'
    },
    xAxis: {
        allowDecimals: false,
        accessibility: {
            rangeDescription: 'Range: 1940 to 2017.'
        }
    },
    yAxis: {
        title: {
            text: 'Nuclear weapon states'
        }
    },
    tooltip: {
        pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>' +
            'warheads in {point.x}'
    },
    plotOptions: {
        area: {
            pointStart: 1940,
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            }
        }
    },
    series: [{
        name: 'USA',
        data: [
            null, null, null, null, null, 2, 9, 13, 50, 170, 299, 438, 841,
            1169, 1703, 2422, 3692, 5543, 7345, 12298, 18638, 22229, 25540,
            28133, 29463, 31139, 31175, 31255, 29561, 27552, 26008, 25830,
            26516, 27835, 28537, 27519, 25914, 25542, 24418, 24138, 24104,
            23208, 22886, 23305, 23459, 23368, 23317, 23575, 23205, 22217,
            21392, 19008, 13708, 11511, 10979, 10904, 11011, 10903, 10732,
            10685, 10577, 10526, 10457, 10027, 8570, 8360, 7853, 5709, 5273,
            5113, 5066, 4897, 4881, 4804, 4717, 4571, 4018, 3822, 3785, 3805,
            3750, 3708, 3708
        ]
    }, {
        name: 'USSR/Russia',
        data: [
            null, null, null, null, null, null, null, null, null,
            1, 5, 25, 50, 120, 150, 200, 426, 660, 863, 1048, 1627, 2492,
            3346, 4259, 5242, 6144, 7091, 8400, 9490, 10671, 11736, 13279,
            14600, 15878, 17286, 19235, 22165, 24281, 26169, 28258, 30665,
            32146, 33486, 35130, 36825, 38582, 40159, 38107, 36538, 35078,
            32980, 29154, 26734, 24403, 21339, 18179, 15942, 15442, 14368,
            13188, 12188, 11152, 10114, 9076, 8038, 7000, 6643, 6286, 5929,
            5527, 5215, 4858, 4750, 4650, 4600, 4500, 4490, 4300, 4350, 4330,
            4310, 4495, 4477
        ]
    }]
});

    
        return $html;
    }

    //Stacked Area Chart
    function getStackedAreaChartFieldHTML() {
        var field = generateField();
        var html = `
        <div class="all_div">
            <div class="builder_heading">
                <label> Stacked Area Chart </label>
                <button class="btn btn-primary btn-sm pull-right remove_bal_field" data-field="${field}" type="button">
                    <i class="bi bi-x-lg" title="Close"></i>
                </button>
            </div>
        </div>
        <div class="form_output" data-field="${field}" data-type="text">
            <div class="body_drag">
                <div id="stckareachart"></div>
            </div>
        </div>`;
    

        var $html = $('<div>').addClass('li_' + field + ' form_builder_field').html(html);
        
    

        $('body').append($html);
    
        // Initialize Highcharts chart
        Highcharts.chart('stckareachart', {
            chart: {
                type: 'area'
            },
            title: {
                text: 'Stacked Area Chart',
                align: 'left'
            },
            subtitle: {
                text: 's',
                align: 'left'
            },
            yAxis: {
                title: {
                    useHTML: true,
                    text: 'Milestones'
                }
            },
            tooltip: {
                shared: true,
                headerFormat: '<span style="font-size:12px"><b>{point.key}</b></span>' +
                    '<br>'
            },
            plotOptions: {
                series: {
                    pointStart: 2012
                },
                area: {
                    stacking: 'normal',
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: '#666666'
                    }
                }
            },
            series: [{
                name: 'Category 1',
                data: [13234, 12729, 11533, 17798, 10398, 12811, 15483, 16196]
            }, {
                name: 'Category 2',
                data: [6685, 6535, 6389, 6384, 6251, 5725, 5631, 5047, 5039]
        
            }, {
                name: 'Category 3',
                data: [4752, 4820, 4877, 4925, 5006, 4976, 4946, 4911, 4913]
            }, {
                name: 'Category 4',
                data: [3164, 3541, 3898, 4115, 3388, 3569, 3887, 4593, 1550]
        
            }, {
                name: 'Category 5',
                data: [2019, 2189, 2150, 2217, 2175, 2257, 2344, 2176, 2186]
            }]
        });
        
    
        return $html;
    }


    function getStackedChartFieldHTML() {
        var field = generateField();
        var html = `
        <div class="all_div">
            <div class="builder_heading">
                <label> Stacked Column </label>
                <button class="btn btn-primary btn-sm pull-right remove_bal_field" data-field="${field}" type="button">
                    <i class="bi bi-x-lg" title="Close"></i>
                </button>
            </div>
        </div>
        <div class="form_output" data-field="${field}" data-type="text">
            <div class="body_drag">
                <div id="stackedChart"></div>
            </div>
        </div>`;
    

        var $html = $('<div>').addClass('li_' + field + ' form_builder_field').html(html);
        
    

        $('body').append($html);
    
        // Initialize Highcharts chart
Highcharts.chart('stackedChart', {

    chart: {
        type: 'column'
    },

    title: {
        text: 'Stacked Column Charts',
        align: 'left'
    },

    xAxis: {
        categories: ['A', 'B', 'C', 'D', 'E']
    },

    yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
            text: 'Count'
        }
    },

    tooltip: {
        format: '<b>{key}</b><br/>{series.name}: {y}<br/>' +
            'Total: {point.stackTotal}'
    },

    plotOptions: {
        column: {
            stacking: 'normal'
        }
    },

    series: [{
        name: 'Series 1',
        data: [148, 133, 100, 55, 120],
        stack: 'Series'
    }, {
        name: 'Series 2',
        data: [102, 98, 60, 55, 70],
        stack: 'Series'
    }]
});

        
    
        return $html;
    }


    function getTableCreationHTML() {
        var field = generateField();
        var html = `

        <div class=all_div>
        <div class=builder_heading><label>Table</label> <button class="btn btn-primary btn-sm pull-right remove_bal_field"
                data-field="${field}" type=button><i class="bi bi-x-lg" title="Close"></i></button></div>
    </div>
    <div class=form_output data-field="${field}" data-type=text>
        <div class=body_drag>
            <div class="chart_table">
                <table class="table table-bordered">
                    <tr>
                        <td class="table_gridname">
                            <input class="table-form-control">
                            <ul class="sltdropdown table_icon">
                                <li>
                                <a href="#"> <div> <i class="bi bi-card-list"></i> </div>
                                    <ul class="active_drop">
                                        <li><a href="#"> Add Data Set </a></li>
                                        <li data-bs-toggle="modal" data-bs-target="#dataSource2"><a href="#"> Add Text </a></li>
                                    </ul>
                                </a>
                                   
                                </li>
                            </ul>


                    <div class="modal fade" id="dataSource2">
                        <div class="modal-dialog modal-dialog-centered">
                          <div class="modal-content">
                            <div class="modal-header">

                             <div class="row w-100">
                                <h5 class="modal-title" id="exampleModalLabel"> Add Text </h5>
                              
                             </div>
                             
                              <button type="button" class="btn-close ms-2" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">

                            <textarea class="form-control" rows="5" cols="5"></textarea>
                             
                            </div>
                            <div class="modal-footer">
                              
                              <button type="button" class="btn btn-primary"> Add </button>
                              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            </div>
                          </div>
                        </div>
                      </div>
                           
                        </td>
                        <td class="table_gridname"><input class="table-form-control">
                        <ul class="sltdropdown table_icon">
                        <li>
                        <a href="#"> <div> <i class="bi bi-card-list"></i> </div>
                            <ul class="active_drop">
                                <li><a href="#"> Add Data Set </a></li>
                                <li data-bs-toggle="modal" data-bs-target="#dataSource2"><a href="#"> Add Text </a></li>
                            </ul>
                        </a>
                           
                        </li>
                    </ul>
                        </td>
                        
                    </tr>
                    <tr>
                        <td class="table_gridname"><input class="table-form-control">
                             <ul class="sltdropdown table_icon">
                                <li>
                                <a href="#"> <div> <i class="bi bi-card-list"></i> </div>
                                    <ul class="active_drop">
                                        <li><a href="#"> Add Data Set </a></li>
                                        <li data-bs-toggle="modal" data-bs-target="#dataSource2"><a href="#"> Add Text </a></li>
                                    </ul>
                                </a>
                                   
                                </li>
                            </ul>
                        </td>
                        <td class="table_gridname"><input class="table-form-control">
                             <ul class="sltdropdown table_icon">
                                <li>
                                <a href="#"> <div> <i class="bi bi-card-list"></i> </div>
                                    <ul class="active_drop">
                                        <li><a href="#"> Add Data Set </a></li>
                                        <li data-bs-toggle="modal" data-bs-target="#dataSource2"><a href="#"> Add Text </a></li>
                                    </ul>
                                </a>
                                   
                                </li>
                            </ul>
                        </td>
                        
                    </tr>
                </table>
            </div>
        </div>
    </div>`;

        
        var $html = $('<div>').addClass('li_' + field + ' form_builder_field table__properties').html(html);


        $('.table__properties').addClass('d-block').removeClass('d-none');
    

        $html.addClass('d-block').removeClass('d-none');

        $html.on('dragstop', function() {
            $(this).removeClass('d-block').addClass('d-none');
        });
    
        $html.find('.remove_bal_field').on('click', function() {
            $('.table__properties').removeClass('d-block').addClass('d-none');
        });
    
        return $html;
    }

    
    function getMatrixCreationHTML() {
        var field = generateField();
        var html = `
        
    <div class=all_div>
    <div class=builder_heading><label> Matrix </label> <button class="btn btn-primary btn-sm pull-right remove_bal_field"
            data-field="${field}" type=button><i class="bi bi-x-lg" title="Close"></i></button></div>
</div>
<div class=form_output data-field="${field}" data-type=text>
    <div class=body_drag>
        <div class="chart_table">
            <table class="table table-bordered">
                <tr>
                    <td class="table_gridname">
                        <input class="table-form-control">
                        <ul class="sltdropdown table_icon">
                            <li>
                            <a href="#"> <div> <i class="bi bi-card-list"></i> </div>
                                <ul class="active_drop">
                                    <li><a href="#"> Add Data Set </a></li>
                                    <li data-bs-toggle="modal" data-bs-target="#dataSource"><a href="#"> Add Text </a></li>
                                </ul>
                            </a>
                               
                            </li>
                        </ul>
                    
                        <div class="modal fade" id="dataSource">
                            <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">

                                <div class="row w-100">
                                 <h5 class="modal-title" id="exampleModalLabel"> Add Text </h5>
                               
                                </div>
                                
                                <button type="button" class="btn-close ms-2" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">

                                <textarea class="form-control" rows="5" cols="5"></textarea>
                                
                                </div>
                                <div class="modal-footer">
                                
                                <button type="button" class="btn btn-primary"> Add </button>
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                </div>
                            </div>
                            </div>
                        </div>

                        
                       
                    </td>
                    <td class="table_gridname"><input class="table-form-control" placeholder="Columns">
                         <ul class="sltdropdown table_icon">
                                <li>
                                <a href="#"> <div> <i class="bi bi-card-list"></i> </div>
                                    <ul class="active_drop">
                                        <li><a href="#"> Add Data Set </a></li>
                                        <li data-bs-toggle="modal" data-bs-target="#dataSource"><a href="#"> Add Text </a></li>
                                    </ul>
                                </a>
                                   
                                </li>
                            </ul>
                    </td>
                  
                </tr>
                <tr>
                    <td class="table_gridname"><input class="table-form-control" placeholder="Rows">
                         <ul class="sltdropdown table_icon">
                                <li>
                                <a href="#"> <div> <i class="bi bi-card-list"></i> </div>
                                    <ul class="active_drop">
                                        <li><a href="#"> Add Data Set </a></li>
                                        <li data-bs-toggle="modal" data-bs-target="#dataSource"><a href="#"> Add Text </a></li>
                                    </ul>
                                </a>
                                   
                                </li>
                            </ul>
                    </td>

                    <td class="table_gridname"><input class="table-form-control" placeholder="Data">
                         <ul class="sltdropdown table_icon">
                                <li>
                                <a href="#"> <div> <i class="bi bi-card-list"></i> </div>
                                    <ul class="active_drop">
                                        <li><a href="#"> Add Data Set </a></li>
                                        <li data-bs-toggle="modal" data-bs-target="#dataSource"><a href="#"> Add Text </a></li>
                                    </ul>
                                </a>
                                   
                                </li>
                            </ul>
                    </td>
                    
                </tr>
            </table>
        </div>
    </div>
</div>`;

        return $('<div>').addClass('li_' + field + ' form_builder_field').html(html);
    }


    function getListCreationHTML() {
        var field = generateField();
        var html = `
        
            <div class=all_div>
            <div class=builder_heading><label> List </label> <button class="btn btn-primary btn-sm pull-right remove_bal_field"
            data-field="${field}" type=button><i class="bi bi-x-lg" title="Close"></i></button></div>
            </div>
            <div class=form_output data-field="${field}" data-type=text>
            <div class=body_drag>
            <textarea class="form-control" placeholder="enter text here" rows="3" cols="3"> </textarea>
            </div>
            </div>`;

        return $('<div>').addClass('li_' + field + ' form_builder_field').html(html);
    }


    function getMapCreationHTML() {
        var field = generateField();
        var html = `
            <div class=all_div>
            <div class=builder_heading><label> Map </label> <button class="btn btn-primary btn-sm pull-right remove_bal_field"
                data-field="${field}" type=button><i class="bi bi-x-lg" title="Close"></i></button></div>
            </div>
            <div class=form_output data-field="${field}" data-type=text>
            <div class=body_drag>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d239487.1652253839!2d85.65564125231477!3d20.300807016970502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909d2d5170aa5%3A0xfc580e2b68b33fa8!2sBhubaneswar%2C%20Odisha!5e0!3m2!1sen!2sin!4v1716791506192!5m2!1sen!2sin" width="100%" height="200" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
            </div>`;

        return $('<div>').addClass('li_' + field + ' form_builder_field').html(html);
    }


    $(document).on('click', '.remove_bal_field', function (e) {
        e.preventDefault();
        var field = $(this).attr('data-field');
        $(this).closest('.li_' + field).hide('400', function () {
            $(this).remove();
            getPreview();
        });
    });

    $(document).on('keyup', '.form_input_button_class', function () {
        getPreview();
    });

    $(document).on('keyup', '.form_input_button_value', function () {
        getPreview();
    });

    $(document).on('keyup', '.form_input_placeholder', function () {
        getPreview();
    });

    $(document).on('keyup', '.form_input_label', function () {
        getPreview();
    });

    $(document).on('keyup', '.form_input_name', function () {
        getPreview();
    });

    function generateField() {
        return Math.floor(Math.random() * (100000 - 1 + 1) + 57);
    }


    function getPreview(plain_html = '') {

        var el = $('.form_builder_area .form_output');

        var html = '';

        el.each(function () {
            var data_type = $(this).attr('data-type');
            //var field = $(this).attr('data-field');
            var label = $(this).find('.form_input_label').val();
            var name = $(this).find('.form_input_name').val();
            if (data_type === 'text') {
                var placeholder = $(this).find('.form_input_placeholder').val();
                var checkbox = $(this).find('.form-check-input');
                var required = '';
                if (checkbox.is(':checked')) {
                    required = 'required';
                }
                html += '<div class="form-group"><label class="control-label">' + label + '</label><input type="text" name="' + name + '" placeholder="' + placeholder + '" class="form-control" ' + required + '/></div>';
            }
            if (data_type === 'number') {
                var placeholder = $(this).find('.form_input_placeholder').val();
                var checkbox = $(this).find('.form-check-input');
                var required = '';
                if (checkbox.is(':checked')) {
                    required = 'required';
                }
                html += '<div class="form-group"><label class="control-label">' + label + '</label><input type="number" name="' + name + '" placeholder="' + placeholder + '" class="form-control" ' + required + '/></div>';
            }
            if (data_type === 'email') {
                var placeholder = $(this).find('.form_input_placeholder').val();
                var checkbox = $(this).find('.form-check-input');
                var required = '';
                if (checkbox.is(':checked')) {
                    required = 'required';
                }
                html += '<div class="form-group"><label class="control-label">' + label + '</label><input type="email" name="' + name + '" placeholder="' + placeholder + '" class="form-control" ' + required + '/></div>';
            }
            if (data_type === 'password') {
                var placeholder = $(this).find('.form_input_placeholder').val();
                var checkbox = $(this).find('.form-check-input');
                var required = '';
                if (checkbox.is(':checked')) {
                    required = 'required';
                }
                html += '<div class="form-group"><label class="control-label">' + label + '</label><input type="password" name="' + name + '" placeholder="' + placeholder + '" class="form-control" ' + required + '/></div>';
            }
            if (data_type === 'textarea') {
                var placeholder = $(this).find('.form_input_placeholder').val();
                var checkbox = $(this).find('.form-check-input');
                var required = '';
                if (checkbox.is(':checked')) {
                    required = 'required';
                }
                html += '<div class="form-group"><label class="control-label">' + label + '</label><textarea rows="5" name="' + name + '" placeholder="' + placeholder + '" class="form-control" ' + required + '/></div>';
            }
            if (data_type === 'date') {
                var checkbox = $(this).find('.form-check-input');
                var required = '';
                if (checkbox.is(':checked')) {
                    required = 'required';
                }
                html += '<div class="form-group"><label class="control-label">' + label + '</label><input type="date" name="' + name + '" class="form-control" ' + required + '/></div>';
            }
            if (data_type === 'button') {
                var btn_class = $(this).find('.form_input_button_class').val();
                var btn_value = $(this).find('.form_input_button_value').val();
                html += '<button name="' + name + '" type="submit" class="' + btn_class + '">' + btn_value + '</button>';
            }
            if (data_type === 'select') {
                var option_html = '';
                $(this).find('select option').each(function () {
                    var option = $(this).html();
                    var value = $(this).val();
                    option_html += '<option value="' + value + '">' + option + '</option>';
                });
                html += '<div class="form-group"><label class="control-label">' + label + '</label><select class="form-control" name="' + name + '">' + option_html + '</select></div>';
            }
            if (data_type === 'radio') {
                var option_html = '';
                $(this).find('.mt-radio').each(function () {
                    var option = $(this).find('p').html();
                    var value = $(this).find('input[type=radio]').val();
                    option_html += '<div class="form-check"><label class="form-check-label"><input type="radio" class="form-check-input" name="' + name + '" value="' + value + '">' + option + '</label></div>';
                });
                html += '<div class="form-group"><label class="control-label">' + label + '</label>' + option_html + '</div>';
            }
            if (data_type === 'checkbox') {
                var option_html = '';
                $(this).find('.mt-checkbox').each(function () {
                    var option = $(this).find('p').html();
                    var value = $(this).find('input[type=checkbox]').val();
                    option_html += '<div class="form-check"><label class="form-check-label"><input type="checkbox" class="form-check-input" name="' + name + '[]" value="' + value + '">' + option + '</label></div>';
                });
                html += '<div class="form-group"><label class="control-label">' + label + '</label>' + option_html + '</div>';
            }
        });

        if (html.length) {
            $('.export_html').show();
        } else {
            $('.export_html').hide();
       
        }
        if (plain_html === 'html') {
            $('.preview').hide();
            $('.plain_html').show().find('textarea').val(html);
        } else {
            $('.plain_html').hide();
            $('.preview').html(html).show();
    }

    }


    $(document).on('click', '.export_html', function () {
        getPreview('html');
    });
});