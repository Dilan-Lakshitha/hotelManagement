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
import { deleteHotel } from "../../../../shared/service/hotelService";

interface HotelTableProps {
  className?: string;
  Hotels: any[];
  onEdit: (hotel: any) => void;
}

interface Filters {
  name?: string;
}

const applyFilters = (Hotels: any[], filters: Filters): any[] => {
  return Hotels.filter((hotel) => {
    let matches = true;
    if (
      filters.name &&
      !hotel.customer_name.toLowerCase().includes(filters.name.toLowerCase())
    ) {
      matches = false;
    }
    return matches;
  });
};

const applyPagination = (
  Hotels: any[],
  page: number,
  limit: number
): any[] => {
  return Hotels.slice(page * limit, page * limit + limit);
};

const HotelTable: FC<HotelTableProps> = ({ Hotels = [], onEdit }) => {
  const [selectedHotels, setSelectedHotels] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({ name: "" });
  const dispath: AppDispatch = useDispatch();

  const handleNameFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, name: e.target.value });
  };

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedHotels(
      event.target.checked ? Hotels.map((p) => p.customer_id) : []
    );
  };

  const handleSelectOne = (
    event: ChangeEvent<HTMLInputElement>,
    id: string
  ): void => {
    setSelectedHotels((prev) =>
      event.target.checked ? [...prev, id] : prev.filter((pid) => pid !== id)
    );
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredHotels = applyFilters(Hotels, filters);
  const paginatedHotels = applyPagination(filteredHotels, page, limit);
  const selectedSome =
    selectedHotels.length > 0 && selectedHotels.length < Hotels.length;
  const selectedAll = selectedHotels.length === Hotels.length;

  const handleDelete = (id: number) => {
    try {
      dispath(deleteHotel(id));
      toast.success("Hotel updated successfully! 🎉");
    } catch {
      toast.error("Operation failed. Please check your network.");
    }
  };

  return (
    <Card>
      <CardHeader
        title="Hotel Details"
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
              <TableCell>Hotel Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedHotels.map((hotel) => {
              const isSelected = selectedHotels.includes(
                hotel.hotel_id.toString()
              );
              return (
                <TableRow key={hotel.hotel_id} selected={isSelected} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isSelected}
                      onChange={(e) =>
                        handleSelectOne(e, hotel.hotel_id.toString())
                      }
                    />
                  </TableCell>
                  {/* <TableCell>{hotel.hotelId}</TableCell> */}
                  <TableCell>{hotel.hotel_name}</TableCell>
                  <TableCell>{hotel.hotel_Contactno}</TableCell>
                  <TableCell>{hotel.hotel_email}</TableCell>
                  <TableCell>{hotel.hotel_address}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => onEdit(hotel)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(hotel.hotel_id)}
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
          count={filteredHotels.length}
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

export default HotelTable;
