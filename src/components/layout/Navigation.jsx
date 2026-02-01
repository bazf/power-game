import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const linkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${isActive
        ? "bg-accentBlue text-white"
        : "bg-white text-ink hover:bg-slate-100"
    }`;

export default function Navigation({ links }) {
    return (
        <nav className="flex flex-wrap gap-2">
            {links.map((link) => (
                <NavLink key={link.to} to={link.to} className={linkClass} end={link.end}>
                    {link.label}
                </NavLink>
            ))}
        </nav>
    );
}

Navigation.propTypes = {
    links: PropTypes.arrayOf(
        PropTypes.shape({
            to: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            end: PropTypes.bool,
        })
    ).isRequired,
};
