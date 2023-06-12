import { useRouter } from 'next/router';

import { BackIcon } from '@/components';
import { usePoolInfo } from '@/hooks';
import Layout, { Header } from '@/layouts/nft-layout';
import { BackLink } from '@/styles/player';

import type { NextPageWithLayout } from '../../_app';

const ClostPosition: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const finalSlashIndex = router.asPath.lastIndexOf('/');
  const previousPath = router.asPath.slice(0, finalSlashIndex);

  const { poolInfo, players, status } = usePoolInfo(+id);
  return (
    <>
    <Header shortId={poolInfo?.shortId} />
      <BackLink href={previousPath}>
        <BackIcon />
      </BackLink>
    </>
  );
};

ClostPosition.getLayout = (page: any) => {
  return <Layout>{page}</Layout>;
};

export default ClostPosition;
