// ViewChat.js
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types";
import { Chat, GetAuth } from "yaponuz/data/api";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Card from "@mui/material/Card";
import { Container, List, ListItem, ListItemText, Divider, Box } from "@mui/material";
import { MessageLeft, MessageRight } from "./MessageComponents"; // Importing MessageLeft and MessageRight components
import SoftButton from "components/SoftButton";
import HourglassBottomSharpIcon from "@mui/icons-material/HourglassBottomSharp";

export default function ViewChat({ id, chatid }) {
  // model open and close
  const [chat, setChats] = useState([]);
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState(20);
  const [isMore, setIsMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const getJob = async () => {
      setLoading(true);
      const response = await Chat.getAllMessages(0, size, id);
      console.log(response.object);
      setChats(response.object.content.reverse());
      if (response.object.totalPages > 1) {
        setIsMore(true);
      }
      setLoading(false);
    };

    getJob();
  }, [id, size]);

  const handleMoreMessages = async () => {
    setSize((prevSize) => prevSize + 20); // Increment size by 20
  };

  return (
    <>
      <Tooltip title="Preview" onClick={handleClickOpen} placement="top">
        <Icon>visibility</Icon>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>View Chat</DialogTitle>
        <DialogContent style={{ width: "400px", margin: "10px", minHeight: "400px" }}>
          {chat.map((message) => (
            <>
              {console.log(message.createdBy, chatid)}
              {!(message.createdBy === chatid) ? (
                <MessageRight
                  message={message.text}
                  timestamp={new Date(message.createdAt)
                    .toISOString()
                    .replace(/T/, " ")
                    .replace(/\..+/, "")}
                />
              ) : (
                <MessageLeft
                  message={message.text}
                  timestamp={new Date(message.createdAt)
                    .toISOString()
                    .replace(/T/, " ")
                    .replace(/\..+/, "")}
                />
              )}
            </>
          ))}
          {isMore && (
            <SoftBox
              position="realtive"
              bottom={10}
              left={0}
              right={0}
              height={50}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <SoftButton
                onClick={handleMoreMessages}
                variant="outlined"
                size="small"
                color="primary"
                fullWidth
              >
                More Messages&nbsp;
                {loading && <HourglassBottomSharpIcon />}
              </SoftButton>
            </SoftBox>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

ViewChat.propTypes = {
  id: PropTypes.number.isRequired,
  chatid: PropTypes.number.isRequired,
};
