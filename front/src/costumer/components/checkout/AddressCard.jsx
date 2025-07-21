import { Radio } from "@mui/material";

export const AddressCard = ({ address, isSelected, onSelect }) => {
  return (
    <div className="p-5 border border-black/10 flex items-center">
      <div>
        <Radio
          checked={isSelected}
          onChange={onSelect}
          variant="outlined"
          name="address-radio"
          size="sm"
          value={address.id}
        />
      </div>
      <div className="space-y-3 text-xs">
        <h2>{address.recipient}</h2>
        <p className="w-80">
          {address.address}, {address.city} - {address.cep}
        </p>
        <p>
          <strong>Celular:</strong> {address.mobile}
        </p>
      </div>
    </div>
  );
};
