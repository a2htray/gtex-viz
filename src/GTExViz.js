/**
 * Copyright © 2015 - 2018 The Broad Institute, Inc. All rights reserved.
 * Licensed under the BSD 3-clause license (https://github.com/broadinstitute/gtex-viz/blob/master/LICENSE.md)
 */

/*
TODO
1. refactoring
 */
'use strict';
import {createSvg, generateRandomMatrix, generateRandomList} from "./modules/utils";
import {range} from "d3-array";
import {randomNormal} from "d3-random";
import Heatmap from "./modules/Heatmap";
import DendroHeatmapConfig from "./modules/DendroHeatmapConfig";
import DendroHeatmap from "./modules/DendroHeatmap";
import GroupedViolin from "./modules/GroupedViolin";
import IsoformTrackViewer from "./modules/IsoformTrackViewer";

export const demoData = {
    heatmap:generateRandomMatrix({x:50, y:10, scaleFactor:1000}),
    dendroHeatmap: {
        rowTree: "(((TP53:0.17,SLK:0.17):1.18,NDRG4:1.34):1.33,ACTN3:2.67);",
        colTree: "(((Adipose Visceral Omentum:0.06,Adipose Subcutaneous:0.06):0.00,Bladder:0.06):0.16,Adrenal Gland:0.22);",
        heatmap: [
    {
      "y": "SLK",
      "value": 35.505,
      "x": "Adipose Subcutaneous",
      "unit": "TPM"
    },
    {
      "y": "SLK",
      "value": 29.28,
      "x": "Adipose Visceral Omentum",
      "unit": "TPM"
    },
    {
      "y": "SLK",
      "value": 17.405,
      "x": "Adrenal Gland",
      "unit": "TPM"
    },
    {
      "y": "SLK",
      "value": 53.29,
      "x": "Bladder",
      "unit": "TPM"
    },
    {
      "y": "NDRG4",
      "value": 12.035,
      "x": "Adipose Subcutaneous",
      "unit": "TPM"
    },
    {
      "y": "NDRG4",
      "value": 6.531000000000001,
      "x": "Adipose Visceral Omentum",
      "unit": "TPM"
    },
    {
      "y": "NDRG4",
      "value": 134.8,
      "x": "Adrenal Gland",
      "unit": "TPM"
    },
    {
      "y": "NDRG4",
      "value": 7.1160000000000005,
      "x": "Bladder",
      "unit": "TPM"
    },
    {
      "y": "TP53",
      "value": 29.935,
      "x": "Adipose Subcutaneous",
      "unit": "TPM"
    },
    {
      "y": "TP53",
      "value": 23.55,
      "x": "Adipose Visceral Omentum",
      "unit": "TPM"
    },
    {
      "y": "TP53",
      "value": 18.515,
      "x": "Adrenal Gland",
      "unit": "TPM"
    },
    {
      "y": "TP53",
      "value": 40.51,
      "x": "Bladder",
      "unit": "TPM"
    },
    {
      "y": "ACTN3",
      "value": 0.33145,
      "x": "Adipose Subcutaneous",
      "unit": "TPM"
    },
    {
      "y": "ACTN3",
      "value": 0.3317,
      "x": "Adipose Visceral Omentum",
      "unit": "TPM"
    },
    {
      "y": "ACTN3",
      "value": 0.100005,
      "x": "Adrenal Gland",
      "unit": "TPM"
    },
    {
      "y": "ACTN3",
      "value": 0.48100000000000004,
      "x": "Bladder",
      "unit": "TPM"
    }
  ]
    },
    groupedViolinPlot: [
        {
           group: "Group 1",
           label: "Gene 1",
           values: range(0, 2000).map(randomNormal(2, 1))
        },
        {
            group: "Group 1",
            label: "Gene 2",
            values: range(0, 2000).map(randomNormal(5, 1))
        },
        {
            group: "Group 1",
            label: "Gene 3",
            values: range(0, 2000).map(randomNormal(10, 1))
        },
        {
           group: "Group 2",
           label: "Gene 1",
           values: range(0, 2000).map(randomNormal(5, 1))
        },
        {
            group: "Group 2",
            label: "Gene 2",
            values: range(0, 2000).map(randomNormal(3, 1))
        },
        {
            group: "Group 2",
            label: "Gene 3",
            values: range(0, 2000).map(randomNormal(1, 1))
        },
        {
           group: "Group 3",
           label: "Gene 1",
           values: range(0, 2000).map(randomNormal(2, 1))
        },
        {
            group: "Group 3",
            label: "Gene 2",
            values: range(0, 2000).map(randomNormal(3, 1))
        },
        {
            group: "Group 3",
            label: "Gene 3",
            values: range(0, 2000).map(randomNormal(5, 1))
        }
    ],
    transcriptTracks: {
        "exons": {
            "ENST00000578419.1": [
                {
                    "chrom": "17",
                    "chromStart": 77071021,
                    "chromEnd": 77071172,
                    "strand": "+",
                    "exonNumber": "1",
                    "exonId": "ENSE00003502032.1"

                },
                {
                    "chrom": "17",
                    "chromEnd": 77073579,
                    "exonId": "ENSE00003672628.1",
                    "exonNumber": "2",
                    "chromStart": 77073512,
                    "strand": "+"
                },
                {
                    "chrom": "17",
                    "chromEnd": 77073946,
                    "exonId": "ENSE00003475281.1",
                    "exonNumber": "3",
                    "chromStart": 77073745,
                    "strand": "+"
                },
                {
                    "chrom": "17",
                    "chromEnd": 77076446,
                    "exonId": "ENSE00003679852.1",
                    "exonNumber": "4",
                    "chromStart": 77076289,
                    "strand": "+"
                },
                {
                    "chrom": "17",
                    "chromEnd": 77077155,
                    "exonId": "ENSE00003583515.1",
                    "exonNumber": "5",
                    "chromStart": 77077007,
                    "strand": "+"
                },
                {
                    "chrom": "17",
                    "chromEnd": 77078631,
                    "exonId": "ENSE00003589230.1",
                    "exonNumber": "6",
                    "chromStart": 77077980,
                    "strand": "+"
                }
            ],
            "ENST00000539857.2": [
                {
                    "chrom": "17",
                    "chromEnd": 77071172,
                    "exonId": "ENSE00003512401.1",
                    "exonNumber": "1",
                    "chromStart": 77071021,
                    "strand": "+"
                },
                {
                    "chrom": "17",
                    "chromEnd": 77073579,
                    "exonId": "ENSE00003623828.1",
                    "exonNumber": "2",
                    "chromStart": 77073512,
                    "strand": "+"
                },
                {
                    "chrom": "17",
                    "chromEnd": 77073946,
                    "exonId": "ENSE00003638693.1",
                    "exonNumber": "3",
                    "chromStart": 77073745,
                    "strand": "+"
                },
                {
                    "chrom": "17",
                    "chromEnd": 77076446,
                    "exonId": "ENSE00003651250.1",
                    "exonNumber": "4",
                    "chromStart": 77076289,
                    "strand": "+"
                },
                {
                    "chrom": "17",
                    "chromEnd": 77077155,
                    "exonId": "ENSE00003607773.1",
                    "exonNumber": "5",
                    "chromStart": 77077007,
                    "strand": "+"
                },
                {
                    "chrom": "17",
                    "chromEnd": 77078631,
                    "exonId": "ENSE00003488117.1",
                    "exonNumber": "6",
                    "chromStart": 77077980,
                    "strand": "+"
                }],
            "ENST00000311595.9": [
                {
                    "chrom": "17",
                    "chromEnd": 77071172,
                    "exonId": "ENSE00002713933.1",
                    "exonNumber": "1",
                    "chromStart": 77071151,
                    "strand": "+"
                },
                {
                    "chrom": "17",
                    "chromEnd": 77073579,
                    "exonId": "ENSE00003672628.1",
                    "exonNumber": "2",
                    "chromStart": 77073512,
                    "strand": "+"
                },
                {
                    "chrom": "17",
                    "chromEnd": 77073946,
                    "exonId": "ENSE00003475281.1",
                    "exonNumber": "3",
                    "chromStart": 77073745,
                    "strand": "+"
                },
                {
                    "chrom": "17",
                    "chromEnd": 77075719,
                    "exonId": "ENSE00001111713.1",
                    "exonNumber": "4",
                    "chromStart": 77075571,
                    "strand": "+"
                },
                {
                    "chrom": "17",
                    "chromEnd": 77076446,
                    "exonId": "ENSE00003651250.1",
                    "exonNumber": "5",
                    "chromStart": 77076289,
                    "strand": "+"
                },
                {
                    "chrom": "17",
                    "chromEnd": 77077155,
                    "exonId": "ENSE00003607773.1",
                    "exonNumber": "6",
                    "chromStart": 77077007,
                    "strand": "+"
                },
                {
                    "chrom": "17",
                    "chromEnd": 77078612,
                    "exonId": "ENSE00002720924.1",
                    "exonNumber": "7",
                    "chromStart": 77077980,
                    "strand": "+"
                }
            ]
        },
        "transcripts": [
            {

                "chromosome": "17",
                "end": 77078631,
                "gencodeId": "ENSG00000167280.12",
                "geneSymbol": "ENGASE",
                "start": 77071021,
                "strand": "+",
                "transcriptId": "ENST00000578419.1"
            },
            {
                "chromosome": "17",
                "end": 77078631,
                "gencodeId": "ENSG00000167280.12",
                "geneSymbol": "ENGASE",
                "start": 77071021,
                "strand": "+",
                "transcriptId": "ENST00000539857.2"
            },
            {
                "chromosome": "17",
                "end": 77078612,
                "gencodeId": "ENSG00000167280.12",
                "geneSymbol": "ENGASE",
                "start": 77071151,
                "strand": "+",
                "transcriptId": "ENST00000311595.9"
            }
        ]
    }
};

