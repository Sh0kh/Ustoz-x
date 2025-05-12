// react-router-dom components
import { useNavigate, useParams } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { Avatar, Divider, IconButton, Paper, Tooltip } from "@mui/material";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftBadge from "components/SoftBadge";

// Soft UI Dashboard PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Icons
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImageIcon from '@mui/icons-material/Image';

// Imported
import { useEffect, useState, useRef } from "react";
import { Chat } from "yaponuz/data/api";
import { Users } from "yaponuz/data/api";
import { FileController } from "yaponuz/data/api";
import Swal from "sweetalert2"; // Added this import which was missing

export default function ChatInfo() {
    const { StundetID, CreatorID } = useParams();
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(30);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState("");
    const [sendingMessage, setSendingMessage] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const [userData, setUserData] = useState();
    const currentUserId = parseInt(localStorage.getItem('userId')); // Get user ID from localStorage
    const [fileInfo, setFileInfo] = useState(null); // Store uploaded file info
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const isToday = date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();

        const isYesterday = date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear();

        if (isToday) {
            return `Today at ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
        } else if (isYesterday) {
            return `Yesterday at ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
        } else {
            return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
        }
    };

    const getOneUser = async () => {
        try {
            const response = await Users.getOneUser(StundetID);
            setUserData(response?.object)
        } catch (err) {
            console.log("Error from groups list GET: ", err);
        }
    };

    useEffect(() => {
        getOneUser()
    }, [StundetID, CreatorID])

    const uploadHandle = async (file, category) => {
        const loadingSwal = Swal.fire({
            title: "Uploading...",
            text: "Please Wait!",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            const response = await FileController.uploadFile(
                file,
                category,
                localStorage.getItem("userId")
            );
            loadingSwal.close();
            setFileInfo(response.object);
            if (response.success) {
                Swal.fire({
                    title: "Uploaded",
                    text: response.message,
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
                return response;
            } else {
                Swal.fire("Error", response.message || response.error, "error");
                return null;
            }
        } catch (err) {
            loadingSwal.close();
            console.error("Error uploading file:", err.response || err);
            Swal.fire("Upload Failed", err.response?.data?.message || err.message, "error");
            return null;
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Create preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }

        setSelectedFile(file);

        // Upload the file and store file info
        const response = await uploadHandle(file, "education_icon");
        if (response && response.success) {
            setFileInfo(response.object);
        }
    };

    const clearFileSelection = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setFileInfo(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const getChat = async () => {
        setLoading(true);
        try {
            const response = await Chat.getChatInfo(page, size, StundetID, CreatorID);
            if (response.success) {
                // Sort messages from oldest to newest for chat display
                const sortedMessages = response.object?.content?.sort((a, b) =>
                    new Date(a.createdAt) - new Date(b.createdAt)
                ) || [];

                setChats(sortedMessages);
                setTotalPages(response.object?.totalPages || 0);
            }
        } catch (error) {
            console.error("Error fetching chats:", error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if ((!newMessage.trim() && !fileInfo) || sendingMessage) return;
        setSendingMessage(true);
        try {
            // Create a deep copy of fileInfo to avoid reference issues
            const fileData = fileInfo ? {
                id: fileInfo.id,
                name: fileInfo.name,
                size: fileInfo.size,
                extension: fileInfo.extension || fileInfo.name.split('.').pop()
            } : null;

            const newMessageObj = {
                content: newMessage,
                createdAt: new Date().toISOString(),
                creatorId: localStorage.getItem('userId'),
                recipientId: parseInt(CreatorID),
                studentId: parseInt(StundetID),
                status: "DELIVERED",
                filesId: fileInfo ? [fileInfo.id] : []  // Check if fileInfo is not null/undefined
            };


            console.log(newMessageObj)

            const response = await Chat.SentMessage(newMessageObj);

            if (response.success) {
                setNewMessage("");
                clearFileSelection();

                // Refresh to get the real message data from server
                setTimeout(() => getChat(), 1000);
            } else {
                Swal.fire("Error", "Failed to send message", "error");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            Swal.fire("Error", "Failed to send message: " + error.message, "error");
        } finally {
            setSendingMessage(false);
        }
    };

    useEffect(() => {
        getChat();

        // Set up polling for new messages
        const interval = setInterval(() => {
            getChat();
        }, 10000); // Poll every 10 seconds

        return () => clearInterval(interval);
    }, [page, size, StundetID, CreatorID]);

    useEffect(() => {
        scrollToBottom();
    }, [chats]);



    const getFileExtensionIcon = (extension) => {
        switch (extension?.toLowerCase()) {
            case 'pdf':
                return '📄';
            case 'doc':
            case 'docx':
                return '📝';
            case 'xls':
            case 'xlsx':
                return '📊';
            case 'ppt':
            case 'pptx':
                return '📑';
            case 'zip':
            case 'rar':
                return '🗂️';
            case 'mp3':
            case 'wav':
                return '🎵';
            case 'mp4':
            case 'mov':
                return '🎬';
            default:
                return '📎';
        }
    };

    const renderMessage = (message) => {
        // Check if the message is from the current user
        const isCurrentUser = parseInt(message.creatorId) === currentUserId;

        return (
            <SoftBox
                key={message.id || `temp-${Date.now()}`}
                mb={2}
                display="flex"
                flexDirection="column"
                alignItems={isCurrentUser ? "flex-end" : "flex-start"}
            >
                <SoftBox
                    display="flex"
                    flexDirection={isCurrentUser ? "row-reverse" : "row"}
                    alignItems="flex-start"
                    gap={1}
                >
                    <SoftBox
                        maxWidth="100%"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1
                        }}
                    >
                        {/* Message content */}
                        {message.content && (
                            <Paper
                                elevation={1}
                                sx={{
                                    p: 2,
                                    padding: '5px 10px',
                                    borderRadius: '12px',
                                    bgcolor: isCurrentUser ? 'info.light' : 'grey.100',
                                    color: isCurrentUser ? 'white' : 'text.primary',
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        width: 0,
                                        height: 0,
                                        borderTop: '8px solid transparent',
                                        borderBottom: '8px solid transparent',
                                        ...(isCurrentUser
                                            ? {
                                                borderLeft: '8px solid',
                                                borderLeftColor: 'info.light',
                                                right: '-8px',
                                            }
                                            : {
                                                borderRight: '8px solid',
                                                borderRightColor: 'grey.100',
                                                left: '-8px',
                                            }),
                                        top: '10px',
                                    }
                                }}
                            >
                                <SoftTypography variant="body2" fontWeight="regular">
                                    {message.content}
                                </SoftTypography>
                            </Paper>
                        )}

                        {/* Files/Images */}
                        {message.files && message.files.length > 0 && message.files.map((file, index) => (
                            <SoftBox key={index} mb={1}>
                                {file.extension && (file.extension.toLowerCase() === 'png' ||
                                    file.extension.toLowerCase() === 'jpg' ||
                                    file.extension.toLowerCase() === 'jpeg' ||
                                    file.extension.toLowerCase() === 'gif') ? (
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            maxWidth: '300px'
                                        }}
                                    >
                                        <img
                                            src={`https://ustozx.uz/edu/api/file/view/one/photo?id=${file.id}`}
                                            alt={file.id}
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </Paper>
                                ) : (
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            p: 2,
                                            borderRadius: '12px',
                                            bgcolor: isCurrentUser ? 'info.light' : 'grey.100',
                                            color: isCurrentUser ? 'white' : 'text.primary',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1
                                        }}
                                    >
                                        <SoftTypography variant="h5">
                                            {getFileExtensionIcon(file.extension)}
                                        </SoftTypography>
                                        <SoftBox>
                                            <SoftTypography variant="button" fontWeight="medium">
                                                {file.name}
                                            </SoftTypography>
                                            <SoftTypography variant="caption" display="block">
                                                {Math.round(file.size / 1024)} KB
                                            </SoftTypography>
                                        </SoftBox>
                                    </Paper>
                                )}
                            </SoftBox>
                        ))}

                        {/* Time stamp */}
                        <SoftTypography
                            variant="caption"
                            color="text"
                            fontWeight="light"
                            textAlign={isCurrentUser ? "right" : "left"}
                        >
                            {formatDate(message.createdAt)}
                        </SoftTypography>
                    </SoftBox>
                </SoftBox>
            </SoftBox>
        );
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox my={3}>
                <Card sx={{ height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
                    {/* Chat header */}
                    <SoftBox
                        p={3}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        borderBottom="1px solid"
                        borderColor="grey.300"
                    >
                        <SoftBox display="flex" alignItems="center">
                            <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                                <ArrowBackIcon />
                            </IconButton>
                            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                {userData?.firstName?.charAt(0) || 'C'}
                            </Avatar>
                            <SoftBox>
                                <SoftTypography variant="h6" fontWeight="medium">
                                    {userData?.firstName} {' '} {userData?.lastName}
                                </SoftTypography>
                                <SoftBadge variant="contained" color="success" size="xs">
                                    Online
                                </SoftBadge>
                            </SoftBox>
                        </SoftBox>
                    </SoftBox>

                    {/* Messages area */}
                    <SoftBox
                        p={3}
                        flex="1 1 auto"
                        overflow="auto"
                        bgcolor="grey.50"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {loading ? (
                            <SoftBox display="flex" justifyContent="center" alignItems="center" height="100%">
                                <CircularProgress color="info" />
                            </SoftBox>
                        ) : chats.length > 0 ? (
                            chats.map(message => renderMessage(message))
                        ) : (
                            <SoftBox display="flex" justifyContent="center" alignItems="center" height="100%">
                                <SoftTypography color="text" fontWeight="regular">
                                    No messages yet. Start the conversation!
                                </SoftTypography>
                            </SoftBox>
                        )}
                        <div ref={messagesEndRef} />
                    </SoftBox>

                    {/* File preview area */}
                    {previewUrl && (
                        <SoftBox
                            p={2}
                            bgcolor="grey.100"
                            display="flex"
                            alignItems="center"
                            borderTop="1px solid"
                            borderColor="grey.300"
                        >
                            <Paper
                                elevation={1}
                                sx={{
                                    p: 1,
                                    position: 'relative',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    width: '100px',
                                    height: '100px',
                                }}
                            >
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={clearFileSelection}
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        bgcolor: 'rgba(0,0,0,0.5)',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'rgba(0,0,0,0.7)'
                                        }
                                    }}
                                >
                                    ✕
                                </IconButton>
                            </Paper>
                            {fileInfo && (
                                <SoftTypography variant="caption" ml={2}>
                                    {fileInfo.name} ({Math.round(fileInfo.size / 1024)} KB)
                                </SoftTypography>
                            )}
                        </SoftBox>
                    )}

                    {/* Input area */}
                    <SoftBox
                        p={2}
                        display="flex"
                        alignItems="center"
                        borderTop="1px solid"
                        borderColor="grey.300"
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                        />
                        <Tooltip title="Attach file">
                            <IconButton
                                color="primary"
                                onClick={() => fileInputRef.current.click()}
                                disabled={sendingMessage}
                            >
                                <AttachFileIcon />
                            </IconButton>
                        </Tooltip>
                        <TextField
                            fullWidth
                            placeholder="Text"
                            variant="outlined"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                            disabled={sendingMessage}
                            multiline
                            maxRows={4}
                            sx={{ mx: 2 }}
                        />
                        <SoftButton
                            circular
                            color="info"
                            iconOnly
                            onClick={sendMessage}
                            disabled={(!newMessage.trim() && !fileInfo) || sendingMessage}
                        >
                            {sendingMessage ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                        </SoftButton>
                    </SoftBox>
                </Card>
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}