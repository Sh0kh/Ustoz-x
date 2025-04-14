import React, { useState } from "react";
import PropTypes from "prop-types";
import ImgsViewer from "react-images-viewer";
import Grid from "@mui/material/Grid";

import SoftBox from "components/SoftBox"; // You can import any necessary components

function ImageSlider({ images }) {
  const [currentImage, setCurrentImage] = useState(images[0]);
  const [imgsViewer, setImgsViewer] = useState(false);
  const [imgsViewerCurrent, setImgsViewerCurrent] = useState(0);

  const handleSetCurrentImage = (index) => {
    setCurrentImage(images[index]);
    setImgsViewerCurrent(index);
  };

  const openImgsViewer = () => setImgsViewer(true);
  const closeImgsViewer = () => setImgsViewer(false);
  const imgsViewerNext = () => setImgsViewerCurrent(imgsViewerCurrent + 1);
  const imgsViewerPrev = () => setImgsViewerCurrent(imgsViewerCurrent - 1);

  return (
    <SoftBox>
      <ImgsViewer
        imgs={images.map((image) => ({ src: image }))}
        isOpen={imgsViewer}
        onClose={closeImgsViewer}
        currImg={imgsViewerCurrent}
        onClickPrev={imgsViewerPrev}
        onClickNext={imgsViewerNext}
        backdropCloseable
      />

      <SoftBox
        component="img"
        src={currentImage}
        alt="Select"
        shadow="lg"
        borderRadius="lg"
        width="100%"
        onClick={openImgsViewer}
      />

      <SoftBox m={1} pt={1}>
        <Grid container spacing={3}>
          {images.map((image, index) => (
            <Grid item xs={3} key={index}>
              <SoftBox
                component="img"
                id={index}
                src={image}
                alt={`small image ${index + 1}`}
                borderRadius="md"
                shadow="md"
                width="100%"
                sx={{ cursor: "pointer", height: "100%", objectFit: "cover" }}
                onClick={() => handleSetCurrentImage(index)}
              />
            </Grid>
          ))}
        </Grid>
      </SoftBox>
    </SoftBox>
  );
}

ImageSlider.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ImageSlider;
