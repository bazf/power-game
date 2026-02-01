import PropTypes from "prop-types";

export default function Card({ className = "", children }) {
    return (
        <div className={`rounded-2xl bg-white p-5 shadow-card ${className}`}>
            {children}
        </div>
    );
}

Card.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};
