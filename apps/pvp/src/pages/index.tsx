import styled from '@emotion/styled';
import Link from 'next/link';

import { NFTCard } from '@/components';
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
  height: 100%;
  grid-template-columns: repeat(5, 256px);
  grid-template-rows: auto;
  gap: 18px;
`;

const NoData = styled.div`
  grid-column: 1 / 6;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30vh;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #737884;
  text-align: center;
`;

const Home: NextPageWithLayout = () => {
  const { data: NFTs } = useNFTList();

  return (
    <StyledMain>
      <HomeInfo>
        <div>Your NFTs</div>
      </HomeInfo>
      <NFTContainer>
        {NFTs && NFTs?.length > 0 ? (
          NFTs?.map(nft => {
            return (
              <Link
                key={`${nft.id}-${nft.contract}`}
                href={`/assets/${nft.contract}/${nft.id}`}
              >
                <NFTCard address={nft.contract} tokenId={+nft.id} />
              </Link>
            );
          })
        ) : (
          <NoData>No NFTs To Display.</NoData>
        )}
      </NFTContainer>
    </StyledMain>
  );
};

Home.getLayout = page => {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Home;
