// URL where json is hosted
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";


// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);
  });


