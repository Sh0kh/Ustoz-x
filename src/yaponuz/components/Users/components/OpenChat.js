import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect } from "react";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types"; // Import PropTypes
import SoftInput from "components/SoftInput";
import { Chat, GetAuth } from "yaponuz/data/api";
import Swal from "sweetalert2";
import { MessageLeft, MessageRight } from "./MessageComponents"; // Importing MessageLeft and MessageRight components
import SoftButton from "components/SoftButton";

export default function OpenChat({ id, userData }) {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState(0);
  const [adminId, setAdminId] = useState(0);
  const [chat, setChats] = useState([]);
  const [text, setText] = useState("");
  const [chatId, setChatId] = useState(0);
  const [countSend, setCountSend] = useState(0);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    setUserId(id);
  }, [id]);

  useEffect(() => {
    const getJob = async () => {
      const adminme = await GetAuth.getUserId();
      setAdminId(adminme);
      console.log(adminId);
      const response = await Chat.getMessages(adminId, userId);
      console.log(response);
      if (response.object.messages) {
        setChatId(response.object.chat.id);
        setChats(response.object.messages.content.reverse());
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
      } else {
        setChatId(0);
        setChats([]);
      }
    };

    getJob();
  }, [userId, userData]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const my = { margin: "5px 0px" };

  const showAlert = (response) => {
    function reload() {
      window.location.reload();
    }
    if (response.success) {
      Swal.fire("sended!", response.message, "success").then(() => reload());
    } else {
      Swal.fire("error", response.message || response.error, "error").then(() => reload());
    }
  };

  const handleSend = async () => {
    var data;
    if (chatId !== 0) {
      var data = {
        chatId,
        text: text,
        userOne: adminId,
        userTwo: userId,
      };
    } else {
      var data = {
        text: text,
        userOne: adminId,
        userTwo: userId,
      };
    }

    try {
      setLoading(true);
      const response = await Chat.addMessage(data);
      if (response.success) {
        setCountSend((prevCount) => prevCount + 1);
        setText("");
      }
      setLoading(false);
    } catch (err) {
      console.log("error from user chatting with admin", err);
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Open Chat" onClick={handleClickOpen} placement="top">
        <Icon>chat</Icon>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {firstName ? firstName : "User"} {lastName ?? ""} - {userId}
        </DialogTitle>
        <DialogContent style={{ width: "400px", margin: "10px", minHeight: "400px" }}>
          {chat &&
            chat.map((message) => (
              <>
                {message.createdBy === 2 ? (
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
        </DialogContent>
        <DialogActions>
          <SoftInput
            onChange={(e) => setText(e.target.value)}
            value={text}
            placeholder="Your Message Here..."
            size=""
            fullWidth
          />
          <SoftButton
            variant="contained"
            color="info"
            size="medium"
            style={{ margin: "0px 10px" }}
            onClick={handleSend}
          >
            {loading ? "sending..." : <Icon>send</Icon>}
          </SoftButton>

          {/* <Button onClick={handleClose}>Cancel</Button> */}
          {/* <Button onClick={handleSend}>SEND MESSAGE</Button> */}
        </DialogActions>
      </Dialog>
    </>
  );
}

OpenChat.propTypes = {
  id: PropTypes.number.isRequired,
  userData: PropTypes.object,
};
