// URL where json is hosted
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";


// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);

    // Get data, store in variables   
    let names = Object.values(data.names);
    console.log(names);

    let metadata = Object.values(data.metadata);
    console.log(metadata);

    let samples = Object.values(data.samples);
    console.log(samples);
    
    // add the ID numbers (names) to the Test Subject ID No. button
    d3.select("#selDataset")
    .selectAll('myOptions')
     	.data(names)
      .enter()
      .append('option')
      .text(d => d) // text showed in the menu
      .attr("value", d=>d) // corresponding value returned by the button

    //when id is changed in dropdown, update id
    d3.selectAll("#selDataset").on("change",optionChanged);

    //Select drop down menu
    let dropdownMenu = d3.select("#selDataset");

    // Assign the initial value of the dropdown menu option to a variable
    let init_id = dropdownMenu.property("value");
    
    //Initial plots and charts
    updateDemInfo(init_id);
    updateBarChart(init_id);
    updateBubble(init_id);
    



    function updateDemInfo(new_id){

      let dem_info = d3.select(".card-body");
      console.log("dem_info: " + dem_info);

      //Filter metadata to get row of data corresponding to new_id
      let display_data = metadata.filter(item => item.id == new_id);
      
      //Empty out the #sample-metadata section of text
      d3.select('#sample-metadata').text('');

      //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries      
      for (const [k, v] of Object.entries(display_data[0])){
        console.log('key,value: ' + k,v);
        //select the demographic info html section with d3 and append new pair of keys and values
        d3.select('#sample-metadata').append('h6').text(`${k} : ${v}`);
      };

      // could also use .forEach() like follows
      // Using array methods
        /* Object.entries(obj).forEach(([key, value]) => {
          console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"
        }); */

      console.log('display_data 2: ' + display_data);        

      };


    function updateBarChart(new_id){

      //Filter samples to get row of data corresponding to new_id
      let display_data = samples.filter(item => item.id == new_id);

      console.log('bar chart data: ' + display_data);
      //samples json keys: "id", "otu_ids", "sample_values", "otu_labels"
      //first 10 items for horizontal bar chart. need to reverse the values like in example 14.3
      //Use sample_values as the values for the bar chart.
      //Use otu_ids as the labels for the bar chart (insert text OTU into data elements).
      //Use otu_labels as the hovertext for the chart.

      let sample_values = display_data[0].sample_values.slice(0,10);
      let otu_ids = display_data[0].otu_ids.slice(0,10);
      otu_ids=otu_ids.map(item => `OTU ${item}`);
      let otu_labels = display_data[0].otu_labels.slice(0,10);

      //create the trace for bar chart
      let trace1 = {
        x: sample_values.reverse(),
        y: otu_ids.reverse(),
        text: otu_labels.reverse(),
        type: 'bar',
        orientation: 'h'
        };

    let layout = {title: "Top Ten OTUs"};

    //Create bar chart for top ten OTUs. in html 'bar' tag
    Plotly.newPlot("bar", [trace1], layout);

    };



    function updateBubble(new_id){

      //Filter samples to get row of data corresponding to new_id
      let display_data = samples.filter(item => item.id == new_id);

      console.log('bubble chart data: ' + display_data);
            //samples json keys: "id", "otu_ids", "sample_values", "otu_labels"
            //need to reverse the values like in example 14.3
            
        
      let sample_values = display_data[0].sample_values;
      let otu_ids = display_data[0].otu_ids;
      let otu_labels = display_data[0].otu_labels;

      //create the trace for bubble chart
      //Use otu_ids for the x values.
      //Use sample_values for the y values.
      //Use sample_values for the marker size.
      //Use otu_ids for the marker colors.
      //Use otu_labels for the text values.

      //used https://plotly.com/javascript/bubble-charts/ as reference for setting up the trace and markers
      let trace1={
        x: otu_ids.reverse(),
        y: sample_values.reverse(),
        text: otu_labels.reverse(),
        mode:'markers',
        marker:{
          size: sample_values,
          color: otu_ids
        }
      };
      
      let layout = {
        title: "Number of bacteria vs OTU",
        xaxis: {title: 'OTU id'},
        yaxis: {title: 'Number of Bacteria'}
    };

    //Create bubble chart for OTUs. in html 'bubble' tag
    Plotly.newPlot("bubble", [trace1], layout);

    };
    
    //Update all plots when new id is selected
    function updateAll(new_id){
      updateDemInfo(new_id);
      updateBarChart(new_id);
      updateBubble(new_id);
    };
    
    function optionChanged(){
      let dropdownMenu = d3.select("#selDataset");
      // Assign the value of the dropdown menu option to a variable
      new_id = dropdownMenu.property("value");
      console.log(new_id);
      updateAll(new_id);
    };
    



  });


// Call optionChanged() when a change takes place to the DOM
function optionChanged(){
  let dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  let new_id = dropdownMenu.property("value");
  console.log(new_id);
};



