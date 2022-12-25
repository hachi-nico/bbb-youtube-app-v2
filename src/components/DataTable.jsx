import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'

const DataTable = ({
  headingList = [],
  children,
  filterComponents = null,
  size = 'small',
}) => {
  return (
    <TableContainer component={Paper} sx={{pt: 2}}>
      {filterComponents}
      <Table sx={{minWidth: 700}} aria-label="simple table" size={size}>
        <TableHead>
          <TableRow>
            {headingList.map((item, i) => {
              return item.sort ? (
                <TableCell key={i}>
                  <TableSortLabel
                    active={true}
                    direction={item.sortType ? 'asc' : 'desc'}
                    onClick={item.handler}
                  >
                    {item.label}
                  </TableSortLabel>
                </TableCell>
              ) : (
                <TableCell
                  key={i}
                  sx={
                    i == 0
                      ? {...s.tableHeading, width: 10}
                      : {...s.tableHeading}
                  }
                >
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

export default DataTable
