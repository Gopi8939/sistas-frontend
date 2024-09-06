import PageHead from "../src/components/Helpers/PageHead";
import Home from "./../src/components/Home/index";

export default function HomePage({ data }) {
  const { seoSetting } = data;
  return (
    <>

      <PageHead
        title={`${seoSetting.seo_title}`}
        metaDes={seoSetting.seo_description}
      />
      <Home homepageData={data} />
    </>
  );
}
export async function getServerSideProps() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/`);
    
    if (!res.ok) {
      console.error('HTTP error:', res.status, res.statusText);
      return { props: { data: null } };
    }

    const contentType = res.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Expected JSON, but received:', contentType);
      return { props: { data: null } };
    }

    const data = await res.json();
    return { props: { data } };

  } catch (error) {
    console.error('Fetch error:', error);
    return { props: { data: null } };
  }
}
