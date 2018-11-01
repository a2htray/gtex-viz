/**
 * Copyright © 2015 - 2018 The Broad Institute, Inc. All rights reserved.
 * Licensed under the BSD 3-clause license (https://github.com/broadinstitute/gtex-viz/blob/master/LICENSE.md)
 */
'use strict';

import {json} from 'd3-fetch';
import {median} from 'd3-array';
import {select, selectAll} from 'd3-selection';
import {getGtexUrls, parseTissues, parseTissueSites} from './modules/gtexDataParser';
import {createTissueGroupMenu, parseTissueGroupMenu} from './modules/gtexMenuBuilder';
import GroupedViolin from './modules/GroupedViolin';

export function launch(rootId, tooltipRootId, gencodeId, differentiated=false, urls=getGtexUrls()) {
    const promises = [
        json(urls.tissue),
        differentiated?json(`${urls.geneExp}${gencodeId}&attributeSubset=sex`):json(urls.geneExp+gencodeId)
    ];

    const ids = {
        root: rootId,
        svg: `${rootId}-svg`,
        tooltip: tooltipRootId,
        toolbar: `${rootId}-toolbar`,
        clone: `${rootId}-svg-clone`, // for user download
        buttons: {
            download: `${rootId}-svg-download`,
            plotOptions: `${rootId}-svg-option-modal`,
            filter: `${rootId}-svg-filter`,
            // modal buttons
            ascAlphaSort: `${rootId}-svg-asc-alphasort`,
            descAlphaSort: `${rootId}-svg-desc-alphasort`,
            ascSort: `${rootId}-svg-asc-sort`,
            descSort: `${rootId}-svg-desc-sort`,
            logScale: `${rootId}-svg-log-scale`,
            linearScale: `${rootId}-svg-linear-scale`,
            noDiff: `${rootId}-svg-no-diff`,
            sexDiff: `${rootId}-svg-sex-diff`
        },
        plotOptionsModal: 'gene-expr-vplot-option-modal',
        plotOptionGroups: {
            scale: `${rootId}-svg-option-scale`,
            sort: `${rootId}-svg-option-sort`,
            differentiation: `${rootId}-svg-option-differentiation`
        },
        plotSorts: {
            ascAlphaSort: 'asc-alphasort',
            descAlphaSort: 'desc-alphasort',
            ascSort: 'asc-sort',
            descSort: 'desc-sort'
        },
        tissueFilter: 'gene-expr-vplot-filter-modal'

    };
                                        // top, right, bottom, left
    const margin = _setViolinPlotMargins(35, 75, 250, 60);
                                        // height, width, margins
    const dim = _setViolinPlotDimensions(1200, 250, margin);

    if ($(`#${ids.root}`).length == 0) throw 'Violin Plot Error: rootId does not exist.';
    // create DOM components if not already present
    if ($(`#${ids.tooltip}`).length == 0) $('<div/>').attr('id', ids.tooltip).appendTo($(`#${ids.root}`));
    if ($(`#${ids.toolbar}`).length == 0) $('<div/>').attr('id', ids.toolbar).appendTo($(`#${ids.root}`));
    if ($(`#${ids.clone}`).length == 0) $('<div/>').attr('id', ids.clone).appendTo($(`#${ids.root}`));


    let svg = select(`#${ids.root}`)
                .append('svg')
                .attr('id', ids.svg)
                .attr('width', dim.outerWidth)
                .attr('height', dim.outerHeight)
                .append('g')
                    .attr('transform', `translate(${margin.left}, ${margin.top})`);


    Promise.all(promises)
        .then(function(args) {
            const tissues = parseTissues(args[0]);
            const tissueIdNameMap = {};
            const tissueIdColorMap = {};
            const tissueDict = {};
            tissues.forEach(x => {
                tissueIdNameMap[x.tissueSiteDetailId] = x.tissueSiteDetail;
                tissueIdColorMap[x.tissueSiteDetailId] = x.colorHex;
                tissueDict[x.tissueSiteDetailId] = x;
            });

            // TEMPORARY HACK
            tissueIdColorMap.female='ff9f42';
            tissueIdColorMap.male='3399cc';
            // tissueIdColorMap.female='c36188';
            // tissueIdColorMap.female='db7ed6';
            const violinPlotData = _parseGeneExpressionForViolin(args[1], tissueIdNameMap, tissueIdColorMap);
            const tissueGroups = violinPlotData.map(d => d.group);
            let violinPlot = new GroupedViolin(violinPlotData);
            // alphabetically sort by default
            violinPlot.data.sort((a,b) => {
                if (a.group < b.group) return -1;
                else if (a.group > b.group) return 1;
                else return 0;
            });
            let tooltip = violinPlot.createTooltip(ids.tooltip);

            // adding property to keep track of sorting and filtering specifically for this plot
            violinPlot.genePlotSort = ids.plotSorts.ascAlphaSort;
            violinPlot.allData = violinPlot.data.map(d=>d);
            violinPlot.gencodeId = gencodeId;

            let width = dim.width;
            let height = dim.height;
            let xPadding = 0.1;
            let xDomain = violinPlot.data.map(d => d.group);
            let yDomain =[];
            let yLabel = 'log10(TPM)';
            let showX = true;
            let showSubX = false;
            let subXAngle = 0;
            let showWhisker = false;
            let showDivider = false;
            let showLegend = false;
            let showSize = false;
            let sortSubX = true;

            violinPlot.render(svg, width, height, xPadding, xDomain, yDomain, yLabel, showX, showSubX, subXAngle, showWhisker, showDivider, showLegend, showSize, sortSubX);
            _populateTissueFilter(violinPlot, ids.tissueFilter, ids, args[0]);
            _addToolbar(violinPlot, tooltip, ids);
            // _addViolinTissueColorBand(violinPlot, svg, tissues, "bottom");
        });
}


