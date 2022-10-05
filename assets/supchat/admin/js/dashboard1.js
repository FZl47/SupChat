$(function () {
    "use strict";
    // ============================================================== 
    // Our Visitor
    // ============================================================== 

    var chart = c3.generate({
        bindto: '#visitor',
        data: {
            columns: [
                ['Other', 30],
                ['Desktop', 10],
                ['Tablet', 40],
                ['Mobile', 50],
            ],

            type: 'donut',
            onclick: function (d, i) {
                console.log("onclick", d, i);
            },
            onmouseover: function (d, i) {
                console.log("onmouseover", d, i);
            },
            onmouseout: function (d, i) {
                console.log("onmouseout", d, i);
            }
        },
        donut: {
            label: {
                show: false
            },
            title: "Visits",
            width: 20,

        },

        legend: {
            hide: true
            //or hide: 'data1'
            //or hide: ['data1', 'data2']
        },
        color: {
            pattern: ['#eceff1', '#24d2b5', '#6772e5', '#20aee3']
        }
    });
    // ============================================================== 
    // Our Income
    // ==============================================================
    var chart = c3.generate({
        bindto: '#income',
        data: {
            columns: [
                ['Growth Income', 100, 200, 100, 300],
                ['Net Income', 130, 100, 140, 200]
            ],
            type: 'bar'
        },
        bar: {
            space: 0.2,
            // or
            width: 15 // this makes bar width 100px
        },
        axis: {
            y: {
                tick: {
                    count: 4,

                    outer: false
                }
            }
        },
        legend: {
            hide: true
            //or hide: 'data1'
            //or hide: ['data1', 'data2']
        },
        grid: {
            x: {
                show: false
            },
            y: {
                show: true
            }
        },
        size: {
            height: 290
        },
        color: {
            pattern: ['#24d2b5', '#20aee3']
        }
    });

    // ============================================================== 
    // Sales Different
    // ============================================================== 

    var chart = c3.generate({
        bindto: '#sales',
        data: {
            columns: [
                ['One+', 50],
                ['T', 60],
                ['Samsung', 20],

            ],

            type: 'donut',
            onclick: function (d, i) {
                console.log("onclick", d, i);
            },
            onmouseover: function (d, i) {
                console.log("onmouseover", d, i);
            },
            onmouseout: function (d, i) {
                console.log("onmouseout", d, i);
            }
        },
        donut: {
            label: {
                show: false
            },
            title: "",
            width: 18,

        },
        size: {
            height: 150
        },
        legend: {
            hide: true
            //or hide: 'data1'
            //or hide: ['data1', 'data2']
        },
        color: {
            pattern: ['#eceff1', '#24d2b5', '#6772e5', '#20aee3']
        }
    });
    // ============================================================== 
    // Sales Prediction
    // ============================================================== 

    var chart = c3.generate({
        bindto: '#prediction',
        data: {
            columns: [
                ['data', 91.4]
            ],
            type: 'gauge',
            onclick: function (d, i) {
                console.log("onclick", d, i);
            },
            onmouseover: function (d, i) {
                console.log("onmouseover", d, i);
            },
            onmouseout: function (d, i) {
                console.log("onmouseout", d, i);
            }
        },

        color: {
            pattern: ['#ff9041', '#20aee3', '#24d2b5', '#6772e5'], // the three color levels for the percentage values.
            threshold: {
                //            unit: 'value', // percentage is default
                //            max: 200, // 100 is default
                values: [30, 60, 90, 100]
            }
        },
        gauge: {
            width: 22,
        },
        size: {
            height: 120,
            width: 150
        }
    });
    setTimeout(function () {
        chart.load({
            columns: [
                ['data', 10]
            ]
        });
    }, 1000);

    setTimeout(function () {
        chart.load({
            columns: [
                ['data', 50]
            ]
        });
    }, 2000);

    setTimeout(function () {
        chart.load({
            columns: [
                ['data', 70]
            ]
        });
    }, 3000);

    // ============================================================== 
    // Sales chart
    // ==============================================================
    // Morris.Area({
    //     element: 'sales-chart',
    //     data: [{
    //         period: '2011',
    //         Sales: 50,
    //         Earning: 80,
    //         Marketing: 20
    //     }, {
    //         period: '2012',
    //         Sales: 130,
    //         Earning: 100,
    //         Marketing: 80
    //     }, {
    //         period: '2013',
    //         Sales: 80,
    //         Earning: 60,
    //         Marketing: 70
    //     }, {
    //         period: '2014',
    //         Sales: 70,
    //         Earning: 200,
    //         Marketing: 140
    //     }, {
    //         period: '2015',
    //         Sales: 180,
    //         Earning: 150,
    //         Marketing: 140
    //     }, {
    //         period: '2016',
    //         Sales: 105,
    //         Earning: 100,
    //         Marketing: 80
    //     },
    //         {
    //             period: '2017',
    //             Sales: 250,
    //             Earning: 150,
    //             Marketing: 200
    //         }
    //     ],
    //     xkey: 'period',
    //     ykeys: ['Sales', 'Earning', 'Marketing'],
    //     labels: ['Site A', 'Site B', 'Site C'],
    //     pointSize: 0,
    //     fillOpacity: 0,
    //     pointStrokeColors: ['#20aee3', '#24d2b5', '#6772e5'],
    //     behaveLikeLine: true,
    //     gridLineColor: '#e0e0e0',
    //     lineWidth: 3,
    //     hideHover: 'auto',
    //     lineColors: ['#20aee3', '#24d2b5', '#6772e5'],
    //     resize: true
    //
    // });


});

function create_chart_section_chats(id, data) {
    let data_list = JSON.parse(data)
    let ctx = document.getElementById(`section-chart-${id}`).getContext('2d')
    let labels = []
    let data_num = []
    for (let data of data_list) {
        labels.push(`${data.day} روز `)
        data_num.push(data.count_chat)
    }
    if(labels.length == 1){
        labels[1] = labels[0]
        data_num[1] = data_num[0]
    }
    let data_conf = {
        labels: labels,
        datasets: [{
            label: 'تعداد گفت و گو ها',
            data: data_num,
            fill: {
                target: 'origin',
                above: 'rgba(231,255,248,0.2)',
            },
            borderColor: 'rgb(78,213,213)',
            tension: 0.3
        }]
    };
    let config = {
        type: 'line',
        data: data_conf,
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                },
                y: {
                    grid: {
                        color: 'rgba(238,238,238,0.4)',
                    },
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    }
    new Chart(ctx, config)
}