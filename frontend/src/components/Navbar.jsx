import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex justify-between items-center max-w-5xl mx-auto">
        <motion.h1
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-extrabold tracking-wide"
        >
          User Management
        </motion.h1>
        <div className="flex gap-4">
          {[
            { to: "/", label: "Dashboard" },
            { to: "/create", label: "Add User" },
          ].map((link) => (
            <motion.div whileHover={{ scale: 1.15 }} key={link.to}>
              <Link
                to={link.to}
                className="px-3 py-1 rounded-md transition-all duration-300 hover:bg-white hover:text-blue-600 shadow hover:shadow-lg"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </nav>
  );
}