function _clear(domId) {
    $(`#${domId}`).empty();
}

/**
 * Set the margins of the violin plot
 * @param top {Integer}
 * @param right {Integer}
 * @param bottom {integer}
 * @param left {Integer}
 * @returns {{top: number, right: number, bottom: number, left: number}}
 * @private
 */
function _setViolinPlotMargins(top=50, right=50, bottom=50, left=50){
    return {
        top: top,
        right: right,
        bottom: bottom,
        left: left
    };
}

/**
 * Set the dimensions of the violin plot
 * @param width {Integer}
 * @param height {Integer}
 * @param margin {Object} with attr: top, right, bottom, left
 * @returns {{width: number, height: number, outerWidth: number, outerHeight: number}}
 * @private
 */
function _setViolinPlotDimensions(width=1200, height=250, margin=_setViolinPlotMargins()){
    return {
        width: width,
        height: height,
        outerWidth: width + (margin.left + margin.right),
        outerHeight: height + (margin.top + margin.bottom)
    }
}

function _addToolbar(vplot, tooltip, ids) {
    let toolbar = vplot.createToolbar(ids.toolbar, tooltip);
    toolbar.createDownloadSvgButton(ids.buttons.download, ids.svg, 'gtex-violin-plot.svg', ids.clone);

    // plot options modal
    toolbar.createButton(ids.buttons.plotOptions, 'fa-sliders-h');
    let plotOptionsButton = select(`#${ids.buttons.plotOptions}`)
        .on('mouseover', ()=>{toolbar.tooltip.show('Plot Options');})
        .on('mouseout', ()=>{toolbar.tooltip.hide();});
    plotOptionsButton.on('click', (d, i, nodes)=>{
        $(`#${ids.plotOptionsModal}`).modal('show');
    });

    // plot defaults
    // ascending alphabetical sort
    select(`#${ids.buttons.ascAlphaSort}`)
        .classed('active', true);
    // log scale
    select(`#${ids.buttons.logScale}`)
        .classed('active', true);
    // differentation
    select(`#${ids.buttons.noDiff}`)
        .classed('active', true);

    // filter
    toolbar.createButton(ids.buttons.filter, 'fa-filter');
    let tissueFilterButton = select(`#${ids.buttons.filter}`)
        .on('mouseover', ()=>{toolbar.tooltip.show('Filter Tissues');})
        .on('mouseout', ()=>{toolbar.tooltip.hide();});


    // sort changing events
    $(`#${ids.plotOptionGroups.sort} button`).on('click', (e)=>{
        vplot.genePlotSort = e.target.id.replace(`${ids.svg}-`, '');
        selectAll(`#${ids.plotOptionGroups.sort} button`).classed('active', false);
        select(`button#${e.target.id}`).classed('active', true);
        _sortAndUpdateData(vplot, ids);
    });

    // scale changing events
    $(`#${ids.plotOptionGroups.scale} button`).on('click', (e)=>{
        selectAll(`#${ids.plotOptionGroups.scale} button`).classed('active', false);
        select(`button#${e.target.id}`).classed('active', true);
        if (e.target.id == ids.buttons.logScale) {
            _calcViolinPlotValues(vplot.data, true);
            _calcViolinPlotValues(vplot.allData, true);
            vplot.updateYScale('log10(TPM)');
        } else {
            _calcViolinPlotValues(vplot.data, false);
            _calcViolinPlotValues(vplot.allData, false);
            vplot.updateYScale('TPM');
        }
    });

    // differentiation changing events
    $(`#${ids.plotOptionGroups.differentiation} button`).on('click', (e)=>{
        selectAll(`#${ids.plotOptionGroups.differentiation} button`).classed('active', false);
        select(`button#${e.target.id}`).classed('active', true);

        if (e.target.id == ids.buttons.sexDiff) {
            _clear(ids.root);
            launch(ids.root, ids.tooltip, vplot.gencodeId, true);
        } else {
            _clear(ids.root);
            launch(ids.root, ids.tooltip, vplot.gencodeId, false);
        }
    });

    tissueFilterButton.on('click', (d, i, nodes)=>{
        $('#gene-expr-vplot-filter-modal').modal('show');
    });

}

