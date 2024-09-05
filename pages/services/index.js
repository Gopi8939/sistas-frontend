import React, {useEffect} from "react";
import AllServicesPage from "../../src/components/AllServicePage/index";
import PageHead from "../../src/components/Helpers/PageHead";
import {useRouter} from "next/router";

export default function AllServicesPageData(data) {
  console.log("hiiiiiiiii")
  const { seoSetting } = data.data;
  const router = useRouter();
  useEffect(() => {
    if (!data.data) {
      router.push("*");
    }
  });
  console.log(data,"resyyd");
  
  return (
    <>
      {data && seoSetting && (
          <>
            <PageHead
                title={`${seoSetting.seo_title}`}
                metaDes={seoSetting.seo_description}
            />
            <AllServicesPage response={data} />
          </>
      )}
    </>
  );
}
export const getServerSideProps = async (context) => {
  try {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/service?${
            context.query.category
                ? `category=${context.query.category}`
                : context.query.sub_category
                    ? `sub_category=${context.query.sub_category}`
                    : context.query.child_category
                        ? `child_category=${context.query.child_category}`
                        : context.query.highlight
                            ? `highlight=${context.query.highlight}`
                            : context.query.brand
                                ? `brand=${context.query.brand}`
                                : ""
        }`
    );
    // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/service`)
    console.log(res,"resyye");
    const data = await res.json();
    
    return {
      props: {
        data,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        data: false,
      },
    };
  }
};
