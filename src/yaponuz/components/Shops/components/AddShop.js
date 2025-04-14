import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid"; // Grid komponentini import qilamiz
import SoftButton from "components/SoftButton";
import { useState } from "react";
import SoftInput from "components/SoftInput";
import Swal from "sweetalert2";

import { GetAuth, FileController, Shops } from "yaponuz/data/api";
import Icon from "@mui/material/Icon";

import SoftBox from "components/SoftBox";
import Switch from "@mui/material/Switch";
import SoftTypography from "components/SoftTypography";
import SoftSelect from "components/SoftSelect";
import PropTypes from "prop-types";

export default function AddShop({ refetch }) {
  const [open, setOpen] = React.useState(false);

  const [active, setActive] = useState(false);
  const [address, setAddress] = useState("");
  const [addressGoogleLink, setAddressGoogleLink] = useState("");
  const [description, setDescription] = useState("");
  const [iconId, setIconId] = useState([]);
  const [price, setPrice] = useState();
  const [shopFoodType, setShopFoodType] = useState("DOUBTFUL");
  const [shopType, setShopType] = useState("FOODS");
  const [title, setTitle] = useState("");
  const [commodity, setCommodity] = useState([{ name: "", price: 0 }]);

  const handleUpload = async (files) => {
    const category = "icon";
    const userHashId = GetAuth.getUserHashId();
    try {
      const promises = Array.from(files).map(async (file) => {
        const response = await FileController.uploadFile(file, category, userHashId);
        return response.object;
      });
      const uploadedFiles = await Promise.all(promises);
      setIconId((prevIds) => [...prevIds, ...uploadedFiles]);
    } catch (error) {
      console.error("Error uploading file:", error.message);
    }
  };

  const showAlert = (response) => {
    if (response.success) {
      Swal.fire("Added!", response.message, "success").then(() => refetch());
    } else {
      Swal.fire("Not Added!", response.message || response.error, "error").then(() => refetch());
    }
  };

  const handleSave = async () => {
    const userId = GetAuth.getUserId();
    console.log("iconId", iconId);
    const data = {
      active: active,
      address: address,
      addressGoogleLink: addressGoogleLink,
      comment: {},
      commodity: commodity,
      creatorId: userId,
      description: description,
      objectPhotos: iconId,
      price: price,
      shopFoodType: shopFoodType,
      shopType: shopType,
      title: title,
    };
    console.log(data);

    try {
      const response = await Shops.createShop(data);
      // console.log(data);
      showAlert(response);

      setOpen(false);
    } catch (error) {
      console.error("Error creating article category:", error.message);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const my = { margin: "0px 0px 5px 0px" };

  return (
    <>
      <SoftButton variant="gradient" onClick={handleClickOpen} color="info" size="small">
        + add shop
      </SoftButton>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Add Shop</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <SoftTypography variant="caption">Title</SoftTypography>
              <SoftInput
                placeholder="Title"
                value={title}
                style={my}
                onChange={(e) => setTitle(e.target.value)}
              />
              <SoftTypography variant="caption">Address</SoftTypography>

              <SoftInput
                placeholder="Address"
                value={address}
                style={my}
                onChange={(e) => setAddress(e.target.value)}
              />
              <SoftTypography variant="caption">Description</SoftTypography>
              <SoftInput
                placeholder="description"
                value={description}
                style={my}
                onChange={(e) => setDescription(e.target.value)}
              />
              <SoftTypography variant="caption">Google Maps Url</SoftTypography>
              <SoftInput
                placeholder="googleMapsURL"
                value={addressGoogleLink}
                style={my}
                onChange={(e) => setAddressGoogleLink(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <SoftBox style={{ margin: "8px 0px" }}>
                <SoftTypography variant="caption">Images</SoftTypography>
                <input
                  id="dropzone-file"
                  type="file"
                  onChange={(e) => handleUpload(e.target.files)}
                  style={my}
                  multiple
                />
              </SoftBox>
              <SoftTypography variant="caption">Price</SoftTypography>

              <SoftInput
                placeholder="price"
                style={my}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <SoftTypography variant="caption">Shop Type</SoftTypography>
              <SoftBox style={my}>
                <SoftSelect
                  placeholder="Select Shop type"
                  onChange={(selectedOption) => setShopType(selectedOption.value)} // Adjusted onChange function
                  options={[
                    { value: "FOODS", label: "FOODS" },
                    { value: "NO_FOODS", label: "NO_FOODS" },
                  ]}
                />
              </SoftBox>
              <SoftTypography variant="caption">Shop Food Type</SoftTypography>

              {shopType == "FOODS" ? (
                <SoftBox style={my}>
                  <SoftSelect
                    placeholder="Select Shop FOOD type"
                    onChange={(selectedOption) => setShopFoodType(selectedOption.value)} // Adjusted onChange function
                    options={[
                      { value: "UNCHECKED", label: "UNCHECKED" },
                      { value: "HALAL", label: "HALAL" },
                      { value: "XAROM", label: "XAROM" },
                      { value: "DOUBTFUL", label: "DOUBTFUL" },
                    ]}
                  />
                </SoftBox>
              ) : (
                <SoftInput
                  disabled
                  placeholder="shopFoodType"
                  style={my}
                  value={shopFoodType}
                  onChange={(e) => setShopFoodType(e.target.value)}
                />
              )}
            </Grid>
          </Grid>

          {commodity.map((item, index) => (
            // Inside the map function for rendering commodities
            <SoftBox key={index}>
              <SoftTypography variant="caption">Commodity</SoftTypography>
              <Grid container key={index} spacing={2}>
                <Grid item xs={6}>
                  <SoftInput
                    placeholder="Commodity Name"
                    value={item.name}
                    style={my}
                    onChange={(e) => {
                      const updatedCommodity = [...commodity];
                      updatedCommodity[index].name = e.target.value;
                      setCommodity(updatedCommodity);
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <SoftInput
                    placeholder="Commodity Price"
                    value={item.price}
                    type="number"
                    style={my}
                    onChange={(e) => {
                      const updatedCommodity = [...commodity];
                      updatedCommodity[index].price = e.target.value;
                      setCommodity(updatedCommodity);
                    }}
                  />
                </Grid>
                <Grid item xs={2} style={{ margin: "5px 0px" }}>
                  <SoftButton
                    variant="contained"
                    color="error"
                    onClick={() => {
                      const updatedCommodity = [...commodity];
                      updatedCommodity.splice(index, 1);
                      setCommodity(updatedCommodity);
                    }}
                  >
                    <Icon>delete</Icon>
                  </SoftButton>
                </Grid>
              </Grid>
            </SoftBox>
          ))}
          <Grid container space={2}>
            <Grid item xs={6}>
              <SoftButton
                variant="outlined"
                color="dark"
                onClick={() => setCommodity([...commodity, { name: "", price: 0 }])}
              >
                Add Commodity
              </SoftButton>
            </Grid>
            <Grid item xs={6}>
              <SoftBox display="flex" style={{ margin: "5px 10px" }} alignItems="center">
                <Switch checked={active} onChange={() => setActive(!active)} />
                <SoftTypography
                  variant="button"
                  fontWeight="regular"
                  onClick={() => setActive(!active)}
                  sx={{ cursor: "pointer", userSelect: "none" }}
                >
                  &nbsp;&nbsp;is Active
                </SoftTypography>
              </SoftBox>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Add Shop</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AddShop.propTypes = {
  refetch: PropTypes.func,
};