function _calcViolinPlotValues(data, useLog=true) {
    data.forEach((d)=>{
        d.values = useLog?d.data.map((dd)=>{return Math.log10(+dd+1)}):d.data;
        d.median = useLog?Math.log(median(d.data)+1):median(d.data);
    });
}

/**
 * parse the expression data of a gene for a grouped violin plot
 * @param data {JSON} from GTEx gene expression web service
 * @param colors {Dictionary} the violin color for genes
 * @param IdNameMap {Dictionary} mapping of tissueIds to tissue names
 */
function _parseGeneExpressionForViolin(data, idNameMap=undefined, colors=undefined, useLog=true){
    const attr = 'geneExpression';
    if(!data.hasOwnProperty(attr)) throw 'Parse Error: required json attribute is missing: ' + attr;
    data[attr].forEach((d)=>{
        ['data', 'tissueSiteDetailId', 'geneSymbol', 'gencodeId'].forEach((k)=>{
            if(!d.hasOwnProperty(k)){
                console.error(d);
                throw 'Parse Error: required json attribute is missing: ' + k;
            }
        });
        d.group = idNameMap===undefined?d.tissueSiteDetailId:idNameMap[d.tissueSiteDetailId];
        d.label = d.subsetGroup===undefined?d.geneSymbol:d.subsetGroup;
        d.color = colors===undefined?'#90c1c1':d.subsetGroup===undefined?colors[d.tissueSiteDetailId]:colors[d.subsetGroup];
        // d.color = colors===undefined?'#90c1c1':colors[d.tissueSiteDetailId];
    });
    _calcViolinPlotValues(data[attr], useLog);
    return data[attr];
}

function _populateTissueFilter(vplot, domId, ids, tissues) {
    const tissueGroups = parseTissueSites(tissues);
    createTissueGroupMenu(tissueGroups, `${domId}-body`, false, true, 3);
    _addTissueFilterEvent(vplot, domId, ids, tissueGroups);
}

function _addTissueFilterEvent(vplot, domId, ids, tissues) {
    $(`#${domId}`).on('hidden.bs.modal', (e) => {
        let currSort = vplot.genePlotSort;

        let checkedTissues = parseTissueGroupMenu(tissues, `${domId}-body`, true);
        _filterTissues(vplot, ids, checkedTissues);
    });
}

function _sortAndUpdateData(vplot, ids) {
    switch (vplot.genePlotSort) {
        case ids.plotSorts.ascAlphaSort:
            vplot.data.sort((a,b) => {
                if (a.group < b.group) return -1;
                else if (a.group > b.group) return 1;
                else return 0;
            });
            break;
        case ids.plotSorts.descAlphaSort:
            vplot.data.sort((a,b) => {
                if (a.group < b.group) return 1;
                else if (a.group > b.group) return -1;
                else return 0;
            });
            break;
        case ids.plotSorts.ascSort:
            vplot.data.sort((a,b) => { return b.median - a.median; });
            break;
        case ids.plotSorts.descSort:
            vplot.data.sort((a,b) => { return a.median - b.median; });
            break;
        default:
    }

    let xDomain = vplot.data.map((d) => d.group);
    vplot.updateXScale(xDomain);
}

function _filterTissues(vplot, ids, tissues) {
    let filteredData = vplot.allData.filter(x => tissues.includes(x.group));
    vplot.data = filteredData;
    _sortAndUpdateData(vplot, ids);
}

function _addViolinTissueColorBand(plot, dom, tissueDict, loc="top"){
    console.log(tissueDict);
     ///// add tissue colors
    const tissueG = dom.append("g");

    tissueG.selectAll(".tcolor").data(plot.scale.x.domain())
        .enter()
        .append("rect")
        .classed("tcolor", true)
        .attr("x", (g)=>plot.scale.x(g) )
        .attr("y", (g)=>loc=="top"?plot.scale.y.range()[1]-5:plot.scale.y.range()[0]-5)
        .attr("width", (g)=>plot.scale.x.bandwidth())
        .attr("height", 5)
        .style("stroke-width", 0)
        .style("fill", (g)=>`#${tissueDict[g].colorHex}`)
        .style("opacity", 0.7);
}
