import { Button } from '@qilin/component';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import Pool from '@/constant/abis/Pool.json';

const Index = () => {
  const { config } = usePrepareContractWrite({
    address: '0x1f0625171f1d1d62fc9e03e955c9c19dbcee69b5',
    abi: Pool.abi,
    functionName: 'setEndPrice',
  });

  const { write } = useContractWrite(config);

  return (
    <>
      <Button onClick={write}>1111</Button>
    </>
  );
};

export default Index;
