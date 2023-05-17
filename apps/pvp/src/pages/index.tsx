import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Dialog } from '@qilin/component';
import { PlusIcon } from '@radix-ui/react-icons';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

import { NFTIDAtom } from '@/atoms';
import {
  CreateRoomDialog,
  NFTMMainDialog,
  WhilteListDialog,
} from '@/components';
import HomeLayout from '@/layouts/home-layout';

import type { NextPageWithLayout } from './_app';

const StyledMain = styled.main`
  max-width: 1440px;
  margin: 22px auto 0;
`;

const HomeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  > div:nth-of-type(1) {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 12px;
  }
`;

const NFTContainer = styled.ul`
  all: unset;
  display: grid;
  grid-template-columns: repeat(5, 272px);
  grid-template-rows: auto;
  gap: 20px;
  > li {
    height: 320px;
    list-style: none;
    border: 2px solid #262626;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    iframe {
      all: unset;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
  }
`;

const Home: NextPageWithLayout = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const router = useRouter();
  const id = router.query.id as string;

  const setNFTID = useSetAtom(NFTIDAtom);

  useEffect(() => {
    id && setNFTID(id);
  }, [id, setNFTID]);

  console.log(address, isConnecting, isDisconnected);

  const nfts = [
    {
      pairName: 'BTC / USDC',
      isOwn: false,
      // 方向
      direction: 'long',
      id: '1',
      // 盈亏
      profit: '0.1',
      // 结束时间
      endTime: '2021-10-10 12:00:00',
    },
    {
      pairName: 'BTC / USDC',
      isOwn: true,
      // 方向
      direction: 'short',
      id: '2',
      // 盈亏
      profit: '0.1',
      // 结束时间
      endTime: '2021-10-10 12:00:00',
    },
  ];

  return (
    <StyledMain>
      <HomeInfo>
        <div>My Betting Room</div>
        <CreateRoomDialog>
          <Dialog.Trigger asChild>
            <Button>
              <PlusIcon
                css={css`
                  margin-right: 6px;
                `}
              />
              Create a Betting Room
            </Button>
          </Dialog.Trigger>
        </CreateRoomDialog>
      </HomeInfo>
      <NFTMMainDialog defaultOpen={!!id}>
        <NFTContainer>
          {nfts.map(nft => (
            <Dialog.Trigger key={nft.id} asChild>
              <li onClick={() => setNFTID(nft.id)}>
                <iframe src={`/nft/${nft.id}`} />
              </li>
            </Dialog.Trigger>
          ))}
        </NFTContainer>
      </NFTMMainDialog>
      <WhilteListDialog />
    </StyledMain>
  );
};

Home.getLayout = page => {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Home;
