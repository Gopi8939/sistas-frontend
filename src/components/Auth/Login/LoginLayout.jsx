import React from "react";
import PropTypes from "prop-types";
import Layout from "../../Partials/Layout";

function LoginLayout({ children }) {
  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="login-page-wrapper w-full min-h-screen flex items-center justify-center py-10">
        <div className="lg:w-[572px] w-full bg-white flex flex-col justify-center sm:p-10 p-5 border border-gray-300 shadow-md rounded-lg">
          {children}
        </div>
      </div>
    </Layout>
  );
}

LoginLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LoginLayout;
