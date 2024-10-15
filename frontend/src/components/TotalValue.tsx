// TotalValue.tsx
import React from 'react';

interface TotalValueProps {
  totalValue: number;
}

const TotalValue: React.FC<TotalValueProps> = ({ totalValue }) => {
  return (
    <div className="mb-4 p-3 bg-green-100 rounded-md">
      <span className="font-semibold">Valor total nodo:</span> {totalValue}
    </div>
  );
};

export default TotalValue;
