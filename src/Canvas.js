import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import "./Canvas.css";

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#f0f0f0",
    });
    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const imgElement = new Image();
      imgElement.src = e.target.result;

      imgElement.onload = () => {
        const imgInstance = new fabric.Image(imgElement, {
          selectable: true,
          hasControls: true,
          objectCaching: false,
        });

        imgInstance.scaleToWidth(fabricCanvas.width);
        imgInstance.scaleToHeight(fabricCanvas.height);

        fabricCanvas.add(imgInstance);
        fabricCanvas.setActiveObject(imgInstance);
        fabricCanvas.renderAll();
      };
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const enableDrawing = () => {
    fabricCanvas.isDrawingMode = true;
    fabricCanvas.freeDrawingBrush.color = "red";
    fabricCanvas.freeDrawingBrush.width = 5;
  };

  const applyFilter = (filterType) => {
    const activeObject = fabricCanvas.getActiveObject();

    if (activeObject && activeObject.type === "image") {
      let filter;
      switch (filterType) {
        case "grayscale":
          filter = new fabric.Image.filters.Grayscale();
          break;
        case "sepia":
          filter = new fabric.Image.filters.Sepia();
          break;
        case "invert":
          filter = new fabric.Image.filters.Invert();
          break;
        default:
          break;
      }

      if (filter) {
        activeObject.filters.push(filter);
        activeObject.applyFilters();
        fabricCanvas.renderAll();
      }
    } else {
      alert("Please select an image to apply a filter.");
    }
  };

  return (
    <div className="canvas-container">
      <h1 className="canvas-title">Fabric.js Canvas Example</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="upload-button"
      />
      <div className="button-container">
        <button onClick={enableDrawing} className="canvas-button">
          Enable Drawing
        </button>
        <button
          onClick={() => applyFilter("grayscale")}
          className="canvas-button"
        >
          Grayscale Filter
        </button>
        <button onClick={() => applyFilter("sepia")} className="canvas-button">
          Sepia Filter
        </button>
        <button onClick={() => applyFilter("invert")} className="canvas-button">
          Invert Colors
        </button>
      </div>
      <canvas ref={canvasRef} className="fabric-canvas" />
    </div>
  );
};

export default CanvasComponent;
