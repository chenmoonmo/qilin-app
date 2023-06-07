import { useRouter } from 'next/router';

import { BackIcon } from '@/components';
import Layout from '@/layouts/nft-layout';
import {
  BackLink,
  PNL,
  PositionPercent,
  PositionsList,
  Size,
} from '@/styles/player';

import type { NextPageWithLayout } from '../../_app';

const Positions: NextPageWithLayout = () => {
  const router = useRouter();
  const finalSlashIndex = router.asPath.lastIndexOf('/');
  const previousPath = router.asPath.slice(0, finalSlashIndex);
  return (
    <>
      <BackLink href={previousPath}>
        <BackIcon />
      </BackLink>
      <PositionPercent longSize={60} shortSize={40} />
      <PositionsList>
        <div>1</div>
        <div>3412</div>
        <Size leverage={20} direction="long">
          132.12
        </Size>
        <PNL type="profit">+12.21(1.2%)</PNL>
        <div>1</div>
        <div>3412</div>
        <Size leverage={20} direction="short">
          132.12
        </Size>
        <PNL type="loss">+12.21(1.2%)</PNL>
      </PositionsList>
    </>
  );
};

Positions.getLayout = (page: any) => {
  return <Layout>{page}</Layout>;
};

export default Positions;
