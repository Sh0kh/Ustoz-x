import PropTypes from "prop-types";


export default function TestResultHistory({ groupID }) {
    return (
        <>
            Hello
        </>
    )
}

TestResultHistory.propTypes = {
    groupID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
