import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'

const GlobalTable = ({headingList = [], children}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headingList.map((item, i) => (
              <TableCell key={i} sx={s.tableHeading}>
                {item.sort ? (
                  <TableSortLabel
                    active={true}
                    direction={item.sortType ? 'asc' : 'desc'}
                    onClick={item.handler}
                  >
                    {item.label}
                  </TableSortLabel>
                ) : (
                  <>{item.label}</>
                )}
              </TableCell>
            ))}
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
