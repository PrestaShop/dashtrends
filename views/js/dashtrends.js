var dashtrends_data;
var dashtrends_chart;

function line_chart_trends(widget_name, chart_details)
{
	nv.addGraph(function() {  
		var chart = nv.models.lineChart()
			.x(function(d) { return (d !== undefined ? d[0] : 0); })
			.y(function(d) { return (d !== undefined ? d[1] : 0); })
			.tooltipContent(function(key, y, e, graph) {
				return '<div class="tooltip-panel text-center"><div class="tooltip-panel-heading">'+key+'</div><br/><strong>'+e+'</strong></div>';
			});
	
		chart.xAxis.tickFormat(function(d) {
			return d3.time.format('%m/%d/%y')(new Date(d))
		});

		first_data = new Array();
		first_data.push(chart_details.data[1]);
		first_data.push(chart_details.data[2]);

		chart.yAxis.tickFormat(function(d) {
			return formatCurrency(parseFloat(d), currency_format, currency_sign, currency_blank);
		});

		dashtrends_data = chart_details.data;
		dashtrends_chart = chart;

		d3.select('#dash_trends_chart1 svg')
			.datum(first_data)
			.call(chart);
		nv.utils.windowResize(chart.update);

		return chart;
	});
}

function selectDashtrendsChart(element, type)
{
	$('#dashtrends_toolbar dl').removeClass('active');
	current_charts = new Array();
	$.each(dashtrends_data, function(index, value) {
		if (value.id == type || value.id == type + '_compare')
		{
			if (value.id == type)
			{
				$(element).siblings().css('background-color', 'none');
				$(element).css('background-color', dashtrends_data[index].color);
			}
			current_charts.push(dashtrends_data[index]); 
			value.disabled = false;
		}
	});

	dashtrends_chart.yAxis.tickFormat(d3.format('.f'));

	if (type == 'sales' || type == 'average_cart_value' || type == 'net_profits')
		dashtrends_chart.yAxis.tickFormat(function(d) {
			return formatCurrency(parseFloat(d), currency_format, currency_sign, currency_blank);
		});

	if (type == 'conversion_rate')
		dashtrends_chart.yAxis.tickFormat(function(d) {
			return d3.round(d*100, 2)+' %';
		});

	d3.select('#dash_trends_chart1 svg')
		.datum(current_charts)
		.call(dashtrends_chart);
}