import styled from '@emotion/styled';
import Link from 'next/link';

import { NFTCard } from '@/components';
import { CONTRACTS } from '@/constant';
import { useNFTList } from '@/hooks';
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
  const { data } = useNFTList();
  return (
    <StyledMain>
      <HomeInfo>
        <div>Your NFTs</div>
      </HomeInfo>
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
      </NFTContainer>
    </StyledMain>
  );
};

Home.getLayout = page => {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Home;
