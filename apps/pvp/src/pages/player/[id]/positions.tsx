import { formatAmount } from '@qilin/utils';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

import { BackIcon } from '@/components';
import { usePoolInfo } from '@/hooks';
import Layout, { Header } from '@/layouts/nft-layout';
import {
  BackLink,
  PositionPercent,
  PositionPNL,
  PositionsList,
  Size,
} from '@/styles/player';

import type { NextPageWithLayout } from '../../_app';

const Positions: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const finalSlashIndex = router.asPath.lastIndexOf('/');
  const previousPath = router.asPath.slice(0, finalSlashIndex);

  const { poolInfo, mergePositions, positions } = usePoolInfo(+id);

  console.log(positions);

  return (
    <>
      <Header shortId={poolInfo?.shortId} isOwner={poolInfo.isOwner} />
      <BackLink href={previousPath}>
        <BackIcon />
      </BackLink>
      <PositionPercent
        longSize={mergePositions?.long.lp ?? 0}
        shortSize={mergePositions?.short.lp ?? 0}
      />
      <PositionsList>
        {positions?.map((position, index) => {
          return (
            <Fragment key={index}>
              <div>{index + 1}</div>
              <div>
                {position.user.slice(-4)} {position.isMe && '(I)'}
              </div>
              <Size
                leverage={position.level}
                direction={position.direction as 'long' | 'short' | undefined}
              >
                {formatAmount(position.fomattedMargin)}
              </Size>
              {position.estPnl || position.estPnl === 0 ? (
                <PositionPNL>
                  {formatAmount(position.estPnl)}(
                  {formatAmount(position.ROE, 2)}%)
                </PositionPNL>
              ) : (
                <div></div>
              )}
            </Fragment>
          );
        })}
      </PositionsList>
    </>
  );
};

Positions.getLayout = (page: any) => {
  return <Layout type="player">{page}</Layout>;
};

export default Positions;
