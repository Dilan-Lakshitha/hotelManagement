import {
  Box,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { FC, useState, ChangeEvent } from "react";
import { toast } from "sonner";
import { AppDispatch } from "../../../../redux-store/stores/store";
import { useDispatch } from "react-redux";
import { deleteitinerary } from "../../../../shared/service/itineraryService";

interface ItineraryTableProps {
  className?: string;
  Itinerarys: any[];
  onEdit: (itinerary: any) => void;
}

interface Filters {
  name?: string;
}

const applyFilters = (Itinerarys: any[], filters: Filters): any[] => {
  return Itinerarys.filter((itinerary) => {
    let matches = true;
    if (
      filters.name &&
      !itinerary.customer_name
        .toLowerCase()
        .includes(filters.name.toLowerCase())
    ) {
      matches = false;
    }
    return matches;
  });
};

const applyPagination = (
  Itinerarys: any[],
  page: number,
  limit: number
): any[] => {
  return Itinerarys.slice(page * limit, page * limit + limit);
};

const ItineraryTable: FC<ItineraryTableProps> = ({
  Itinerarys = [],
  onEdit,
}) => {
  const [selectedItinerarys, setSelectedItinerarys] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({ name: "" });
  const dispath: AppDispatch = useDispatch();

  const handleNameFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, name: e.target.value });
  };

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedItinerarys(
      event.target.checked ? Itinerarys.map((p) => p.customer_id) : []
    );
  };

  const handleSelectOne = (
    event: ChangeEvent<HTMLInputElement>,
    id: string
  ): void => {
    setSelectedItinerarys((prev) =>
      event.target.checked ? [...prev, id] : prev.filter((pid) => pid !== id)
    );
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredItinerarys = applyFilters(Itinerarys, filters);
  const paginatedItinerarys = applyPagination(filteredItinerarys, page, limit);
  const selectedSome =
    selectedItinerarys.length > 0 &&
    selectedItinerarys.length < Itinerarys.length;
  const selectedAll = selectedItinerarys.length === Itinerarys.length;

  const handleDelete = (id: number) => {
    try {
      dispath(deleteitinerary(id));
      toast.success("Itinerary updated successfully! 🎉");
    } catch {
      toast.error("Operation failed. Please check your network.");
    }
  };

  return (
    <Card>
      <CardHeader
        title="Itinerary Details"
        action={
          <TextField
            label="Search by Name"
            variant="outlined"
            size="medium"
            value={filters.name}
            onChange={handleNameFilterChange}
          />
        }
      />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {/* <TableCell>ID</TableCell> */}
              <TableCell>Itinerary Name</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Days</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItinerarys.map((itinerary) => {
              const isSelected = selectedItinerarys.includes(
                itinerary.itinerary_id.toString()
              );
              return (
                <TableRow
                  key={itinerary.itinerary_id}
                  selected={isSelected}
                  hover
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isSelected}
                      onChange={(e) =>
                        handleSelectOne(e, itinerary.itinerary_id.toString())
                      }
                    />
                  </TableCell>
                  {/* <TableCell>{itinerary.itinerary_id}</TableCell> */}
                  <TableCell>{itinerary.itinerary_id}</TableCell>
                  <TableCell>
                    {new Date(itinerary.start_date).toISOString().split("T")[0]}
                  </TableCell>
                  <TableCell>
                    {new Date(itinerary.end_date).toISOString().split("T")[0]}
                  </TableCell>
                  <TableCell>
                    {Math.ceil(
                      (new Date(itinerary.end_date).getTime() -
                        new Date(itinerary.start_date).getTime()) /
                        (1000 * 60 * 60 * 24)
                    ) + 1}{" "}
                    Days
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => onEdit(itinerary)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(itinerary.itinerary_id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={filteredItinerarys.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>
    </Card>
  );
};

export default ItineraryTable;
