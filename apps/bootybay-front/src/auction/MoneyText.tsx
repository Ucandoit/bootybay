import styled from '@emotion/styled';

const StyledCurrency = styled.div`
  .gold {
    color: #caaa00;
    font-weight: bold;
  }

  .silver {
    color: #c7c7c7;
    font-weight: bold;
  }

  .copper {
    color: #b87333;
    font-weight: bold;
  }
`;

export function CurrencyText({ value }: { value: number }) {
  if (Number.isNaN(value)) {
    return <div>{value}</div>;
  } else {
    const copper = value % 100;
    const silver = Math.floor((value % 10000) / 100);
    const gold = Math.floor(value / 10000);

    return (
      <StyledCurrency>
        <NoZeroCurrency value={gold} unit={<span className="gold">g</span>} />
        <NoZeroCurrency value={silver} unit={<span className="silver">s</span>} />
        <NoZeroCurrency value={copper} unit={<span className="copper">c</span>} />
      </StyledCurrency>
    );
  }
}

function NoZeroCurrency({ value, unit }: { value: number; unit: JSX.Element }): JSX.Element | null {
  return value === 0 ? null : (
    <>
      {value}
      {unit}
    </>
  );
}

export default CurrencyText;
