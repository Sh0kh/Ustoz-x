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
import Grid from "@mui/material/Grid"; // Grid komponentini import qilamiz

import SoftBox from "components/SoftBox";
import Switch from "@mui/material/Switch";
import SoftTypography from "components/SoftTypography";
import Swal from "sweetalert2";
import SoftButton from "components/SoftButton";

import { GetAuth, Shops, FileController } from "yaponuz/data/api";

export default function UpdateShop({ myid, item, refetch }) {
  const [open, setOpen] = React.useState(false);

  const [active, setActive] = useState(item.deleted ? true : false);
  const [address, setAddress] = useState(item.address ? item.address : "");
  const [addressGoogleLink, setAddressGoogleLink] = useState(
    item.addressGoogleLink ? item.addressGoogleLink : ""
  );
  const [description, setDescription] = useState(item.description ? item.description : "");
  const [iconId, setIconId] = useState(item.objectPhotos);
  const [price, setPrice] = useState(item.price ? item.price : "0");
  const [shopFoodType, setShopFoodType] = useState(
    item.shopFoodType ? item.shopFoodType : "DOUBTFUL"
  );
  const [commodity, setCommodity] = useState(
    item.commodity ? item.commodity : [{ name: "", price: 0 }]
  );

  const [shopType, setShopType] = useState(item.shopType ? item.shopType : "FOODS");
  const [title, setTitle] = useState(item.title ? item.title : "");
  const [createdBy, setCreatedBy] = useState();
  useEffect(() => {
    setActive(item.deleted);
    setCreatedBy(item.createdBy);
    setAddress(item.address);
    setAddressGoogleLink(item.addressGoogleLink);
    setDescription(item.description);
    setIconId(item.objectPhotos);
    setPrice(item.price);
    setShopFoodType(item.shopFoodType ?? "HALAL");
    setCommodity(item.commodity);
    setShopType(item.shopType);
    setTitle(item.title);
  }, [item]);

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
    try {
      const data = {
        id: myid,
        active: active,
        address: address,
        addressGoogleLink: addressGoogleLink,
        comment: {},
        commodity: commodity,
        creatorId: createdBy,
        description: description,
        objectPhotos: iconId,
        price: price,
        shopFoodType: shopFoodType,
        shopType: shopType,
        title: title,
      };
      console.log(data);
      const response = await Shops.updateShop(data);
      console.log(response);
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

  const my = { margin: "5px 0px" };

  return (
    <>
      <Tooltip title="Edit" onClick={handleClickOpen} placement="top">
        <Icon>edit</Icon>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>Update Shop</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <SoftInput
                placeholder="Title"
                value={title}
                style={my}
                onChange={(e) => setTitle(e.target.value)}
              />
              <SoftInput
                placeholder="Address"
                value={address}
                style={my}
                onChange={(e) => setAddress(e.target.value)}
              />
              <SoftInput
                placeholder="description"
                value={description}
                style={my}
                onChange={(e) => setDescription(e.target.value)}
              />
              <SoftInput
                placeholder="googleMapsURL"
                value={addressGoogleLink}
                style={my}
                onChange={(e) => setAddressGoogleLink(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <SoftBox style={{ margin: "10px 0px" }}>
                <input
                  id="dropzone-file"
                  type="file"
                  onChange={(e) => handleUpload(e.target.files)}
                  style={my}
                  multiple
                />
              </SoftBox>
              <SoftInput
                placeholder="price"
                style={my}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <SoftInput
                disabled
                placeholder="shopFoodType"
                style={my}
                value={shopFoodType}
                onChange={(e) => setShopFoodType(e.target.value)}
              />
              <SoftInput
                disabled
                placeholder="shopType"
                style={my}
                value={shopType}
                onChange={(e) => setShopType(e.target.value)}
              />
            </Grid>
          </Grid>
          {commodity.map((item, index) => (
            // Inside the map function for rendering commodities
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
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    const updatedCommodity = [...commodity];
                    updatedCommodity.splice(index, 1);
                    setCommodity(updatedCommodity);
                  }}
                >
                  <Icon>delete</Icon>
                </Button>
              </Grid>
            </Grid>
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
          <Button onClick={handleSave}>Update Shop</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UpdateShop.propTypes = {
  myid: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
  refetch: PropTypes.func, // Adjust the prop type as per your requirements
  // Adjust the prop type as per your requirements
};
