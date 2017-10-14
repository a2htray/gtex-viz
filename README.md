# ExpressMap: A D3-based Gene Expression Heatmap

## To run ExpressMap locally
- You need to have internet access. 
- In the repo's root directory, start the Python HTTP server:

```python python/runServer.py```

Then, you will be able to see the demo in a web browser at: 

```localhost:8000```

- You can also choose a different host name and port to run the demo:

```python python/runServer.py <hostname:port>```

## Test data 
- GTEx data: The top 100 expressed genes in blood. 
- Pre-computed gene and tissue dendrograms generated by python/cluster.py, which computes euclidean distance and uses the single-linkage clustering method.

## UI features
### Toolbar
- Tissue columns can be sorted alphabetically.

### Heatmap 
#### Gene label 
- **Click** shows the gene's detailed expression boxplot.
- **Alt-Click** adds the gene to the existing boxplot.
#### Cell
- **Mouseover** reports the underlying expresion data in the tooltip.

### Dendrogram
#### Internal node:
- **Mouseover** reports the leaf nodes in the tooltip.



