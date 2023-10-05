import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Carousel.scss";

function Carousel() {
  const [slides, setSlides] = useState([
    {
      id: "slide-1",
      inputText: "",
      textareaText: "",
      image: null,
      imageAdded: false,
    },
  ]);
  const [curPosition, setCurPosition] = useState(0);
  const inputRef = useRef(null);
  const [slideAdded, setSlideAdded] = useState(false);

  const addSlide = () => {
    const isDataFilled = slides.every(
      (slide) =>
        slide.inputText.trim() !== "" && slide.textareaText.trim() !== ""
    );

    if (!isDataFilled) {
      window.alert("Please fill in all the fields before adding a new slide.");
      return;
    }

    setSlides((prevSlides) => {
      const newSlide = {
        id: `slide-${prevSlides.length + 1}`,
        inputText: "",
        textareaText: "",
        image: null,
        imageAdded: false,
      };

      const updatedSlides = [...prevSlides, newSlide];
      setCurPosition(updatedSlides.length - 1);
      setSlideAdded(true);

      return updatedSlides;
    });
  };

  useEffect(() => {
    if (slideAdded) {
      window.alert("Slide Added!");
      setSlideAdded(false);
    }
  }, [slideAdded]);

  const deleteSlide = (index) => {
    setSlides((prevSlides) => {
      const newSlides = [...prevSlides];
      newSlides.splice(index, 1);

      if (index === curPosition && index > 0) {
        setCurPosition(index - 1);
      } else if (index === curPosition && index === 0 && newSlides.length > 0) {
        setCurPosition(0);
      }

      return newSlides;
    });
  };

  const handleSlideChange = (index, event) => {
    const { name, value } = event.target;
    setSlides((prevSlides) => {
      const newSlides = [...prevSlides];
      newSlides[index][name] = value;
      return newSlides;
    });
  };

  const handleImageChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        setSlides((prevSlides) => {
          const newSlides = [...prevSlides];
          newSlides[index].image = reader.result;
          newSlides[index].imageAdded = true;
          return newSlides;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLeftButtonClick = () => {
    if (curPosition > 0) {
      setCurPosition((prevPosition) => prevPosition - 1);
    } else {
      setCurPosition(slides.length - 1);
    }
  };

  const handleRightButtonClick = () => {
    if (curPosition < slides.length - 1) {
      setCurPosition((prevPosition) => prevPosition + 1);
    } else {
      setCurPosition(0);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const isDataFilled = slides.every(
      (slide) =>
        slide.inputText.trim() !== "" && slide.textareaText.trim() !== ""
    );

    if (isDataFilled) {
      const { inputText, textareaText } = slides[curPosition];

      try {
        await axios.post("/save-carousel-data", {
          heading: inputText,
          paragraph: textareaText,
        });

        window.alert("Form submitted and data saved!");
      } catch (error) {
        console.error("Error saving carousel data:", error);
        window.alert("Failed to save data. Please try again later.");
      }
    } else {
      window.alert("Please fill in all the fields before submitting the form.");
    }
  };

  const saveData = () => {
    const isDataFilled = slides.every(
      (slide) =>
        slide.inputText.trim() !== "" && slide.textareaText.trim() !== ""
    );

    if (isDataFilled) {
      window.alert("Form submitted!");
    } else {
      window.alert("Please fill in the data!");
    }
  };

  const handleEditClick = (index) => {
    setSlides((prevSlides) => {
      const newSlides = [...prevSlides];
      newSlides[index].editable = true;
      return newSlides;
    });
    inputRef.current.focus();
  };

  return (
    <>
      <div className="canvas">
        <div className="containeeer" id="containeeer">
          {curPosition !== 0 && (
            <div
              title="Go Left"
              className="bttnn left-bttn"
              onClick={handleLeftButtonClick}
            >
              <i className="fas fa-angle-left"></i>
            </div>
          )}
          <div id="carousel-content">
            {slides.map((slide, index) => (
              <div
                className={`slide ${index === curPosition ? "" : "hidden"}`}
                key={slide.id}
              >
                <div title={"Slide " + (index + 1)} className="slide-number">
                  {index + 1}
                </div>
                <div className="carousel-content">
                  <div className="slide-content">
                    <form action="/" onSubmit={handleFormSubmit}>
                      <div className="handle">
                        <input
                          ref={index === curPosition ? inputRef : null}
                          className="someText"
                          name="inputText"
                          value={slide.inputText}
                          placeholder="Add Heading +"
                          disabled={!slide.editable}
                          onChange={(e) => handleSlideChange(index, e)}
                          style={{
                            outline: "none",
                            border: "none",
                            WebkitBorderRadius: "5px",
                            WebkitBoxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
                            WebkitPaddingStart: "10px",
                            borderRadius: "5px",
                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
                            padding: "10px",
                            background: "none",
                            width: "580px",
                          }}
                          formMethod="post"
                        />
                        <textarea
                          cols="40"
                          rows="10"
                          className="para-3"
                          name="textareaText"
                          value={slide.textareaText}
                          placeholder="Add some text +"
                          disabled={!slide.editable}
                          onChange={(e) => handleSlideChange(index, e)}
                        ></textarea>
                      </div>
                    </form>
                    <i
                      title="Edit Form"
                      id="edit-icon"
                      class="fa-solid fa-pen-to-square"
                      onClick={() => handleEditClick(index)}
                    ></i>
                    {index > 0 && (
                      <i
                        title="Delete this Slide?"
                        id="delete-icon"
                        class="fa-solid fa-trash"
                        aria-disabled="true"
                        onClick={() => deleteSlide(index)}
                      ></i>
                    )}
                    <button
                      title="Save"
                      className="save"
                      onClick={(event) => {
                        handleFormSubmit(event);
                      }}
                    >
                      Save
                    </button>
                  </div>

                  <div className="carousel-image">
                    {!slide.imageAdded ? (
                      <input
                        className="add-img"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(index, e)}
                        style={{
                          border: "none",
                          outline: "none",
                          WebkitBorderRadius: "5px",
                          WebkitBoxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
                          WebkitPaddingStart: "10px",
                          borderRadius: "5px",
                          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
                          padding: "10px",
                          fontFamily: "Arial, sans-serif",
                          fontSize: "14px",
                          backgroundColor: "none",
                          background: "none",
                          color: "black",
                        }}
                      />
                    ) : null}
                    <img
                      id={`${slide.id}-image`}
                      src={slide.image || "#"}
                      alt={`Slide ${index + 1} Content`}
                      style={{
                        display:
                          !slide.image || index !== curPosition
                            ? "none"
                            : "block",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          title="Go Right"
          className="bttnn right-bttn"
          onClick={handleRightButtonClick}
        >
          <i className="fas fa-angle-right"></i>
        </div>
        <div title="Add new Slide" id="add-carousel" onClick={addSlide}>
          <i title="Add new Slide" className="fas fa-plus"></i>
        </div>
      </div>
    </>
  );
}

export default Carousel;
