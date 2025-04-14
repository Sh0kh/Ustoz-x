// MessageComponents.js
import React from "react";
import { makeStyles } from "@mui/styles";
import { deepOrange } from "@mui/material/colors";
import PropTypes from "prop-types"; // Import PropTypes

const useStyles = makeStyles((theme) => ({
  messageRow: {
    display: "flex",
  },
  messageRowRight: {
    display: "flex",
    justifyContent: "flex-end",
  },
  messageBlue: {
    position: "relative",
    marginLeft: "5px",
    marginBottom: "10px",
    padding: "10px 20px",
    backgroundColor: "#f1f1f1",
    color: "#475467",
    width: "250px",
    // height: "50px",
    textAlign: "left",
    font: "400 .9em 'Open Sans', sans-serif",
    border: "1px solid #f1f1f1",
    borderRadius: "10px",
  },
  messageOrange: {
    position: "relative",
    marginRight: "5px",
    marginBottom: "10px",
    padding: "10px 20px",
    backgroundColor: "#2E90FA",
    width: "250px",
    textAlign: "right",
    font: "400 .9em 'Open Sans', sans-serif",
    border: "1px solid #2E90FA",
    color: "#fff",
    borderRadius: "10px",
  },

  messageContent: {
    padding: 0,
    margin: 0,
  },
  messageTimeStampLeft: {
    position: "relative",
    fontSize: ".85em",
    fontWeight: "300",
    marginTop: "10px",
    bottom: "-3px",
    left: "90px",
    padding: "4px",
    fontFamily: "sans-serif",
  },
  messageTimeStampRight: {
    position: "relative",
    fontSize: ".85em",
    fontWeight: "300",
    marginTop: "10px",
    bottom: "-3px",
    right: "90px",
    padding: "4px",
    fontFamily: "sans-serif",
  },

  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  avatarNothing: {
    color: "transparent",
    backgroundColor: "transparent",
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  displayName: {
    marginLeft: "20px",
  },
}));

//avatarが左にあるメッセージ（他人）
export const MessageLeft = ({ message, timestamp }) => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.messageRow}>
        <div>
          <div className={classes.messageBlue}>
            <div>
              <p style={{ fontSize: "16px" }} className={classes.messageContent}>
                {message}
              </p>
            </div>
            <div className={classes.messageTimeStampLeft}>{timestamp}</div>
          </div>
        </div>
      </div>
    </>
  );
};

MessageLeft.propTypes = {
  message: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
};

export const MessageRight = ({ message, timestamp }) => {
  const classes = useStyles();
  return (
    <div className={classes.messageRowRight}>
      <div className={classes.messageOrange}>
        <p style={{ fontSize: "16px" }} className={classes.messageContent}>
          {message}
        </p>
        <div className={classes.messageTimeStampRight}>{timestamp}</div>
      </div>
    </div>
  );
};

MessageRight.propTypes = {
  message: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
};
