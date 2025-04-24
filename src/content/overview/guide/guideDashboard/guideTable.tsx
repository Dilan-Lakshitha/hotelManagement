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
import { deleteGuide } from "../../../../shared/service/guideService";

interface GuideTableProps {
  className?: string;
  Guides: any[];
  onEdit: (guide: any) => void;
}

interface Filters {
  name?: string;
}

const applyFilters = (Guides: any[], filters: Filters): any[] => {
  return Guides.filter((guide) => {
    let matches = true;
    if (
      filters.name &&
      !guide.customer_name.toLowerCase().includes(filters.name.toLowerCase())
    ) {
      matches = false;
    }
    return matches;
  });
};

const applyPagination = (
  Guides: any[],
  page: number,
  limit: number
): any[] => {
  return Guides.slice(page * limit, page * limit + limit);
};

const GuideTable: FC<GuideTableProps> = ({ Guides = [], onEdit }) => {
  const [selectedGuides, setSelectedGuides] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({ name: "" });
  const dispath: AppDispatch = useDispatch();

  const handleNameFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, name: e.target.value });
  };

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedGuides(
      event.target.checked ? Guides.map((p) => p.customer_id) : []
    );
  };

  const handleSelectOne = (
    event: ChangeEvent<HTMLInputElement>,
    id: string
  ): void => {
    setSelectedGuides((prev) =>
      event.target.checked ? [...prev, id] : prev.filter((pid) => pid !== id)
    );
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredGuides = applyFilters(Guides, filters);
  const paginatedGuides = applyPagination(filteredGuides, page, limit);
  const selectedSome =
    selectedGuides.length > 0 && selectedGuides.length < Guides.length;
  const selectedAll = selectedGuides.length === Guides.length;

  const handleDelete = (id: number) => {
    try {
      dispath(deleteGuide(id));
      toast.success("guide updated successfully! 🎉");
    } catch {
      toast.error("Operation failed. Please check your network.");
    }
  };

  return (
    <Card>
      <CardHeader
        title="guide Details"
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
              <TableCell>Guide Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Langugae</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedGuides.map((guide) => {
              const isSelected = selectedGuides.includes(
                guide.guideId.toString()
              );
              return (
                <TableRow key={guide.guideId} selected={isSelected} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isSelected}
                      onChange={(e) =>
                        handleSelectOne(e, guide.guideId.toString())
                      }
                    />
                  </TableCell>
                  {/* <TableCell>{guide.guideId}</TableCell> */}
                  <TableCell>{guide.name}</TableCell>
                  <TableCell>{guide.phone}</TableCell>
                  <TableCell>{guide.speakingLanguages}</TableCell>
                  <TableCell>${guide.pricePerDay?.toFixed(2)}</TableCell>
                  <TableCell>{guide.yearsOfExperience}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py- rounded-full text-sm font-medium ${
                        guide.isAvailable
                          ? "bg-green-200 text-green-900"
                          : "bg-red-200 text-red-900"
                      }`}
                    >
                      {guide.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <IconButton color="primary" onClick={() => onEdit(guide)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(guide.guideId)}
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
          count={filteredGuides.length}
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

export default GuideTable;
