var express = require('express');
var session = require('express-session');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var errorHandler = require('express-error-handler');
var methodOverride = require('method-override');
var http = require('http');
var path = require('path');

var app = express();
var md = require('node-markdown').Markdown;
var fs = require('fs');

// all environments
var listenPort = 8078;

app.set('port', listenPort);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(methodOverride());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());


//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
/*
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
*/

app.get('/favicon.ico', function(req, res) {
	res.writeHead(200, {'Content-Type': 'image/x-icon'} );
	res.end();
	return;
});

app.get('/fit_ada?', function(req, res) {
    if(req.query.pass=='fitadavmfhwprxm!1')
    {
        var html = md(fs.readFileSync('ada_api.txt','utf8'),
            false,	// allow only HTML default sets
            "a|img",
            {
                "*":"title|style"		// 'title' and 'style' for all
            }
        );

        html = html.replace(/<pre>/gi,'<pre class="prettyprint linenums">');
        var errorhtml = md(fs.readFileSync('apiErrorCode.txt','utf8'),
            false,	// allow only HTML default sets
            "a|img",
            {
                "*":"title|style"		// 'title' and 'style' for all
            }
        );
        html = html.replace(/<pre>/gi,'<pre class="prettyprint linenums">');
        errorhtml = errorhtml.replace(/<pre>/gi,'<pre class="prettyprint linenums">');
        //html = html.replace(/<code>/gi,'<code class="">');

        res.send(
            "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>\n" +
            "<html xmlns='http://www.w3.org/1999/xhtml'>\n" +
            "<head>\n" +
            "	<meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>\n" +
            "	<link type='text/css' rel='stylesheet' href='stylesheets/markdown.css'/>\n" +
            "	<link type='text/css' rel='stylesheet' href='stylesheets/prettify.css'/>\n" +
            "	<link rel='shortcut icon' href='/favicon.ico' type='image/x-icon'/>\n" +
            "	<title>ADA API 일람</title>\n" +
            "	<script type='text/javascript' src='javascripts/json2.js'></script>\n" +
            "	<script type='text/javascript' src='javascripts/jquery.js'></script>\n" +
            "	<script type='text/javascript' src='javascripts/prettify.js'></script>\n" +
            "	<script type='text/javascript'>\n" +
            "	</script>\n" +
            "</head>\n" +
            "<body onload='prettyPrint()'>\n" +
            html + errorhtml +
            + "</body>\n"
            + "</html>\n"
        );
        //res.render(
        //	'Api',
        //	{
        //		layout : false,
        //		pretty : true,
        //	}
        //);
    } else {
        res.send('잘못된 접근입니다.');
    }
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
