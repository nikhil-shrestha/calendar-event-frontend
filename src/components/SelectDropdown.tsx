import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

interface Props {
  value: string;
  options: { value: string; label: string }[];
  onSort: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SelectDropdown({ value, options, onSort }: Props) {
  return (
    <TextField select size="small" value={value} onChange={onSort}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}