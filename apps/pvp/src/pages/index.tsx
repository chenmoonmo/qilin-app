import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Dialog } from '@qilin/component';
import { PlusIcon } from '@radix-ui/react-icons';
import { useSetAtom } from 'jotai';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { NFTIDAtom } from '@/atoms';
import {
  CreateRoomDialog,
  NFTCard,
  NFTMainDialogOpenAtom,
  NFTMMainDialog,
} from '@/components';
import { CONTRACTS } from '@/constant';
import { useCreateRoom, useGetPlayerNFTIds, useNFTList } from '@/hooks';
import HomeLayout from '@/layouts/home-layout';

import type { NextPageWithLayout } from './_app';

const StyledMain = styled.main`
  width: max-content;
  margin: 22px auto 0;
`;

const HomeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  > div:nth-of-type(1) {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 32px;
  }
`;

const NFTContainer = styled.div`
  all: unset;
  display: grid;
  grid-template-columns: repeat(5, 256px);
  grid-template-rows: auto;
  gap: 18px;
`;

const Home: NextPageWithLayout = () => {
  // const router = useRouter();
  // const id = router.query.id as string;

  const { data } = useNFTList();

  // const { canCreateRoom } = useCreateRoom();

  // 玩家拥有的 player nft（可以进入的房间）
  // const { playerNFTIds, refetch } = useGetPlayerNFTIds();

  // console.log({
  //   canCreateRoom,
  //   playerNFTIds,
  // });

  // const setNFTDialogOpen = useSetAtom(NFTMainDialogOpenAtom);

  // const setNFTID = useSetAtom(NFTIDAtom);

  // useEffect(() => {
  //   if (id && playerNFTIds.includes(+id)) {
  //     setNFTID(+id);
  //     setNFTDialogOpen(true);
  //   }
  // }, [id, playerNFTIds, setNFTID]);

  return (
    <StyledMain>
      <HomeInfo>
        <div>Your NFTs</div>
        {/* <CreateRoomDialog onSucceess={refetch}>
          <Dialog.Trigger asChild>
            <Button disabled={!canCreateRoom}>
              <PlusIcon
                css={css`
                  margin-right: 6px;
                `}
              />
              Create a Betting Room
            </Button>
          </Dialog.Trigger>
        </CreateRoomDialog> */}
      </HomeInfo>
      <NFTMMainDialog>
        <NFTContainer>
          {data?.dealer && (
            <Link href={`/assets/${CONTRACTS.DealerAddress}/${data.dealer.id}`}>
              <NFTCard
                address={CONTRACTS.DealerAddress}
                tokenId={+data.dealer.id}
              />
            </Link>
          )}

          {/* player nft */}
          {data?.player?.map(({ id }) => (
            <Link key={id} href={`/assets/${CONTRACTS.PlayerAddress}/${id}`}>
              <NFTCard address={CONTRACTS.PlayerAddress} tokenId={+id} />
            </Link>
          ))}

          {/* dealer nft  */}
          {/* {data?.dealer && (
            <li>
              <iframe src={`/dealer/${data.dealer.id}`} />
            </li>
          )}

          <li>
            <iframe src={'http://localhost:3000/player/1'} />
          </li> */}

          {/* player nft */}
          {/* {data?.player?.map(({ id }) => (
            <li key={id}>
              <iframe src={`/player/${id}`} />
            </li>
          ))} */}

          {/* {playerNFTIds.map(id => (
            <Dialog.Trigger key={id} asChild>
              <li onClick={() => setNFTID(id)}>
                <iframe src={`/nft/${id}`} />
              </li>
            </Dialog.Trigger>
          ))} */}
        </NFTContainer>
      </NFTMMainDialog>
    </StyledMain>
  );
};

Home.getLayout = page => {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Home;
