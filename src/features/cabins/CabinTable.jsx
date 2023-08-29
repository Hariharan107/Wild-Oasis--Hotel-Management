import { useSearchParams } from "react-router-dom";
import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import { useCabins } from "./useCabins";
import { toast } from "react-hot-toast";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";

const CabinTable = () => {
  const { isLoading, cabins = [], error } = useCabins();
  const [searchParams] = useSearchParams();
  const filterValue = searchParams.get("discount") || "all";

  if (isLoading) return <Spinner />;
  if (error) return toast.error(error.message);
  // Filter cabins
  let filteredCabins = cabins;
  if (filterValue === "no-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
  if (filterValue === "with-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount > 0);
  //Sort cabins
  const sortBy = searchParams.get("sortBy") || "startDate-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;
  const sortedCabins = filteredCabins.sort(
    (a, b) => (a[field] - b[field]) * modifier
  );
  return (
    <Menus>
      <Table columns='0.6fr 1.8fr 2.2fr 1fr 1fr 1fr'>
        <Table.Header>
          <div></div>
          <div>Cabins</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={sortedCabins}
          render={(cabin) => <CabinRow key={cabin.id} cabin={cabin} />}
        />
      </Table>
    </Menus>
  );
};

export default CabinTable;