const transcriptTracksConfig = {
    id: 'gtexTranscriptTracks',
    data: demoData.transcriptTracks,
    width: 1200,
    height: 80,
    marginLeft: 100,
    marginRight: 20,
    marginTop: 0,
    marginBottom: 20,
    labelPos: 'left'
};

export function transcriptTracks(par=transcriptTracksConfig){
    let margin = {
        top: par.marginTop,
        right: par.marginRight,
        bottom: par.marginBottom,
        left: par.marginLeft
    };
    let inWidth = par.width - (par.marginLeft + par.marginRight);
    let inHeight = par.height - (par.marginTop + par.marginBottom);

    // test input params
    if ($(`#${par.id}`).length == 0) {
        let error = `Input Error: DOM ID ${par.id} is not found.`;
        alert(error);
        throw error;
    }

    // create the SVG
        let svg = createSvg(par.id, par.width, par.height, margin);

    // render the transcripts
    let tooltipId = `${par.id}Tooltip`;
    let config = {
        x: 0,
        y: 0,
        w: inWidth,
        h: inHeight,
        labelOn: par.labelPos
    };
    let viewer = new IsoformTrackViewer(par.data.transcripts, par.data.exons, par.data.exons["ENST00000578419.1"], config);
    viewer.render(false, svg, par.labelPos);

}

