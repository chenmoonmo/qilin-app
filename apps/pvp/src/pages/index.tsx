import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Dialog } from '@qilin/component';
import { PlusIcon } from '@radix-ui/react-icons';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { NFTIDAtom } from '@/atoms';
import {
  CreateRoomDialog,
  NFTMainDialogOpenAtom,
  NFTMMainDialog,
} from '@/components';
import { useCreateRoom, useGetPlayerNFTIds } from '@/hooks';
import HomeLayout from '@/layouts/home-layout';

import type { NextPageWithLayout } from './_app';

const StyledMain = styled.main`
  max-width: 1440px;
  margin: 22px auto 0;
`;

const HomeInfo = styled.div`
  display: flex;
  justify-content: space-between;

  margin-bottom: 27px;
  > div:nth-of-type(1) {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 32px;
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
  const router = useRouter();
  const id = router.query.id as string;

  const { canCreateRoom } = useCreateRoom();

  // 玩家拥有的 player nft（可以进入的房间）
  const playerNFTIds = useGetPlayerNFTIds();

  console.log({
    canCreateRoom,
    playerNFTIds,
  });

  const setNFTDialogOpen = useSetAtom(NFTMainDialogOpenAtom);

  const setNFTID = useSetAtom(NFTIDAtom);

  useEffect(() => {
    if (id && playerNFTIds.includes(+id)) {
      setNFTID(+id);
      setNFTDialogOpen(true);
    }
  }, [id, playerNFTIds, setNFTID]);

  return (
    <StyledMain>
      <HomeInfo>
        <div>My Betting Room</div>
        <CreateRoomDialog>
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
        </CreateRoomDialog>
      </HomeInfo>
      <NFTMMainDialog>
        <NFTContainer>
          {playerNFTIds.map(id => (
            <Dialog.Trigger key={id} asChild>
              <li onClick={() => setNFTID(id)}>
                <iframe src={`/nft/${id}`} />
              </li>
            </Dialog.Trigger>
          ))}
        </NFTContainer>
      </NFTMMainDialog>
    </StyledMain>
  );
};

Home.getLayout = page => {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Home;
