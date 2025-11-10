import Layout from '../../components/Layout';

const SupportPage = ({ slug }) => (
  <Layout title={`Support · ${slug} · Elite Electronics`}>
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 className="text-3xl font-semibold capitalize">{slug.replace('-', ' ')}</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        We are preparing curated support content for {slug.replace('-', ' ')}. Reach out via support@eliteelectronics.com for immediate help.
      </p>
    </div>
  </Layout>
);

export const getServerSideProps = async ({ params }) => {
  return { props: { slug: params.slug } };
};

export default SupportPage;
