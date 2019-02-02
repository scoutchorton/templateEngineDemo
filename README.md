# Information
View the 'main.js' file for information about how Node.js processes data. If you want to test it out with the given files, you may clone this repository and use 'node main.js' in your console to test it.

Check out 'template.html' to see how the template is set up, and then view 'index.html' to see how a file looks and will be imported.

If you decide to test it out, go to the root page (assuming http://localhost:3000), try out BibleThoughts (which will bypass the template system because it isn't set up to and never will be) (http://localhost:3000/BibleThoughts), and also try a page that doesn't exist (something like http://localhost:3000/scoutchorton/is/cool) and see in the command line how it processes information.

# Note
This isn't fully completed, but is almost a working model. More functionality like passing variables and custom `<head>` specification can be added, with the variables modeled after Google App Script's templating system [Google App Script Documentation](https://developers.google.com/apps-script/guides/html/templates).
