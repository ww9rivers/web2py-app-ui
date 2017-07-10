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

var public =			// Public space for c9rjq
{

/**	Generate and return a jqGrid object using given JSON data, generated
 *	by Python object c9r.jquery.Grid().
 *
 * @param	gd	Grid data, with both grid and pager.
 * @return	The jqGrid object created using the given grid and pager data.
 */
grid: function (gd)
{
	gd.grid = $.extend({ id: "#c9r-grid-"+gd.id }, gd.grid);
	gd.pager = $.extend({
		id: "#c9r-pager-"+gd.id,
		edit: {}, add: {}, del: {}, search: {}, view: {}
	}, gd.pager);
	var has_tools = (gd.toolbar != undefined);
	gd.grid.data = $.extend({
		datatype:	"json",
		mtype:		"POST",
		height:		"100%",
		width:		"auto",
		autowidth:	true,
		shrinkToFit:	true,
		scroll:		false,
		pager:		$(gd.pager.id),
		rowNum:		20,
		rowList:	[10, 20, 50, 100, 500],
		sortorder:	"asc",
		viewrecords:	true,
		toolbar:	[ has_tools, "top" ],
		loadError:	function (xhr, st, err) { alert(err); }
	}, gd.grid.data);
	if (gd.grid.data.datatype == "json")
	{
		gd.pager.add = $.extend({ afterSubmit: c9r.grid_json_return }, gd.pager.add);
		gd.pager.edit = $.extend({ afterSubmit: c9r.grid_json_return }, gd.pager.edit);
	}
	if (gd.dnd)
	{
		$(gd.grid.id).tableDnD(gd.dnd);
		gd.grid.data.gridComplete = function()
		{
			$("#_empty",gd.grid.id).addClass("nodrag nodrop");
			$(gd.grid.id).tableDnDUpdate();
		}
	}
	var obj = $(gd.grid.id).jqGrid(gd.grid.data)
		.jqGrid("navGrid", gd.pager.id, gd.pager.data,
			gd.pager.edit, gd.pager.add, gd.pager.del, gd.pager.search, gd.pager.view);
	if (has_tools)
	{
		var toolbar = $.extend({ id: "#t_"+gd.grid.id.substr(1) }, gd.toolbar);
		$(toolbar.id).append(toolbar.html);
		c9r.button_theme(false, toolbar.id);
	}
	if (gd.nav instanceof Array) $.each(gd.nav, function (xi, xb)
	{
		button = { caption: "" };
		if (typeof xb.onClickButton == "string") { xb.onClickButton = c9r[xb.onClickButton]; }
		obj.jqGrid("navButtonAdd", gd.pager.id, $.extend(button, xb));
	});
	return obj;
},


/**	Using the info_dialog() of a grid.
 *
 * @param	dlg
 */
grid_dialog: function (dlg)
{
	if (!c9r.isset(dlg)) return;
	if (c9r.isset(dlg.opts) && c9r.isset(dlg.opts.buttons))
	{
		$.each(dlg.opts.buttons, function (i, btn)
		{
			c9r.fn(btn, "onClick");
		});
	}
	$.jgrid.info_dialog(dlg.caption, dlg.msg, dlg.close, dlg.opts);
	if (c9r.isset(dlg.focus)) $(dlg.focus).focus();
},


grid_json_return: function (dat)
{
	return $.evalJSON(dat.responseText);
},


grid_selected: function (grid)
{
	return grid.getRowData(grid.getGridParam("selrow"));
}

};

return public;
}());
