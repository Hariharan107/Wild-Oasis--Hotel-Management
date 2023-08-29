import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";
const CabinTableOperations = () => {
  return (
    <TableOperations>
      <Filter
        filterField='discount'
        options={[
          { value: "all", label: "All" },
          { value: "no-discount", label: "No discount" },
          { value: "with-discount", label: "Discount" },
        ]}
      />
      <SortBy
        options={[
          { value: "name-asc", label: "Sort by name (A-Z)" },
          { value: "name-desc", label: "Sort by name (Z-A)" },
          { value: "regularPrice-asc", label: "Sort by price (min)" },
          { value: "regularPrice-desc", label: "Sort by price (max)" },
          { value: "maxCapacity-asc", label: "Sort by capacity (min)" },
          { value: "maxCapacity-desc", label: "Sort by capacity (max)" },
        ]}
      />
    </TableOperations>
  );
};

export default CabinTableOperations;
