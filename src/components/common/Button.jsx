import PropTypes from "prop-types";

export default function Button({ variant = "primary", className = "", ...props }) {
    const base = "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition";
    const variants = {
        primary: "bg-accentBlue text-white hover:brightness-110",
        ghost: "border border-slate-200 bg-white text-ink hover:bg-slate-100",
        success: "bg-accentGreen text-white hover:brightness-110",
        danger: "bg-accentOrange text-white hover:brightness-110",
    };

    return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

Button.propTypes = {
    variant: PropTypes.oneOf(["primary", "ghost", "success", "danger"]),
    className: PropTypes.string,
};