const heatmapDemoConfig = {
    id: 'gtexVizHeatmap',
    data: demoData.heatmap,
    width: 1200, // outer width
    height: 300, // outer height
    marginLeft: 20,
    marginRight: 40,
    marginTop: 50,
    marginBottom: 50,
    colorScheme: "YlGnBu",
    cornerRadius: 2,
    columnLabelHeight: 20,
    columnLabelAngle: 60,
    columnLabelPosAdjust: 10,
    rowLabelWidth: 100,
    legendSpace: 50,
    useLog: true,
    logBase: 10
};

/**
 * Render a 2D Heatmap
 * @param params
 */
export function heatmap(par=heatmapDemoConfig){
    let margin = {
        top: par.marginTop,
        right: par.marginRight,
        bottom: par.marginBottom,
        left: par.marginLeft
    };
    let inWidth = par.width - (par.marginLeft + par.marginRight + par.rowLabelWidth);
    let inHeight = par.height - (par.marginTop + par.marginBottom + par.columnLabelHeight);

    // test input params
    if ($(`#${par.id}`).length == 0) {
        let error = `Input Error: DOM ID ${par.id} is not found.`;
        alert(error);
        throw error;
    }

    // create the SVG
    let svg = createSvg(par.id, par.width, par.height, margin);

    // render the heatmap
    let tooltipId = `${par.id}Tooltip`;
    let h = new Heatmap(par.data, par.useLog, par.logBase, par.colorScheme, par.cornerRadius, tooltipId);
    h.draw(svg, {w:inWidth, h:inHeight}, par.columnLabelAngle, false, par.columnLabelPosAdjust);
    h.drawColorLegend(svg, {x:20, y: -20}, 10);
}

