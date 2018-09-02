function getCanvasSize(defaultWidth, defaultHeight, cellSize) {
    // Calculate the size of the main canvas
    // Returns object with the properties `width` and `height`
    // Canvas dimensions should be evenly divisible by the cell size.
    let width, height;
    height = (defaultHeight % cellSize == 0) ? defaultHeight : defaultHeight - (defaultHeight % cellSize);
    containerW = document.getElementById('canvasContainer').clientWidth;
    width = (defaultWidth % cellSize == 0) ? defaultWidth : defaultWidth - (defaultWidth % cellSize);
    width++; height++;  // Add room for the 1px border around the canvas
    return {width:  width,
            height: height};
}
