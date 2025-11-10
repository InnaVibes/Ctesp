import { Table as TableReact } from "reactstrap";
import _ from "lodash";
import styles from "./styles.module.scss";

const Table = ({ columns = [], rows = {
    data: [],
    pagination: {}
}}) => {
  return (
    <TableReact hover>
      <thead>
        <tr>
          {columns.map((colum, index) => (
            <th key={index}>{colum}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.data.map((row, index) => {
          return (
            <tr key={index}>
            {
                columns.map((column) => {
                    return <td>{_.get(row, column)}</td>;
                })
            }
            </tr>
          );
        })}
      </tbody>
    </TableReact>
  );
};

export default Table;
