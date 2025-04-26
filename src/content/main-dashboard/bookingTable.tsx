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
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux-store/stores/store";

interface BookingtourTableProps {
  className?: string;
  Bookingtours: any[];
  driverList: any[];
  guideList: any[];
  travelerList: any[];
}

interface Filters {
  name?: string;
}

const applyFilters = (Bookingtours: any[], filters: Filters): any[] => {
  return Bookingtours.filter((bookingtour) => {
    let matches = true;
    if (
      filters.name &&
      !bookingtour.customer_name
        .toLowerCase()
        .includes(filters.name.toLowerCase())
    ) {
      matches = false;
    }
    return matches;
  });
};

const applyPagination = (
  Bookingtours: any[],
  page: number,
  limit: number
): any[] => {
  return Bookingtours.slice(page * limit, page * limit + limit);
};

const BookingtourTable: FC<BookingtourTableProps> = ({ Bookingtours = [] , driverList = [] , guideList = [] , travelerList = [] }) => {
  const [selectedBookingtours, setSelectedBookingtours] = useState<string[]>(
    []
  );
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({ name: "" });
  const dispath: AppDispatch = useDispatch();

  const handleNameFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, name: e.target.value });
  };

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedBookingtours(
      event.target.checked ? Bookingtours.map((p) => p.customer_id) : []
    );
  };

  const handleSelectOne = (
    event: ChangeEvent<HTMLInputElement>,
    id: string
  ): void => {
    setSelectedBookingtours((prev) =>
      event.target.checked ? [...prev, id] : prev.filter((pid) => pid !== id)
    );
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredBookingtours = applyFilters(Bookingtours, filters);
  const paginatedBookingtours = applyPagination(
    filteredBookingtours,
    page,
    limit
  );
  const selectedSome =
    selectedBookingtours.length > 0 &&
    selectedBookingtours.length < Bookingtours.length;
  const selectedAll = selectedBookingtours.length === Bookingtours.length;

  console.log(driverList , guideList)
  const findDriverName = (driverId: number) => {
    console.log(driverId)
    const driver = driverList.find((d) => d.driverId === driverId);
    return driver ? driver.name : "Unknown Driver";
  };

  const findGuideName = (guideId: number) => {
    console.log(guideId)
    const guide = guideList.find((g) => g.guideId === guideId);
    return guide ? guide.name : "Unknown Guide";
  };

  const findTravelerName = (travelerId: number) => {
    const traveler = travelerList.find((t) => t.traveler_id === travelerId);
    return traveler ? traveler.name : "Unknown Traveler";
  };

  const handleDelete = (id: number) => {
    try {
      //   dispath(deleteBookingtour(id));
      toast.success("Bookingtour updated successfully! 🎉");
    } catch {
      toast.error("Operation failed. Please check your network.");
    }
  };

  return (
    <Card>
      <CardHeader
        title="Bookingtour Details"
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
              {/* <TableCell>Bookingtour Name</TableCell> */}
              <TableCell>Traveler</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Guide</TableCell>
              <TableCell>Status</TableCell>
              {/* <TableCell>Actions</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBookingtours.map((bookingtour) => {
              const isSelected = selectedBookingtours.includes(
                bookingtour.booking_id.toString()
              );
              return (
                <TableRow
                  key={bookingtour.booking_id}
                  selected={isSelected}
                  hover
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isSelected}
                      onChange={(e) =>
                        handleSelectOne(e, bookingtour.booking_id.toString())
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {findTravelerName(bookingtour.traveler_id)}
                  </TableCell>
                  <TableCell>{findDriverName(bookingtour.driver_id)}</TableCell>
                  <TableCell>{findGuideName(bookingtour.guide_id)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py- rounded-full text-sm font-medium ${
                        bookingtour.booking_id
                          ? "bg-green-200 text-green-900"
                          : "bg-red-200 text-red-900"
                      }`}
                    >
                      {bookingtour.booking_id ? "Booked a tour" : "Unavailable"}
                    </span>
                  </TableCell>

                  <TableCell>
                    {/* <IconButton color="primary" onClick={() => onEdit(bookingtour)}>
                      <EditIcon />
                    </IconButton> */}
                    {/* <IconButton
                      color="error"
                      onClick={() => handleDelete(bookingtour.bookingtourId)}
                    >
                      <DeleteIcon />
                    </IconButton> */}
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
          count={filteredBookingtours.length}
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

export default BookingtourTable;
