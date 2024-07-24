import React from "react";
import BecomeServiceProvider from "../src/components/BecomeSaller/service-provider";
import PageHead from "../src/components/Helpers/PageHead";
import Layout from "../src/components/Partials/Layout";
function BecomeSallerPage() {
  return (
    <>
      <PageHead title="Become saller" />
      <Layout childrenClasses="pt-0 pb-0">
        <BecomeServiceProvider />
      </Layout>
    </>
  );
}
export default BecomeSallerPage;
