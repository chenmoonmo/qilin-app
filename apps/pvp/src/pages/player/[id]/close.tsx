import Layout, { Header } from '@/layouts/nft-layout';

import type { NextPageWithLayout } from '../../_app';

const ClostPosition: NextPageWithLayout = () => {
  return (
    <>
      <Header />
    </>
  );
};

ClostPosition.getLayout = (page: any) => {
  return <Layout>{page}</Layout>;
};

export default ClostPosition;
