let mixedChart = null;

function developModel(){
    
    document.getElementById('regressionEquation').style.display = "block";
    document.getElementById('regressionChart').style.display = "block";
    //init canvas
    if(mixedChart != null){
        mixedChart.destroy();
    }
    //Get input arrays
    var x_values = document.getElementById('x_values').value.split(",").map(Number);
    var y_values = document.getElementById('y_values').value.split(",").map(Number);
    
    //Get slope, intercept and R2 score
    var regressor = linearRegression(x_values, y_values);
    
    //Plot the chart
    plotRegressionChart(x_values, y_values, regressor['y_hat'], regressor['r2']);
      
    //Write the regression equation to the screen
    document.getElementById('regressionEquation').innerHTML = "<b>F(x): </b> "
    +String(regressor['slope'])+"*x + "
    +String(regressor['intercept']) + "<br><br> <p>Y = mX + c</p>  <b>m = </b>" 
    + String(regressor['slope']) + "<br><br> <b>c = </b>" 
    + String(regressor['intercept']);
    
  }
  
  function linearRegression(x_values, y_values){
          
      //Create the regressor object to store the equation's data
      var regressor = {};
      
      //Set variables we'll need to get the slope and intercept; we need to find the equation,
      // in the format y = m*x+b where m is the slope and b is the intercept
      var x_mean = x_values.reduce((a, b) => a + b, 0)/x_values.length;
      var y_mean = y_values.reduce((a, b) => a + b, 0)/y_values.length;
      
      //Equations to solve for slope: 
      var slope = 0, slope_numerator = 0, slope_denominator = 0;
      for(i=0; i<x_values.length; i++){
          slope_numerator += (x_values[i]-x_mean)*(y_values[i]-y_mean);
          slope_denominator += Math.pow((x_values[i]-x_mean),2)
      }
      
      slope = slope_numerator/slope_denominator;
      ////console.log(slope);
      regressor['slope'] = slope;
      
      //Equation to solve for intercept
      var intercept = y_mean - x_mean*slope;
      regressor['intercept'] = intercept;
  
      for(let j=1; j<=x_values.length; j++){
        let actual = (slope*x_values[j-1]) + intercept;
        //console.log(j + ". actual: " + actual);

        let errorRate = ((y_values[j-1]-actual) / y_values[j-1])*100;
        //console.log(j + ". errorRate: " + errorRate + "%");

        let trow = document.createElement("tr");
        let td0 = document.createElement('td');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');

        td0.innerHTML = j;
        td1.innerHTML = y_values[j-1];
        td2.innerHTML = actual;
        td3.innerHTML = errorRate;

        trow.appendChild(td0);
        trow.appendChild(td1);
        trow.appendChild(td2);
        trow.appendChild(td3);

        tableData.appendChild(trow);
        
      }

      //Get y_hat, or predicted values of y based on x_values
      //Loop through x_values, and run the elements through the lr equation to get predictions
      var y_hat = [];
      for(i=0; i<x_values.length; i++){
          ////console.log(x_values[i])
          y_hat.push(x_values[i]*regressor['slope']+regressor['intercept']);
      }
      regressor['y_hat'] = y_hat;
      
      
      //Now to find the r2 score
      var residual_sum_of_squares = 0, total_sum_of_squares = 0, r2 = 0;
      
      for(i=0; i<y_values.length; i++){
              residual_sum_of_squares+= Math.pow((y_hat[i]-y_values[i]),2);
              total_sum_of_squares += Math.pow((y_hat[i]-y_mean),2);
      }
      
      r2 = 1- residual_sum_of_squares/total_sum_of_squares;
      
      //Add to regressor object
      regressor['r2'] = r2;
      ////console.log(r2);
          
      return regressor;
          
  }
  
  
  


  function plotRegressionChart(x_values, y_values, y_hat, r2){
      ctx = document.getElementById('regressionChart');
      mixedChart = new Chart(ctx, {
        
        data: {
            datasets: [{
                type: 'scatter',
                label: 'Line of Best Fit (Coefficient of Determination: '+String(r2)+')',
                data: y_hat,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)'
            },{
                type: 'line',
                data: y_hat,
                label:'',
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)'
            },
            {
                type: 'scatter',
                label: 'True Values',
                data: y_values,
                backgroundColor: 'rgb(0, 0, 0)',
            }],
            labels: x_values
        },
        options: {
            responsive: true,
            plugins: {
              tooltip: {
                mode: 'index',
                intersect: false
              },
              title: {
                display: true,
                text: 'Rating Curve Line Chart',
                color: '#3f7897',
                font: {weight: 'bold',size:22},
              }
            },
            hover: {
              mode: 'index',
              intersec: false
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: '[R*60/t2] (rpm)',
                  color: '#3f7897',
                  font: {weight: 'bold',size:16},
                  padding: 10,
                },
                min: 0,
                
                ticks: {
                    beginAtZero: true,
                    stepSize:10
                },
                beginAtZero: true,
              },
              y: {
                title: {
                  display: true,
                  text: '[D/t1] (m/s)',
                  color: '#3f7897',
                  font: {weight: 'bold',size:16},
                  padding: 14,
                  

                },
                min: 0,
                ticks: {
                    beginAtZero: true
                }
                
              }
            },
            layout: {
                padding: {
                    left: 50,
                    right: 50,
                }
            }
        }
        
    });
    
  }