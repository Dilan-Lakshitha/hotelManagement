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
import { deletelocation } from "../../../../shared/service/locationService";

interface LocationTableProps {
  className?: string;
  Locations: any[];
  onEdit: (location: any) => void;
}

interface Filters {
  name?: string;
}

const applyFilters = (Locations: any[], filters: Filters): any[] => {
  return Locations.filter((location) => {
    let matches = true;
    if (
      filters.name &&
      !location.customer_name.toLowerCase().includes(filters.name.toLowerCase())
    ) {
      matches = false;
    }
    return matches;
  });
};

const applyPagination = (
  Locations: any[],
  page: number,
  limit: number
): any[] => {
  return Locations.slice(page * limit, page * limit + limit);
};

const LocationTable: FC<LocationTableProps> = ({ Locations = [], onEdit }) => {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({ name: "" });
  const dispath: AppDispatch = useDispatch();

  const handleNameFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, name: e.target.value });
  };

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedLocations(
      event.target.checked ? Locations.map((p) => p.customer_id) : []
    );
  };

  const handleSelectOne = (
    event: ChangeEvent<HTMLInputElement>,
    id: string
  ): void => {
    setSelectedLocations((prev) =>
      event.target.checked ? [...prev, id] : prev.filter((pid) => pid !== id)
    );
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredLocations = applyFilters(Locations, filters);
  const paginatedLocations = applyPagination(filteredLocations, page, limit);
  const selectedSome =
    selectedLocations.length > 0 && selectedLocations.length < Locations.length;
  const selectedAll = selectedLocations.length === Locations.length;

  const handleDelete = (id: number) => {
    try {
      dispath(deletelocation(id));
      toast.success("Location updated successfully! 🎉");
    } catch {
      toast.error("Operation failed. Please check your network.");
    }
  };

  return (
    <Card>
      <CardHeader
        title="Location Details"
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
              <TableCell>Location Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Adult Price</TableCell>
              <TableCell>Child Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedLocations.map((location, index) => {
              const isSelected = selectedLocations.includes(
                location.location_ticket_id.toString()
              );
              return (
                <TableRow
                  key={`${location.location_ticket_id}-${index}`}
                  selected={isSelected}
                  hover
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isSelected}
                      onChange={(e) =>
                        handleSelectOne(
                          e,
                          location.location_ticket_id.toString()
                        )
                      }
                    />
                  </TableCell>
                  {/* <TableCell>{location.location_ticket_id}</TableCell> */}
                  <TableCell>{location.location_name}</TableCell>
                  <TableCell>{location.description}</TableCell>
                  <TableCell>${location.adult_price?.toFixed(2)}</TableCell>
                  <TableCell>${location.child_price?.toFixed(2)}</TableCell>

                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => onEdit(location)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(location.location_ticket_id)}
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
          count={filteredLocations.length}
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

export default LocationTable;
