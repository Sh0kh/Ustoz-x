import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

export default function SizableContent({ data }) {
  return (
    <SoftBox style={{ maxWidth: "150px", maxHeight: "200px", overflow: "auto" }}>
      <SoftTypography style={{ maxWidth: "200px" }} variant="caption">
        {data}
      </SoftTypography>
    </SoftBox>
  );
}

SizableContent.propTypes = {
  data: PropTypes.string.isRequired,
};