const dendroHeatmapDemoConfig = {
    id: 'gtexVizDendroHeatmap',
    data: demoData.dendroHeatmap,
    useLog: true,
    logBase: 10,
    width: 600, // outer width
    height: 300, // outer height
    marginLeft: 20,
    marginRight: 40,
    marginTop: 50,
    marginBottom: 50,
    rowTreePanelWidth: 100,
    colTreePanelHeight: 100,
    colorScheme: "Blues",
    cornerRadius: 2,
    columnLabelHeight: 200,
    columnLabelAngle: 60,
    columnLabelPosAdjust: 10,
    rowLabelWidth: 200,
    legendSpace: 50
};

/**
 * Render a DendroHeatmap
 * @param par
 */
export function dendroHeatmap(par=dendroHeatmapDemoConfig){
    let margin = {
        top: par.marginTop,
        right: par.marginRight + par.rowLabelWidth,
        bottom: par.marginBottom + par.columnLabelHeight,
        left: par.marginLeft
    };

    // test input params
    if ($(`#${par.id}`).length == 0) {
        let error = `Input Error: DOM ID ${par.id} is not found.`;
        alert(error);
        throw error;
    }

    let inWidth = par.width - (par.marginLeft + par.marginRight + par.rowLabelWidth);
    let inHeight = par.height - (par.marginTop + par.marginBottom + par.columnLabelHeight);

    let svgId = `${par.id}Svg`;
    let tooltipId = `${par.id}Tooltip`;
    let dmapConfig = new DendroHeatmapConfig(par.width, par.rowTreePanelWidth, par.colTreePanelHeight, margin);
    let dmap = new DendroHeatmap(par.data.colTree, par.data.rowTree, par.data.heatmap, par.colorScheme, par.cornerRadius, dmapConfig, tooltipId, par.useLog, par.logBase)
    let showColTree = par.data.colTree !== undefined;
    let showRowTree = par.data.rowTree !== undefined;
    dmap.render(par.id, svgId, showColTree, showRowTree, "top", 8);
}

const violinDemoConfig = {
    id: 'gtexGroupedViolinPlot',
    data: demoData.groupedViolinPlot,
    width: 500,
    height: 300,
    marginLeft: 100,
    marginRight: 20,
    marginTop: 50,
    marginBottom: 100,
    showDivider: true,
    xPadding: 0.3,
    yLabel: "Random Value",
    showGroupX: true,
    showX: true,
    xAngle: 0,
    showWhisker: false,
    showLegend: false,
    showSampleSize: true
};
export function groupedViolinPlot(par=violinDemoConfig){
    console.log(par.data);
    let margin = {
        top: par.marginTop,
        right: par.marginRight,
        bottom: par.marginBottom,
        left: par.marginLeft
    };
    // test input params
    if ($(`#${par.id}`).length == 0) {
        let error = `Input Error: DOM ID ${par.id} is not found.`;
        alert(error);
        throw error;
    }

    let inWidth = par.width - (par.marginLeft + par.marginRight);
    let inHeight = par.height - (par.marginTop + par.marginBottom);

    let svgId = `${par.id}Svg`;
    let tooltipId = `${par.id}Tooltip`;

    // create the SVG
    let svg = createSvg(par.id, par.width, par.height, margin);

    const gViolin = new GroupedViolin(par.data);
    gViolin.render(svg, inWidth, inHeight, par.xPadding, undefined, [], par.yLabel, par.showGroupX, par.ShowX, par.xAngle, par.showWhisker, par.showDivider, par.showLegend);
    const tooltip = gViolin.createTooltip(tooltipId);


}
