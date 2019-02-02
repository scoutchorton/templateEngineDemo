//Requires
const express=require('express');
const fs=require('fs');
const app=express();
const path=require('path');

//Location of all of the website files (didn't bother move it because the site is still live, and this will remain intact if this replaces Apache)
var webUrl=path.resolve('.');

//The code that will translate the templates into complete HTML files
function interpret(data, baseUrl){
	//A template file will have an extra |scoutctemlplate in the DOCTYPE, so that's how each file is tested to be a template
	if(data.split('\n')[0]=='<!DOCTYPE html|scoutctemplate>'){
	        //Logging
		console.log('---Template file---');
		//Data from the original template file
		var tData=fs.readFileSync(webUrl+'template.html','utf8');
		//The template data is split on <|PAGE_CONTENT|> (see template.html), and then the actual file is put back in place, minus the doctype line
		data=tData.split('<|PAGE_CONTENT|>').join(data.split('\n').slice(1).join('\n'));
	}
	//All links are modified to use a base URL. When a folder is called, this will set the base URL to that folder's URL
	data=data.split('href="./').join(`href="${baseUrl}`).split('src="./').join(`src="${baseUrl}`);
	//Return interpreted/modified HTML file
	return data;
};

//Processes all GET requests. Can take up to 5 'parameters' (http://siteURL.com/parameter 1/parameter 2/parameter 3/parameter 4/parameter 5), where a parameter can be a folder name or file name.
app.get('/:p1?/:p2?/:p3?/:p4?/:p5?',function(req,res){
        //Logging
	console.log('-----Incoming request-----');
	//Initiates the URL variable
	url='';
	//Turns parameters into an array
	params=[req.params.p1, req.params.p2, req.params.p3, req.params.p4, req.params.p5];
	//Sets the base URL. If you run this on a server, make sure to change localhost to the LAN IP or server address
	baseUrl='http://localhost:3000/';
	//Runs for every parameter
	for(i in params){
	        //The URL is added to
		url+=(params[i]===undefined)?'':(([params[i]][0]===params[i].split('.')[0])?params[i]+'/':params[i]);
		        /*
		        If the parameter doesn't exist:
        		        (params[i]===undefined)?''
        		Otherwise:
        		        If the parameter is the same when tested for a '.' (to signify a folder)
        		                (([params[i]][0]===params[i].split('.')[0])?params[i]+'/':
        		        Otherwise:
                		        params[i]);
		        */
		//Similar process, but just returning folder names, and a blank string otherwise
		baseUrl+=(params[i]===undefined)?'':(([params[i]][0]===params[i].split('.')[0])?params[i]+'/':'');
	}
	//Logging
	console.log(`Base URL: ${baseUrl}`);
	//If the url is blank (root of the website), then make it a '/'
	url=(url=='')?'/':url;
	//If the last character in the URL is a '/' (being a folder)
	if(url.substring(url.length-1)==='/'){
	        //A check happens to see if there is an index file in that folder
		fs.exists(webUrl+url+'index.html', function(e){
		        //And adds it to the URL if it does exist
			url+=(e)?'index.html':'';
		});
	}
	//Logging
	console.log(`Parameters for URL: ${params}`);
	console.log(`Path to file from root: ${url}`);
        //Check to see if the file exists
	fs.exists(webUrl+url,function(e){
	        //If the file exists:
		if(e){
		        //If the file ends in .html
			if(url.slice(url.length-5)==='.html'){
			        //Logging
				console.log('.html file');
				//Read the file with UTF-8 encoding
				fs.readFile(webUrl+url, 'utf8', function(err, data){
				        //Throw errors if there are any
					if(err){throw err;}
				        //Send interpreted data from the file
					res.send(interpret(data,baseUrl));
				        //Logging
					console.log('-----File delivered-----\n');
				});
		        //If the file isn't a .html (and doesn't need to be processed)
			}else{
			        //Logging
				console.log('!.html file');
				//Sends the file without hesitation
				res.sendFile(webUrl+url);
				//Logging
				console.log('-----File delivered-----\n');
			}
		//If the file doesn't exist
		}else{
		        //Send a 404 message through the interpreter, which will give an HTML file based on the template in return to send back to the user.
			res.send(interpret('<h3>404 Error</h3>\n<p>Houston, we have a problem. While this may be an oversight by me, this link may be unavailable. Please check the URL. If you believe you have the correct link, wait and try again. Otherwise, I\'ll look into it.</p>'));
			//Logging
			console.log('-----(404) File delivered-----\n');
		}
	});
});

//Express to start listening on port 3000
app.listen(3000,function(){
        //Logging
	console.log('Started on port 3000');
});
