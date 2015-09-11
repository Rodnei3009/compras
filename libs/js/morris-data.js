$(function() {
	
	var dados = [];
	var myData = new Firebase("https://newdashboard.firebaseio.com/chamados");
	
	myData.once('value', function(snapshot){

		snapshot.forEach(function(childSnapshot) {
			dados.push({'label': childSnapshot.name(), 'value': childSnapshot.val()});
		});	
		
        Morris.Donut({
            element: 'morris-donut-chart',
            data: dados //[{label: snapshot.name(), value: snapshot.val()}]
			
        });
		
	});
	
	
	var dadosArea = [];
	var myDataArea = new Firebase("https://newdashboard.firebaseio.com/chamados_dia_m_m1");
 
	myDataArea.once('value', function(snapshot){

		snapshot.forEach(function(childSnapshot) {	
			dadosArea.push({'y': childSnapshot.name(), 'M': + childSnapshot.child('M').val(), 'M-1': + childSnapshot.child('M-1').val()});
		});
		
		Morris.Area({
			element: 'morris-area-chart',
			data: dadosArea,
			xkey: 'y',
			ykeys: ['M', 'M-1'],
			labels: ['Mês corrente', 'Mês anterior'],
			pointSize: 2,
			hideHover: 'auto',
			resize: true
		});
	});
	
	
	var dadosLinha = [];
	var myDataLinha = new Firebase("https://newdashboard.firebaseio.com/chamados_dia_m_m1");
 
	myDataLinha.once('value', function(snapshot){

		snapshot.forEach(function(childSnapshot) {	
			dadosLinha.push({'y': childSnapshot.name(), 'M': + childSnapshot.child('M').val(), 'M-1': + childSnapshot.child('M-1').val()});
		});
		
		Morris.Line({
			element: 'morris-line-chart',
			data: dadosLinha,
			xkey: 'y',
			ykeys: ['M', 'M-1'],
			labels: ['Mês corrente', 'Mês anterior'],
			pointSize: 2,
			hideHover: 'auto',
			resize: true
		});
	});
	
	
	/*
    Morris.Area({
        element: 'morris-area-chart',
        data: [{
            period: '2010 Q1',
            iphone: 2666,
            ipad: null,
            itouch: 2647
        }, {
            period: '2010 Q2',
            iphone: 2778,
            ipad: 2294,
            itouch: 2441
        }, {
            period: '2010 Q3',
            iphone: 4912,
            ipad: 1969,
            itouch: 2501
        }, {
            period: '2010 Q4',
            iphone: 3767,
            ipad: 3597,
            itouch: 5689
        }, {
            period: '2011 Q1',
            iphone: 6810,
            ipad: 1914,
            itouch: 2293
        }, {
            period: '2011 Q2',
            iphone: 5670,
            ipad: 4293,
            itouch: 1881
        }, {
            period: '2011 Q3',
            iphone: 4820,
            ipad: 3795,
            itouch: 1588
        }, {
            period: '2011 Q4',
            iphone: 15073,
            ipad: 5967,
            itouch: 5175
        }, {
            period: '2012 Q1',
            iphone: 10687,
            ipad: 4460,
            itouch: 2028
        }, {
            period: '2012 Q2',
            iphone: 8432,
            ipad: 5713,
            itouch: 1791
        }],
        xkey: 'period',
        ykeys: ['iphone', 'ipad', 'itouch'],
        labels: ['iPhone', 'iPad', 'iPod Touch'],
        pointSize: 2,
        hideHover: 'auto',
        resize: true
    });
	*/
	
	var dadosBarra = [];
	var myDataBarra = new Firebase("https://newdashboard.firebaseio.com/chamados_mes_morris");
 
	myDataBarra.once('value', function(snapshot){

		snapshot.forEach(function(childSnapshot) {
			linhaArray = "";
			//alert(childSnapshot.name());	
			dadosBarra.push({'y': childSnapshot.name(), 'Meta': childSnapshot.child('Meta').val() , 'Real': + childSnapshot.child('Real').val()});
		});

		Morris.Bar({
			element: 'morris-bar-chart',
			data: dadosBarra,
			xkey: 'y',
			ykeys: ['Meta', 'Real'],
			labels: ['Meta', 'Real'],
			hideHover: 'auto',
			resize: true
		});
		
	});	

});
