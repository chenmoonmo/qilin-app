import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';

import { BackIcon } from '@/components';
import { useClosePostion, usePoolInfo } from '@/hooks';
import Layout, { Header } from '@/layouts/nft-layout';
import {
  CloseButton,
  CloseCard,
  CloseContainer,
  CloseInfoItem,
  SplitLine,
} from '@/styles/player';

import type { NextPageWithLayout } from '../../_app';

const ClostPosition: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const finalSlashIndex = router.asPath.lastIndexOf('/');
  const previousPath = router.asPath.slice(0, finalSlashIndex);

  const { poolInfo, myPosition, refetch } = usePoolInfo(+id);

  const { isNeedLiquidate, closePostion } = useClosePostion({
    position: myPosition,
    poolAddress: poolInfo?.poolAddress,
  });

  const handleClosePosition = useCallback(async () => {
    await closePostion();
    refetch();
    router.back();
  }, [closePostion, refetch, router]);

  const Title = useMemo(() => {
    return isNeedLiquidate ? 'Liquidate' : 'Close Postion';
  }, [isNeedLiquidate]);

  return (
    <>
      <Header shortId={poolInfo?.shortId} isOwner={poolInfo.isOwner} />
      <CloseContainer>
        <CloseCard>
          <h1>
            <Link href={previousPath}>
              <BackIcon />
            </Link>
            {Title}
          </h1>
          <CloseInfoItem>
            <div>Symbol</div>
            <div>{poolInfo.trade_pair}</div>
          </CloseInfoItem>
          <CloseInfoItem>
            <div>Close Price</div>
            <div>
              {poolInfo.closePrice} {poolInfo.token1Symbol}
            </div>
          </CloseInfoItem>
          <CloseInfoItem>
            <div>Margin</div>
            <div>
              {myPosition?.fomattedMargin} {poolInfo.pay_token_symbol}
            </div>
          </CloseInfoItem>
          <SplitLine />
          <CloseInfoItem>
            <div>Est.PNL</div>
            <div>
              {myPosition?.estPnl} {myPosition?.marginSymbol}
            </div>
          </CloseInfoItem>
        </CloseCard>
        <CloseButton onClick={handleClosePosition}>Confirm</CloseButton>
      </CloseContainer>
    </>
  );
};

ClostPosition.getLayout = (page: any) => {
  return <Layout type="player">{page}</Layout>;
};

export default ClostPosition;
