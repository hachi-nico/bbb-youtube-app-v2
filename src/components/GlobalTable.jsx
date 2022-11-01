import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'

const GlobalTable = ({headingList = [], children, filterComponents = null}) => {
  return (
    <TableContainer component={Paper} sx={{pt: 2}}>
      {filterComponents}
      <Table sx={{minWidth: 700}} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headingList.map((item, i) => {
              return item.sort ? (
                <TableCell key={i} sx={s.tableHeading}>
                  <TableSortLabel
                    active={true}
                    direction={item.sortType ? 'asc' : 'desc'}
                    onClick={item.handler}
                  >
                    {item.label}
                  </TableSortLabel>
                </TableCell>
              ) : (
                <TableCell key={i} sx={s.tableHeading}>
                  {item.label}
                </TableCell>
              )
            })}
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  )
}

const s = {
  tableHeading: {
    fontWeight: 'bold',
  },
}

export default GlobalTable
