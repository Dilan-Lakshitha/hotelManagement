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
import { deleteDriver } from "../../../../shared/service/driverService";

interface DriverTableProps {
  className?: string;
  Drivers: any[];
  onEdit: (driver: any) => void;
}

interface Filters {
  name?: string;
}

const applyFilters = (Drivers: any[], filters: Filters): any[] => {
  return Drivers.filter((driver) => {
    let matches = true;
    if (
      filters.name &&
      !driver.customer_name.toLowerCase().includes(filters.name.toLowerCase())
    ) {
      matches = false;
    }
    return matches;
  });
};

const applyPagination = (
  Drivers: any[],
  page: number,
  limit: number
): any[] => {
  return Drivers.slice(page * limit, page * limit + limit);
};

const DriverTable: FC<DriverTableProps> = ({ Drivers = [], onEdit }) => {
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({ name: "" });
  const dispath: AppDispatch = useDispatch();

  const handleNameFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, name: e.target.value });
  };

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedDrivers(
      event.target.checked ? Drivers.map((p) => p.customer_id) : []
    );
  };

  const handleSelectOne = (
    event: ChangeEvent<HTMLInputElement>,
    id: string
  ): void => {
    setSelectedDrivers((prev) =>
      event.target.checked ? [...prev, id] : prev.filter((pid) => pid !== id)
    );
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredDrivers = applyFilters(Drivers, filters);
  const paginatedDrivers = applyPagination(filteredDrivers, page, limit);
  const selectedSome =
    selectedDrivers.length > 0 && selectedDrivers.length < Drivers.length;
  const selectedAll = selectedDrivers.length === Drivers.length;

  const handleDelete = (id: number) => {
    try {
      dispath(deleteDriver(id));
      toast.success("driver updated successfully! 🎉");
    } catch {
      toast.error("Operation failed. Please check your network.");
    }
  };

  return (
    <Card>
      <CardHeader
        title="driver Details"
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
              <TableCell>ID</TableCell>
              <TableCell>Driver Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Vehicle Type</TableCell>
              <TableCell>Vehicle Price km</TableCell>
              <TableCell>Vehicle Capacity</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDrivers.map((driver) => {
              const isSelected = selectedDrivers.includes(
                driver.driverId.toString()
              );
              return (
                <TableRow key={driver.driverId} selected={isSelected} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isSelected}
                      onChange={(e) =>
                        handleSelectOne(e, driver.driverId.toString())
                      }
                    />
                  </TableCell>
                  <TableCell>{driver.driverId}</TableCell>
                  <TableCell>{driver.name}</TableCell>
                  <TableCell>{driver.phone}</TableCell>
                  <TableCell>{driver.vehicleType}</TableCell>
                  <TableCell>{driver.vehiclePricePerKm}</TableCell>
                  <TableCell>{driver.vehicleCapacity}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py- rounded-full text-sm font-medium ${
                        driver.isAvailable
                          ? "bg-green-200 text-green-900"
                          : "bg-red-200 text-red-900"
                      }`}
                    >
                      {driver.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <IconButton color="primary" onClick={() => onEdit(driver)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(driver.driverId)}
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
          count={filteredDrivers.length}
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

export default DriverTable;
