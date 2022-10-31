import React from 'react'

import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'

function SelectInput({
  width = 150,
  addtionalSx = {},
  labelSx = {},
  label = '',
  items = [],
  selectHandler = () => {},
  value = '',
}) {
  return (
    <FormControl sx={{minWidth: width, ...addtionalSx}} size="small">
      <InputLabel  sx={labelSx}>
        {label}
      </InputLabel>
      <Select value={value}  label={label} onChange={selectHandler}>
        {items.map((item, i) => (
          <MenuItem key={i} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default SelectInput
