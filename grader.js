#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var restler = require('restler');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "http://msalcala11-bitstarter-mooc.herokuapp.com/index.html";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    //if this is a url, no need to check if it exists locally
    if(infile.substring(0,4)=="http"){
	return instr;
    }
    else{    
	console.log("checking if exists");
	if(!fs.existsSync(instr)) {
	    console.log("%s does not exist. Exiting.", instr);
	    process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
	}
	return instr;
    }
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {

//Lets check whether the htmfile string starts with "http". If so, we need to use restler to load it
   
   var first4chars = htmlfile.substring(0,4);
   

   if(first4chars == "http") {
       //run restler
       
    restler.get(htmlfile).on('complete', function(result) {
	if(result instanceof Error) {
	   console.log('Error: ' + result.message);
	   process.exit(1);
	}
	else{
	    //$ = cheerioHtmlFile(result);
	    result = String(result);
	    //sys.puts(result);
	    //var checks = loadChecks(checksfile).sort();
	    //var out = {};

	    //here's my own function that searches for each tag in checks
	    for(var ii in checks) {
		
		if(result.search(checks[ii]) > -1){
		    out[checks[ii]] = "true";
		    }
		else{
		    out[checks[ii]] = "false";
		    }
		}
	    //for(var ii in checks) {
		
		//var present = $(checks[ii]).length > 0;
		//out[checks[ii]] = present;
	    
	    //}
	    var outJson = JSON.stringify(out, null, 4);
	    console.log(outJson);
	}
      });

   }
   else { //run cheerio since this is just a local file not a url

    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
		var present = $(checks[ii]).length > 0;
		out[checks[ii]] = present;
    }
    return out;
   }
    //code to run while waiting for restler to do its thing
    console.log("Getting things ready while waiting for your page to load..");
    var checks = loadChecks(checksfile).sort();
    var out = {};
    
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
	.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
	.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
	.option('-u, --url <html_file>', 'Path to index.html', clone(assertFileExists) , URL_DEFAULT)
	.parse(process.argv);

    //now lets see whether the file option or url option was selected
    if(String(process.argv).search("--file") > -1){
	var checkJson = checkHtmlFile(program.file, program.checks);
    }
    else if(String(process.argv).search("--url") > -1){
	
	var checkJson = checkHtmlFile(program.url, program.checks);
    }
    else{//lets set the defualt behavior to be the local index.html
	var checkJson = checkHtmlFile(program.file, program.checks);
    }
    
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
