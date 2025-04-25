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
import { deletetraveler } from "../../../../shared/service/travelerService";

interface TravelerTableProps {
  className?: string;
  Travelers: any[];
  onEdit: (traveler: any) => void;
}

interface Filters {
  name?: string;
}

const applyFilters = (Travelers: any[], filters: Filters): any[] => {
  return Travelers.filter((traveler) => {
    let matches = true;
    if (
      filters.name &&
      !traveler.customer_name.toLowerCase().includes(filters.name.toLowerCase())
    ) {
      matches = false;
    }
    return matches;
  });
};

const applyPagination = (
  Travelers: any[],
  page: number,
  limit: number
): any[] => {
  return Travelers.slice(page * limit, page * limit + limit);
};

const TravelerTable: FC<TravelerTableProps> = ({ Travelers = [], onEdit }) => {
  const [selectedTravelers, setSelectedTravelers] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({ name: "" });
  const dispath: AppDispatch = useDispatch();

  const handleNameFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, name: e.target.value });
  };

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedTravelers(
      event.target.checked ? Travelers.map((p) => p.customer_id) : []
    );
  };

  const handleSelectOne = (
    event: ChangeEvent<HTMLInputElement>,
    id: string
  ): void => {
    setSelectedTravelers((prev) =>
      event.target.checked ? [...prev, id] : prev.filter((pid) => pid !== id)
    );
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredTravelers = applyFilters(Travelers, filters);
  const paginatedTravelers = applyPagination(filteredTravelers, page, limit);
  const selectedSome =
    selectedTravelers.length > 0 && selectedTravelers.length < Travelers.length;
  const selectedAll = selectedTravelers.length === Travelers.length;

  const handleDelete = (id: number) => {
    try {
      dispath(deletetraveler(id));
      toast.success("Traveler updated successfully! 🎉");
    } catch {
      toast.error("Operation failed. Please check your network.");
    }
  };

  return (
    <Card>
      <CardHeader
        title="Traveler Details"
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
              <TableCell>Traveler Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Traveler Type</TableCell>
              <TableCell>Nationality</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTravelers.map((traveler) => {
              const isSelected = selectedTravelers.includes(
                traveler.traveler_id.toString()
              );
              return (
                <TableRow key={traveler.traveler_id} selected={isSelected} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isSelected}
                      onChange={(e) =>
                        handleSelectOne(e, traveler.traveler_id.toString())
                      }
                    />
                  </TableCell>
                  {/* <TableCell>{traveler.traveler_id}</TableCell> */}
                  <TableCell>{traveler.name}</TableCell>
                  <TableCell>{traveler.email}</TableCell>
                  <TableCell>{traveler.phone}</TableCell>
                  <TableCell>{traveler.traveler_type}</TableCell>
                  <TableCell>{traveler.nationality}</TableCell>

                  <TableCell>
                    <IconButton color="primary" onClick={() => onEdit(traveler)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(traveler.traveler_id)}
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
          count={filteredTravelers.length}
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

export default TravelerTable;