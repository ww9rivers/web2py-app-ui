/*
 * This program is licensed under the GPL v3.0, which is found at the URL below:
 *	http://opensource.org/licenses/gpl-3.0.html
 */
/* Copyright (c) 2009, 9Rivers.net, LLC
 * All rights reserved.
 */

//	The c9r namespace: depend on jQuery ($ in short).
var c9r = c9r || {};
$.extend(c9r, function ()
{
var pv =			// Private variable space for c9rjq
{
	button_css: "ui-state-default ui-corner-all"
};

var public =
{

button: function (uio)		// c9r.button -- interface to jQuery UI button
{
	return $("#"+uio.id).button(uio);
},


/**	Creat a set of buttons.
 *
 * @param	bset	An associative array of buttons, with key as button name and value as options.
 *		opt	Further options.
 *		ss	Session button set to save the buttons.
 */
button_set: function (bset, opt)
{
	var ss = {};
	$.each(bset, function (id, fset)
	{
		var b = c9r.button(id, c9r.isset(opt) ? opt[id] : {})
			.addClass(pv.button_css);
		ss[id] = b;
		$.each(fset, function (fn, lamda) { b[fn](lamda); });
	});
	return ss;
},


/**	Theme all the buttons.
 *
 * @param	xcss	Extra class for the theme.
 * @param	parent	Parent object to select the buttons.
 */
button_theme: function (xcss, parent)
{
	xcss = (xcss) ? (xcss+" ") : "";
	parent = (parent) ? (parent+" ") : "";
	return $(parent + "button").addClass(xcss+pv.button_css);
},


dialog: function (dlg)
{
},


/**	Initialize a form for the c9r.jquery.Form() Python object.
 *
 */
form: function (input)
{
	$.each(input, function (id, fset)
	{
		var xin = $("#"+id);
		if (xin)
		{
			$.each(fset, function (fn, lambda)
			{
				xin[fn](c9r[lambda]);
			})
		}
	});
},


/**	Open a help window for a given module. The new window will be named with
 *	(mod + "-help"). The URI will be ("?q=help/" + mod).
 *
 * @param	mod		Name of the module.
 * @param	submod		Name of the sub-module (optional).
 */
help: function (mod, submod)
{
	submod = (submod == undefined || submod == null) ? "" : ("/"+submod);
	window.open("?q=help/"+mod+submod, mod+"_help", "scrollbars=1,status=0,toolbar=0,menubar=0,resizable=1,width=1024px,height=600px");
	return false;
},


id: function (id, type)
{
	return (id[0] == "#") ? id : ("#c9r-"+type+"-"+id);
},


ui:		// c9r.ui -- UI components on a page
{

init: function ()
{
	// Initialize UI widgets of various types. Each UI object should be able to initialize itself.
	// c9r._S is the session (page) data and c9r._S.ui is User Interface, which is setup in jquery.py.
	if ("_S" in c9r && "ui" in c9r._S)
	{
		$.each (c9r._S.ui, function (uitype, uis)
		{
			$.each(c9r._S.ui[uitype], function(xi, uio)
			{
				// if (!("id" in uio)) { uio.id = xi; }
				try { c9r[uitype](uio); } catch (ex) {} // Catch and ignore error.
			});
		});
	}

	//	Optional page initialization:
	if ("page_init" in c9r) { c9r.page_init(); }
	c9r.button_theme();
}

} // ui
};

return public;
}());