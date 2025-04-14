import React from "react";
import SoftButton from "components/SoftButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import { BadgeInfo, Info, User2 } from "lucide-react";
import ReactQuill from "react-quill";
import RichBox from "./RichBox";
import Profile from "./Profile";
import Carousel from "./Carousel";


function MainBuilder() {

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
  ];

  return (
    <div className="flex items-center justify-center flex-col gap-8 p-4 w-full mt-[50px]">
      <div className="w-[100%] flex items-center justify-center gap-[30px] flex-col">

        <RichBox />
        <Profile/>
        <Carousel/>

      </div>
    </div>
  );
}

export default MainBuilder;
