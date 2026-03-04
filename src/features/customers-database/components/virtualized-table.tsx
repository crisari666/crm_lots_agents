import React from "react";
import { RowCustomerDatabse } from "../slice/customer-disabled.state";
import { Paper, Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import { TableComponents } from "react-virtuoso";

export const VirtuosoTableComponents: TableComponents<RowCustomerDatabse> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} sx={{ borderCollapse: 'separate', }} />
  ),
  TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableHead {...props} ref={ref} />
  )),
  TableRow: ({ item: _item, ...props }) => <TableRow {...props}/>,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};