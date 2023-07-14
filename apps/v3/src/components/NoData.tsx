import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 45px 0 45px;
  font-size: 14px;
  font-weight: 500;
  color: #b7bbc6;
`;

const Logo = styled.svg`
  width: 19px;
  height: 25px;
  margin-bottom: 8px;
`;

export const NoData = () => {
  return (
    <Container>
      <Logo
        width={19}
        height={25}
        xmlns="http://www.w3.org/2000/svg"
        fill="#b7bbc6"
      >
        <path d="M17.759 4.093l-.03-.002.037.001-.007.001zM17.195 3.966z" />
        <path d="M2.138 15.445s2.836-2.482 5.444-2.482c0 0-.34-.555-.907-.815l.064-.027.092-.012c1.505-.172 2.909.782 3.283 2.22.218.841.199 1.82-.566 2.634 0 0-1.021 1.37-3.025 0 0 0-1.588 4.481 2.911 8.037 0 0 4.321-2.813 7.823-7.118a7.776 7.776 0 001.742-4.912V3.815l-.018.005.018-.023V3.2L19 2.677c0-.238-.075-.472-.227-.657-.131-.16-.301-.287-.495-.37a.745.745 0 00-.313-.058h-.04c-.183.003-.383.01-.596.023-1.754.105-4.521.614-7.667 2.46 0 0 .87-2.482.642-4.075 0 0-3.138 4.185-4.725 4.593 0 0 .189-1.334-.34-2.037 0 0-1.362 4.333-3.479 6.296l.454.445s-.946 1.74-1.4 1.926l-.756-.815s-.605 3.036 2.08 5.037zm15.59-11.353h.037-.037zm-1.088-.623zm-.183-.652v0z" />
      </Logo>

      <div>No Data</div>
    </Container>
  );
};
